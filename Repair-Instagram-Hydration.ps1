[CmdletBinding()]
param(
    [string]$Downloads = (Join-Path $env:USERPROFILE 'Downloads'),
    [string]$OutputRoot = 'D:\website\instagram-repair'
)

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

New-Item -ItemType Directory -Force -Path $OutputRoot | Out-Null
$script:LogPath = Join-Path $OutputRoot 'instagram-repair.log'

function Write-Log {
    param(
        [Parameter(Mandatory = $true)][string]$Message,
        [ConsoleColor]$Color = [ConsoleColor]::Gray
    )

    $line = '[{0}] {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message
    Write-Host $line -ForegroundColor $Color
    Add-Content -LiteralPath $script:LogPath -Value $line -Encoding UTF8
}

function Get-PropertyValue {
    param(
        [AllowNull()][object]$Object,
        [Parameter(Mandatory = $true)][string]$Name
    )

    if ($null -eq $Object) { return $null }
    $property = $Object.PSObject.Properties[$Name]
    if ($null -eq $property) { return $null }
    return $property.Value
}

function Set-PropertyValue {
    param(
        [Parameter(Mandatory = $true)][object]$Object,
        [Parameter(Mandatory = $true)][string]$Name,
        [AllowNull()][object]$Value
    )

    $property = $Object.PSObject.Properties[$Name]
    if ($null -ne $property) {
        $property.Value = $Value
    }
    else {
        Add-Member -InputObject $Object -MemberType NoteProperty -Name $Name -Value $Value
    }
}

$script:ReservedNames = @{
    'p' = $true
    'reel' = $true
    'reels' = $true
    'tv' = $true
    'accounts' = $true
    'explore' = $true
    'direct' = $true
    'stories' = $true
    'about' = $true
    'developer' = $true
    'instagram' = $true
    'meta' = $true
    'facebook' = $true
    'graph' = $true
    'media' = $true
    'mjolkson' = $true
    'unknown' = $true
    'undefined' = $true
    'null' = $true
}

function Normalize-InstagramUsername {
    param([AllowNull()][object]$Value)

    if ($null -eq $Value) { return $null }
    $text = ([string]$Value).Trim()
    if ([string]::IsNullOrWhiteSpace($text)) { return $null }

    $text = [Net.WebUtility]::HtmlDecode($text)
    $text = $text.Replace('\/', '/')

    if ($text -match '^https?://') {
        try {
            $uri = [Uri]$text
            $first = ($uri.AbsolutePath.Trim('/') -split '/')[0]
            $text = $first
        }
        catch {
            return $null
        }
    }

    $atMatch = [regex]::Match($text, '@([A-Za-z0-9._]{1,30})')
    if ($atMatch.Success) {
        $text = $atMatch.Groups[1].Value
    }

    $text = $text.Trim().TrimStart('@').Trim('/')
    if ($text -notmatch '^[A-Za-z0-9._]{1,30}$') { return $null }

    $normalized = $text.ToLowerInvariant()
    if ($script:ReservedNames.ContainsKey($normalized)) { return $null }
    return $normalized
}

function Test-BadCreator {
    param([AllowNull()][object]$Value)
    return [string]::IsNullOrWhiteSpace((Normalize-InstagramUsername $Value))
}

function Test-HasCaption {
    param([AllowNull()][object]$Row)
    $caption = [string](Get-PropertyValue $Row 'caption')
    return -not [string]::IsNullOrWhiteSpace($caption)
}

function Get-RowKey {
    param([AllowNull()][object]$Row)

    if ($null -eq $Row) { return $null }

    $shortcode = [string](Get-PropertyValue $Row 'shortcode')
    if (-not [string]::IsNullOrWhiteSpace($shortcode)) {
        return 'sc:' + $shortcode.Trim().ToLowerInvariant()
    }

    $permalink = [string](Get-PropertyValue $Row 'permalink')
    if (-not [string]::IsNullOrWhiteSpace($permalink)) {
        $match = [regex]::Match($permalink, '/(?:p|reel|reels|tv)/([A-Za-z0-9_-]+)', [Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($match.Success) {
            return 'sc:' + $match.Groups[1].Value.ToLowerInvariant()
        }
        return 'url:' + $permalink.Trim().TrimEnd('/').ToLowerInvariant()
    }

    $mediaId = [string](Get-PropertyValue $Row 'mediaId')
    if (-not [string]::IsNullOrWhiteSpace($mediaId)) {
        return 'id:' + $mediaId.Trim()
    }

    return $null
}

function Read-DatasetCandidate {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [ValidateSet('likes', 'reposts')][string]$Kind
    )

    try {
        $json = Get-Content -Raw -LiteralPath $Path | ConvertFrom-Json
    }
    catch {
        Write-Log "Skipping unreadable JSON: $Path :: $($_.Exception.Message)" DarkYellow
        return $null
    }

    $rows = @()
    if ($json -is [System.Array]) {
        $rows = @($json)
    }
    else {
        $property = $json.PSObject.Properties[$Kind]
        if ($null -eq $property) { return $null }
        $rows = @($property.Value)
    }

    $rows = @($rows | Where-Object { $null -ne $_ -and $null -ne (Get-RowKey $_) })
    if ($rows.Count -eq 0) { return $null }

    $captions = 0
    $goodCreators = 0
    $dates = 0

    foreach ($row in $rows) {
        if (Test-HasCaption $row) { $captions++ }
        if (-not (Test-BadCreator (Get-PropertyValue $row 'creator'))) { $goodCreators++ }
        if (-not [string]::IsNullOrWhiteSpace([string](Get-PropertyValue $row 'postedAt'))) { $dates++ }
    }

    $file = Get-Item -LiteralPath $Path
    return [pscustomobject]@{
        Kind             = $Kind
        Path             = $Path
        Rows             = $rows
        RowCount         = $rows.Count
        CaptionCount     = $captions
        GoodCreatorCount = $goodCreators
        DateCount        = $dates
        LastWriteTimeUtc = $file.LastWriteTimeUtc
    }
}

function Get-DatasetCandidates {
    param([ValidateSet('likes', 'reposts')][string]$Kind)

    $files = @()
    foreach ($root in @($Downloads, $OutputRoot)) {
        if (Test-Path -LiteralPath $root) {
            $files += Get-ChildItem -LiteralPath $root -File -Filter '*.json' -ErrorAction SilentlyContinue |
                Where-Object { $_.Name -like 'instagram-*' }
        }
    }

    $unique = @{}
    foreach ($file in $files) {
        $unique[$file.FullName.ToLowerInvariant()] = $file.FullName
    }

    $candidates = @()
    foreach ($path in $unique.Values) {
        $candidate = Read-DatasetCandidate -Path $path -Kind $Kind
        if ($null -ne $candidate) { $candidates += $candidate }
    }

    return @($candidates)
}

function Merge-RowData {
    param(
        [Parameter(Mandatory = $true)][object]$Target,
        [Parameter(Mandatory = $true)][object]$Source
    )

    $targetCreator = Get-PropertyValue $Target 'creator'
    $sourceCreator = Get-PropertyValue $Source 'creator'
    if ((Test-BadCreator $targetCreator) -and -not (Test-BadCreator $sourceCreator)) {
        Set-PropertyValue $Target 'creator' (Normalize-InstagramUsername $sourceCreator)
    }

    $targetCaption = [string](Get-PropertyValue $Target 'caption')
    $sourceCaption = [string](Get-PropertyValue $Source 'caption')
    if ([string]::IsNullOrWhiteSpace($targetCaption) -and -not [string]::IsNullOrWhiteSpace($sourceCaption)) {
        Set-PropertyValue $Target 'caption' $sourceCaption
    }

    $fillOnly = @(
        'postedAt', 'fetchedAt', 'hydratedAt', 'metadataStatus', 'fetchStatus',
        'mediaType', 'permalink', 'shortcode', 'mediaId', 'thumbnail',
        'creatorOriginal', 'creatorDisplayName', 'creatorSource', 'creatorConfidence',
        'creatorRepairStatus', 'creatorRepairHttpStatus', 'captionSource',
        'captionRepairStatus', 'oembedTitle', 'metaHydratedAt'
    )

    foreach ($name in $fillOnly) {
        $targetValue = Get-PropertyValue $Target $name
        $sourceValue = Get-PropertyValue $Source $name
        if (($null -eq $targetValue -or [string]::IsNullOrWhiteSpace([string]$targetValue)) -and
            $null -ne $sourceValue -and -not [string]::IsNullOrWhiteSpace([string]$sourceValue)) {
            Set-PropertyValue $Target $name $sourceValue
        }
    }
}

function Merge-Dataset {
    param([ValidateSet('likes', 'reposts')][string]$Kind)

    $candidates = Get-DatasetCandidates -Kind $Kind
    if ($candidates.Count -eq 0) {
        throw "No usable Instagram $Kind JSON was found under $Downloads or $OutputRoot"
    }

    $sortProperties = @(
        @{ Expression = { $_.RowCount }; Descending = $true }
        @{ Expression = { $_.CaptionCount }; Descending = $true }
        @{ Expression = { $_.GoodCreatorCount }; Descending = $true }
        @{ Expression = { $_.DateCount }; Descending = $true }
        @{ Expression = { $_.LastWriteTimeUtc }; Descending = $true }
    )

    $base = $candidates |
        Sort-Object -Property $sortProperties |
        Select-Object -First 1

    Write-Log ("[{0}] Base: {1} | rows={2}, captions={3}, good creators={4}" -f $Kind.ToUpperInvariant(), $base.Path, $base.RowCount, $base.CaptionCount, $base.GoodCreatorCount) Cyan

    $map = New-Object System.Collections.Specialized.OrderedDictionary
    foreach ($row in $base.Rows) {
        $key = Get-RowKey $row
        if ($null -ne $key -and -not $map.Contains($key)) {
            $map.Add($key, $row)
        }
    }

    foreach ($candidate in ($candidates | Sort-Object LastWriteTimeUtc)) {
        foreach ($sourceRow in $candidate.Rows) {
            $key = Get-RowKey $sourceRow
            if ($null -eq $key) { continue }

            if ($map.Contains($key)) {
                Merge-RowData -Target $map[$key] -Source $sourceRow
            }
            else {
                $map.Add($key, $sourceRow)
            }
        }
    }

    $rows = @($map.Values)
    $orderField = if ($Kind -eq 'likes') { 'likeOrder' } else { 'repostOrder' }
    for ($i = 0; $i -lt $rows.Count; $i++) {
        Set-PropertyValue $rows[$i] $orderField ($i + 1)
    }

    return [pscustomobject]@{
        Kind        = $Kind
        Rows        = $rows
        SourceFiles = @($candidates.Path | Sort-Object -Unique)
        BasePath    = $base.Path
    }
}

function Get-RepairCounts {
    param([object[]]$Rows)

    $captions = 0
    $goodCreators = 0
    $badCreators = 0
    $fixedCreators = 0
    $unresolvedCreators = 0
    $captionsFromOEmbed = 0

    foreach ($row in $Rows) {
        if (Test-HasCaption $row) { $captions++ }
        if (Test-BadCreator (Get-PropertyValue $row 'creator')) { $badCreators++ } else { $goodCreators++ }
        if (([string](Get-PropertyValue $row 'creatorRepairStatus')) -eq 'fixed') { $fixedCreators++ }
        if (([string](Get-PropertyValue $row 'creatorRepairStatus')) -like 'unresolved*') { $unresolvedCreators++ }
        if (([string](Get-PropertyValue $row 'captionSource')) -eq 'meta_oembed_title') { $captionsFromOEmbed++ }
    }

    return [ordered]@{
        total                  = $Rows.Count
        captionsPresent        = $captions
        captionsMissing        = $Rows.Count - $captions
        goodCreators           = $goodCreators
        creatorsMissingOrBad   = $badCreators
        creatorsFixedThisData  = $fixedCreators
        creatorsUnresolved     = $unresolvedCreators
        captionsFromOEmbed     = $captionsFromOEmbed
    }
}

function Write-JsonAtomic {
    param(
        [Parameter(Mandatory = $true)][string]$Path,
        [Parameter(Mandatory = $true)][object]$Data
    )

    $temp = "$Path.tmp"
    $json = $Data | ConvertTo-Json -Depth 100
    $encoding = New-Object Text.UTF8Encoding($false)
    [IO.File]::WriteAllText($temp, $json, $encoding)

    if (Test-Path -LiteralPath $Path) {
        try {
            [IO.File]::Replace($temp, $Path, $null, $true)
        }
        catch {
            Copy-Item -LiteralPath $temp -Destination $Path -Force
            Remove-Item -LiteralPath $temp -Force
        }
    }
    else {
        [IO.File]::Move($temp, $Path)
    }
}

function Save-DatasetJson {
    param(
        [ValidateSet('likes', 'reposts')][string]$Kind,
        [object[]]$Rows,
        [string[]]$SourceFiles,
        [string]$Path,
        [string]$Status
    )

    $payload = [ordered]@{
        generatedAt   = (Get-Date).ToUniversalTime().ToString('o')
        source        = if ($Kind -eq 'likes') { 'Instagram Likes' } else { 'Instagram Reposts' }
        status        = $Status
        sourceFiles   = $SourceFiles
        count         = $Rows.Count
        repairSummary = Get-RepairCounts -Rows $Rows
    }
    $payload[$Kind] = $Rows
    Write-JsonAtomic -Path $Path -Data $payload
}

function Export-DatasetCsv {
    param(
        [ValidateSet('likes', 'reposts')][string]$Kind,
        [object[]]$Rows,
        [string]$Path
    )

    $orderField = if ($Kind -eq 'likes') { 'likeOrder' } else { 'repostOrder' }
    $flat = foreach ($row in $Rows) {
        [pscustomobject]@{
            order                   = Get-PropertyValue $row $orderField
            creator                 = Get-PropertyValue $row 'creator'
            creatorOriginal         = Get-PropertyValue $row 'creatorOriginal'
            creatorDisplayName      = Get-PropertyValue $row 'creatorDisplayName'
            creatorRepairStatus     = Get-PropertyValue $row 'creatorRepairStatus'
            creatorSource           = Get-PropertyValue $row 'creatorSource'
            creatorConfidence       = Get-PropertyValue $row 'creatorConfidence'
            creatorCandidates       = (@(Get-PropertyValue $row 'creatorCandidatesFromCaption') -join ' | ')
            caption                 = Get-PropertyValue $row 'caption'
            captionSource           = Get-PropertyValue $row 'captionSource'
            captionRepairStatus     = Get-PropertyValue $row 'captionRepairStatus'
            postedAt                = Get-PropertyValue $row 'postedAt'
            mediaType               = Get-PropertyValue $row 'mediaType'
            permalink               = Get-PropertyValue $row 'permalink'
            shortcode               = Get-PropertyValue $row 'shortcode'
            mediaId                 = Get-PropertyValue $row 'mediaId'
            metaHydrationHttpStatus = Get-PropertyValue $row 'metaHydrationHttpStatus'
            metaHydratedAt          = Get-PropertyValue $row 'metaHydratedAt'
        }
    }

    $flat | Export-Csv -LiteralPath $Path -NoTypeInformation -Encoding UTF8
}

function Get-CaptionHandles {
    param([AllowNull()][object]$Caption)

    $text = [string]$Caption
    if ([string]::IsNullOrWhiteSpace($text)) { return @() }

    $seen = @{}
    $result = @()
    foreach ($match in [regex]::Matches($text, '@([A-Za-z0-9._]{1,30})')) {
        $username = Normalize-InstagramUsername $match.Groups[1].Value
        if ($null -ne $username -and -not $seen.ContainsKey($username)) {
            $seen[$username] = $true
            $result += $username
            if ($result.Count -ge 10) { break }
        }
    }
    return @($result)
}

function Get-UsernameFromInstagramLinks {
    param([AllowNull()][object]$Text)

    $decoded = [Net.WebUtility]::HtmlDecode([string]$Text).Replace('\/', '/')
    foreach ($match in [regex]::Matches($decoded, 'https?://(?:www\.)?instagram\.com/([A-Za-z0-9._]{1,30})', [Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
        $username = Normalize-InstagramUsername $match.Groups[1].Value
        if ($null -ne $username) { return $username }
    }
    return $null
}

function Get-OEmbedAttribution {
    param([AllowNull()][object]$Data)

    $authorUrl = [string](Get-PropertyValue $Data 'author_url')
    $authorName = [Net.WebUtility]::HtmlDecode([string](Get-PropertyValue $Data 'author_name')).Trim()
    $title = [Net.WebUtility]::HtmlDecode([string](Get-PropertyValue $Data 'title')).Trim()
    $html = [Net.WebUtility]::HtmlDecode([string](Get-PropertyValue $Data 'html')).Replace('\/', '/')

    $username = Get-UsernameFromInstagramLinks $authorUrl
    if ($null -ne $username) {
        return [pscustomobject]@{ Username = $username; DisplayName = $authorName; Source = 'oembed_author_url'; Confidence = 'high' }
    }

    $username = Normalize-InstagramUsername $authorName
    if ($null -ne $username) {
        return [pscustomobject]@{ Username = $username; DisplayName = $authorName; Source = 'oembed_author_name'; Confidence = 'high' }
    }

    foreach ($source in @($authorName, $title)) {
        if ([string]::IsNullOrWhiteSpace($source)) { continue }
        $match = [regex]::Match($source, '@([A-Za-z0-9._]{1,30})')
        if ($match.Success) {
            $username = Normalize-InstagramUsername $match.Groups[1].Value
            if ($null -ne $username) {
                return [pscustomobject]@{ Username = $username; DisplayName = $authorName; Source = 'oembed_named_handle'; Confidence = 'medium' }
            }
        }
    }

    $titlePatterns = @(
        '^@?([A-Za-z0-9._]{1,30})\s+on Instagram',
        'Instagram (?:post|reel|video) by\s+@?([A-Za-z0-9._]{1,30})'
    )
    foreach ($pattern in $titlePatterns) {
        $match = [regex]::Match($title, $pattern, [Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($match.Success) {
            $username = Normalize-InstagramUsername $match.Groups[1].Value
            if ($null -ne $username) {
                return [pscustomobject]@{ Username = $username; DisplayName = $authorName; Source = 'oembed_title'; Confidence = 'medium' }
            }
        }
    }

    $username = Get-UsernameFromInstagramLinks $html
    if ($null -ne $username) {
        return [pscustomobject]@{ Username = $username; DisplayName = $authorName; Source = 'oembed_html_profile_link'; Confidence = 'medium' }
    }

    return [pscustomobject]@{ Username = $null; DisplayName = $authorName; Source = $null; Confidence = $null }
}

function Get-OEmbedCaptionCandidate {
    param(
        [AllowNull()][object]$Data,
        [AllowNull()][string]$Creator
    )

    $title = [Net.WebUtility]::HtmlDecode([string](Get-PropertyValue $Data 'title')).Trim()
    if ([string]::IsNullOrWhiteSpace($title)) { return $null }

    $patterns = @(
        '^[A-Za-z0-9._]+\s+on Instagram:\s*["“](.+?)["”]\s*$',
        '^Instagram (?:post|reel|video) by\s+.+?:\s*["“](.+?)["”]\s*$'
    )
    foreach ($pattern in $patterns) {
        $match = [regex]::Match($title, $pattern, [Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($match.Success) {
            $candidate = $match.Groups[1].Value.Trim()
            if ($candidate.Length -gt 1) { return $candidate }
        }
    }

    if ($title -match '^(Instagram|Post|Reel|Video|Photo)(\s|$)' -or
        $title -match '^Watch\s' -or
        $title -match '^View\s') {
        return $null
    }

    if (-not [string]::IsNullOrWhiteSpace($Creator) -and $title.ToLowerInvariant() -eq $Creator.ToLowerInvariant()) {
        return $null
    }

    if ($title.Length -ge 2) { return $title }
    return $null
}


function Decode-JsonCapturedString {
    param([AllowNull()][object]$Raw)

    $text = [string]$Raw
    if ([string]::IsNullOrWhiteSpace($text)) { return $null }

    try {
        $wrapper = '{"value":"' + $text + '"}'
        $decoded = $wrapper | ConvertFrom-Json
        return [string]$decoded.value
    }
    catch {
        return [Net.WebUtility]::HtmlDecode(
            $text.Replace('\\n', "`n").Replace('\\r', '').Replace('\\"', '"').Replace('\\/', '/').Replace('\\\\', '\')
        )
    }
}

function Get-EmbedPageMetadataFromHtml {
    param([Parameter(Mandatory = $true)][string]$Html)

    $username = $null
    $caption = $null
    $postedAt = $null

    $ownerPatterns = @(
        '"owner"\s*:\s*\{[\s\S]{0,5000}?"username"\s*:\s*"([A-Za-z0-9._]{1,30})"',
        '\\"owner\\"\s*:\s*\{[\s\S]{0,5000}?\\"username\\"\s*:\s*\\"([A-Za-z0-9._]{1,30})\\"',
        '"user"\s*:\s*\{[\s\S]{0,2500}?"username"\s*:\s*"([A-Za-z0-9._]{1,30})"'
    )

    foreach ($pattern in $ownerPatterns) {
        $match = [regex]::Match($Html, $pattern, [Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($match.Success) {
            $candidate = Normalize-InstagramUsername $match.Groups[1].Value
            if ($null -ne $candidate) {
                $username = $candidate
                break
            }
        }
    }

    if ($null -eq $username) {
        $decodedHtml = [Net.WebUtility]::HtmlDecode($Html).Replace('\/', '/')
        $username = Get-UsernameFromInstagramLinks $decodedHtml

        if ($null -eq $username) {
            foreach ($match in [regex]::Matches($decodedHtml, 'href=["'']/(?!p/|reel/|reels/|tv/|accounts/|explore/|direct/|stories/)([A-Za-z0-9._]{1,30})/', [Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
                $candidate = Normalize-InstagramUsername $match.Groups[1].Value
                if ($null -ne $candidate) {
                    $username = $candidate
                    break
                }
            }
        }
    }

    $captionPatterns = @(
        '"edge_media_to_caption"\s*:\s*\{[\s\S]{0,7000}?"text"\s*:\s*"((?:\\.|[^"\\])*)"',
        '"caption"\s*:\s*\{[\s\S]{0,5000}?"text"\s*:\s*"((?:\\.|[^"\\])*)"',
        '"caption_text"\s*:\s*"((?:\\.|[^"\\])*)"',
        '\\"caption\\"\s*:\s*\{[\s\S]{0,5000}?\\"text\\"\s*:\s*\\"((?:\\\\.|[^"\\])*)\\"'
    )

    foreach ($pattern in $captionPatterns) {
        $match = [regex]::Match($Html, $pattern, [Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($match.Success) {
            $candidate = Decode-JsonCapturedString $match.Groups[1].Value
            if (-not [string]::IsNullOrWhiteSpace($candidate)) {
                $caption = $candidate.Trim()
                break
            }
        }
    }

    $timeMatch = [regex]::Match($Html, '<time[^>]+datetime=["'']([^"'']+)', [Text.RegularExpressions.RegexOptions]::IgnoreCase)
    if ($timeMatch.Success) {
        $postedAt = [Net.WebUtility]::HtmlDecode($timeMatch.Groups[1].Value)
    }
    else {
        $timestampMatch = [regex]::Match($Html, '"(?:taken_at_timestamp|taken_at)"\s*:\s*(\d{9,13})', [Text.RegularExpressions.RegexOptions]::IgnoreCase)
        if ($timestampMatch.Success) {
            try {
                $timestamp = [int64]$timestampMatch.Groups[1].Value
                if ($timestamp -lt 10000000000) { $timestamp *= 1000 }
                $postedAt = [DateTimeOffset]::FromUnixTimeMilliseconds($timestamp).UtcDateTime.ToString('o')
            }
            catch { $postedAt = $null }
        }
    }

    return [pscustomobject]@{
        Username = $username
        Caption  = $caption
        PostedAt = $postedAt
    }
}

function Invoke-InstagramEmbedPage {
    param([Parameter(Mandatory = $true)][string]$Permalink)

    $base = $Permalink.TrimEnd('/')
    $uri = $base + '/embed/captioned/'
    $backoffSeconds = 120

    for ($attempt = 1; $attempt -le 10; $attempt++) {
        try {
            $response = $script:HttpClient.GetAsync($uri).GetAwaiter().GetResult()
            $status = [int]$response.StatusCode
            $bytes = $response.Content.ReadAsByteArrayAsync().GetAwaiter().GetResult()
            $content = [Text.Encoding]::UTF8.GetString($bytes)
            if ($content.Length -gt 0 -and $content[0] -eq [char]0xFEFF) { $content = $content.Substring(1) }

            if ($status -eq 200) {
                $parsed = Get-EmbedPageMetadataFromHtml -Html $content
                return [pscustomobject]@{
                    Success  = $true
                    Status   = $status
                    Username = $parsed.Username
                    Caption  = $parsed.Caption
                    PostedAt = $parsed.PostedAt
                    Error    = $null
                }
            }

            if ($status -eq 429) {
                Save-CurrentWorking
                $retryAfter = 0
                try {
                    if ($null -ne $response.Headers.RetryAfter.Delta) {
                        $retryAfter = [int][Math]::Ceiling($response.Headers.RetryAfter.Delta.TotalSeconds)
                    }
                }
                catch { $retryAfter = 0 }

                $wait = [Math]::Max($backoffSeconds, $retryAfter) + (Get-Random -Minimum 20 -Maximum 60)
                $wait = [Math]::Min($wait, 3600)
                Write-Log "HTTP 429 from Instagram embed. Waiting ~$([Math]::Ceiling($wait / 60)) min, then retrying SAME post ($attempt/10)." Yellow
                Start-Sleep -Seconds $wait
                $backoffSeconds = [Math]::Min([int]($backoffSeconds * 1.8), 3600)
                continue
            }

            if ($status -ge 500 -and $status -le 599) {
                $wait = [Math]::Min(30 * $attempt, 300) + (Get-Random -Minimum 5 -Maximum 20)
                Write-Log "Instagram embed HTTP $status. Waiting ${wait}s before retry ($attempt/10)." DarkYellow
                Start-Sleep -Seconds $wait
                continue
            }

            return [pscustomobject]@{
                Success = $false
                Status = $status
                Username = $null
                Caption = $null
                PostedAt = $null
                Error = $content
            }
        }
        catch {
            if ($attempt -ge 10) {
                return [pscustomobject]@{
                    Success = $false
                    Status = 0
                    Username = $null
                    Caption = $null
                    PostedAt = $null
                    Error = $_.Exception.Message
                }
            }

            $wait = [Math]::Min(30 * $attempt, 300)
            Write-Log "Instagram embed network error: $($_.Exception.Message). Waiting ${wait}s before retry ($attempt/10)." DarkYellow
            Start-Sleep -Seconds $wait
        }
    }

    return [pscustomobject]@{
        Success = $false
        Status = 0
        Username = $null
        Caption = $null
        PostedAt = $null
        Error = 'retry_limit'
    }
}

Add-Type -AssemblyName System.Net.Http
$handler = New-Object System.Net.Http.HttpClientHandler
$handler.AutomaticDecompression = [Net.DecompressionMethods]::GZip -bor [Net.DecompressionMethods]::Deflate
$script:HttpClient = New-Object System.Net.Http.HttpClient -ArgumentList $handler
$script:HttpClient.Timeout = [TimeSpan]::FromSeconds(60)
$script:HttpClient.DefaultRequestHeaders.TryAddWithoutValidation('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/151.0 Safari/537.36') | Out-Null
$script:HttpClient.DefaultRequestHeaders.TryAddWithoutValidation('Accept', 'application/json,text/plain,*/*') | Out-Null
$script:HttpClient.DefaultRequestHeaders.TryAddWithoutValidation('Accept-Language', 'en-US,en;q=0.9') | Out-Null

$script:CurrentKind = $null
$script:CurrentRows = $null
$script:CurrentSources = $null
$script:CurrentWorkPath = $null

function Save-CurrentWorking {
    if ($null -ne $script:CurrentRows -and -not [string]::IsNullOrWhiteSpace($script:CurrentWorkPath)) {
        Save-DatasetJson -Kind $script:CurrentKind -Rows $script:CurrentRows -SourceFiles $script:CurrentSources -Path $script:CurrentWorkPath -Status 'working'
    }
}

function Invoke-MetaOEmbed {
    param([Parameter(Mandatory = $true)][string]$Permalink)

    $encoded = [Uri]::EscapeDataString($Permalink)
    $uri = "https://graph.facebook.com/v25.0/instagram_oembed?url=$encoded&omitscript=true"
    $backoffSeconds = 60

    for ($attempt = 1; $attempt -le 12; $attempt++) {
        try {
            $response = $script:HttpClient.GetAsync($uri).GetAwaiter().GetResult()
            $status = [int]$response.StatusCode
            $bytes = $response.Content.ReadAsByteArrayAsync().GetAwaiter().GetResult()
            $content = [Text.Encoding]::UTF8.GetString($bytes)
            if ($content.Length -gt 0 -and $content[0] -eq [char]0xFEFF) { $content = $content.Substring(1) }

            if ($status -eq 200) {
                try {
                    $data = $content | ConvertFrom-Json
                    return [pscustomobject]@{ Success = $true; Status = $status; Data = $data; Error = $null }
                }
                catch {
                    return [pscustomobject]@{ Success = $false; Status = $status; Data = $null; Error = 'invalid_json' }
                }
            }

            if ($status -eq 429) {
                Save-CurrentWorking
                $retryAfter = 0
                try {
                    if ($null -ne $response.Headers.RetryAfter.Delta) {
                        $retryAfter = [int][Math]::Ceiling($response.Headers.RetryAfter.Delta.TotalSeconds)
                    }
                }
                catch { $retryAfter = 0 }

                $wait = [Math]::Max($backoffSeconds, $retryAfter) + (Get-Random -Minimum 10 -Maximum 45)
                $wait = [Math]::Min($wait, 3600)
                Write-Log "HTTP 429 from Meta oEmbed. Waiting ~$([Math]::Ceiling($wait / 60)) min, then retrying SAME post ($attempt/12)." Yellow
                Start-Sleep -Seconds $wait
                $backoffSeconds = [Math]::Min([int]($backoffSeconds * 1.8), 3600)
                continue
            }

            if ($status -ge 500 -and $status -le 599) {
                $wait = [Math]::Min(30 * $attempt, 300) + (Get-Random -Minimum 5 -Maximum 20)
                Write-Log "Meta oEmbed HTTP $status. Waiting ${wait}s before retry ($attempt/12)." DarkYellow
                Start-Sleep -Seconds $wait
                continue
            }

            return [pscustomobject]@{ Success = $false; Status = $status; Data = $null; Error = $content }
        }
        catch {
            if ($attempt -ge 12) {
                return [pscustomobject]@{ Success = $false; Status = 0; Data = $null; Error = $_.Exception.Message }
            }

            $wait = [Math]::Min(30 * $attempt, 300)
            Write-Log "Network error: $($_.Exception.Message). Waiting ${wait}s before retry ($attempt/12)." DarkYellow
            Start-Sleep -Seconds $wait
        }
    }

    return [pscustomobject]@{ Success = $false; Status = 0; Data = $null; Error = 'retry_limit' }
}

function Repair-Dataset {
    param([ValidateSet('likes', 'reposts')][string]$Kind)

    $merged = Merge-Dataset -Kind $Kind
    $rows = @($merged.Rows)
    $count = $rows.Count

    $workPath = Join-Path $OutputRoot ("instagram-{0}-{1}-REPAIR-WORKING.json" -f $count, $Kind)
    $finalPath = Join-Path $OutputRoot ("instagram-{0}-{1}-CREATOR-REPAIRED.json" -f $count, $Kind)
    $csvPath = Join-Path $OutputRoot ("instagram-{0}-{1}-CREATOR-REPAIRED.csv" -f $count, $Kind)

    $script:CurrentKind = $Kind
    $script:CurrentRows = $rows
    $script:CurrentSources = $merged.SourceFiles
    $script:CurrentWorkPath = $workPath

    Save-CurrentWorking

    $targets = @()
    for ($i = 0; $i -lt $rows.Count; $i++) {
        $creatorBad = Test-BadCreator (Get-PropertyValue $rows[$i] 'creator')
        $captionMissing = -not (Test-HasCaption $rows[$i])
        $permalink = [string](Get-PropertyValue $rows[$i] 'permalink')

        if (($creatorBad -or $captionMissing) -and -not [string]::IsNullOrWhiteSpace($permalink)) {
            $permanentStatus = [string](Get-PropertyValue $rows[$i] 'metaHydrationStatus')
            if ($permanentStatus -notmatch '^unavailable_HTTP_(400|404|410)$') {
                $targets += $i
            }
        }
    }

    Write-Log ("[{0}] {1} rows loaded; {2} need creator and/or caption metadata." -f $Kind.ToUpperInvariant(), $count, $targets.Count) Green

    $attempted = 0
    $fixedCreators = 0
    $captionsAdded = 0
    $lastSave = Get-Date

    foreach ($index in $targets) {
        $row = $rows[$index]
        $permalink = [string](Get-PropertyValue $row 'permalink')
        $oldCreator = Get-PropertyValue $row 'creator'
        $creatorWasBad = Test-BadCreator $oldCreator
        $captionWasMissing = -not (Test-HasCaption $row)

        if ($creatorWasBad -and
            -not [string]::IsNullOrWhiteSpace([string]$oldCreator) -and
            [string]::IsNullOrWhiteSpace([string](Get-PropertyValue $row 'creatorOriginal'))) {
            Set-PropertyValue $row 'creatorOriginal' ([string]$oldCreator)
        }

        $attempted++
        $result = Invoke-MetaOEmbed -Permalink $permalink
        Set-PropertyValue $row 'metaHydrationHttpStatus' $result.Status
        Set-PropertyValue $row 'metaHydratedAt' ((Get-Date).ToUniversalTime().ToString('o'))

        $oembedCaptionCandidate = $null

        if ($result.Success) {
            Set-PropertyValue $row 'metaHydrationStatus' 'oembed_ok'

            $title = [Net.WebUtility]::HtmlDecode([string](Get-PropertyValue $result.Data 'title')).Trim()
            if (-not [string]::IsNullOrWhiteSpace($title)) {
                Set-PropertyValue $row 'oembedTitle' $title
            }

            if ($creatorWasBad) {
                $attribution = Get-OEmbedAttribution -Data $result.Data
                if ($null -ne $attribution.Username) {
                    Set-PropertyValue $row 'creator' $attribution.Username
                    Set-PropertyValue $row 'creatorDisplayName' $attribution.DisplayName
                    Set-PropertyValue $row 'creatorSource' $attribution.Source
                    Set-PropertyValue $row 'creatorConfidence' $attribution.Confidence
                    Set-PropertyValue $row 'creatorRepairStatus' 'fixed'
                    $fixedCreators++
                }
                elseif (-not [string]::IsNullOrWhiteSpace($attribution.DisplayName)) {
                    Set-PropertyValue $row 'creatorDisplayName' $attribution.DisplayName
                }
            }

            if ($captionWasMissing) {
                $creatorNow = [string](Get-PropertyValue $row 'creator')
                $oembedCaptionCandidate = Get-OEmbedCaptionCandidate -Data $result.Data -Creator $creatorNow
            }
        }
        else {
            $statusLabel = if ($result.Status -gt 0) { "HTTP_$($result.Status)" } else { 'network_error' }
            Set-PropertyValue $row 'metaHydrationStatus' ("oembed_unavailable_{0}" -f $statusLabel)
            Set-PropertyValue $row 'metaHydrationError' ([string]$result.Error)
        }

        $creatorStillNeeded = $creatorWasBad -and (Test-BadCreator (Get-PropertyValue $row 'creator'))
        $captionStillNeeded = $captionWasMissing -and -not (Test-HasCaption $row)

        if ($creatorStillNeeded -or $captionStillNeeded) {
            $embedResult = Invoke-InstagramEmbedPage -Permalink $permalink
            Set-PropertyValue $row 'embedHydrationHttpStatus' $embedResult.Status

            if ($embedResult.Success) {
                Set-PropertyValue $row 'metaHydrationStatus' 'ok_embed_fallback'

                if ($creatorStillNeeded -and -not (Test-BadCreator $embedResult.Username)) {
                    Set-PropertyValue $row 'creator' (Normalize-InstagramUsername $embedResult.Username)
                    Set-PropertyValue $row 'creatorSource' 'instagram_embed_captioned'
                    Set-PropertyValue $row 'creatorConfidence' 'high'
                    Set-PropertyValue $row 'creatorRepairStatus' 'fixed'
                    $fixedCreators++
                    $creatorStillNeeded = $false
                }

                if ($captionStillNeeded -and -not [string]::IsNullOrWhiteSpace([string]$embedResult.Caption)) {
                    Set-PropertyValue $row 'caption' ([string]$embedResult.Caption)
                    Set-PropertyValue $row 'captionSource' 'instagram_embed_captioned'
                    Set-PropertyValue $row 'captionRepairStatus' 'filled_from_embed_captioned'
                    $captionsAdded++
                    $captionStillNeeded = $false
                }

                if ([string]::IsNullOrWhiteSpace([string](Get-PropertyValue $row 'postedAt')) -and
                    -not [string]::IsNullOrWhiteSpace([string]$embedResult.PostedAt)) {
                    Set-PropertyValue $row 'postedAt' ([string]$embedResult.PostedAt)
                }
            }
            else {
                $embedStatusLabel = if ($embedResult.Status -gt 0) { "HTTP_$($embedResult.Status)" } else { 'network_error' }
                Set-PropertyValue $row 'embedHydrationStatus' ("unavailable_{0}" -f $embedStatusLabel)
                Set-PropertyValue $row 'embedHydrationError' ([string]$embedResult.Error)
            }
        }

        # A real captioned-embed caption is stronger than an oEmbed title.
        # Use the title only when the captioned embed could not supply a caption.
        if ($captionWasMissing -and -not (Test-HasCaption $row) -and
            -not [string]::IsNullOrWhiteSpace([string]$oembedCaptionCandidate)) {
            Set-PropertyValue $row 'caption' ([string]$oembedCaptionCandidate)
            Set-PropertyValue $row 'captionSource' 'meta_oembed_title'
            Set-PropertyValue $row 'captionRepairStatus' 'filled_from_oembed_title'
            $captionsAdded++
        }

        if ($creatorWasBad -and (Test-BadCreator (Get-PropertyValue $row 'creator'))) {
            # Remove known contamination rather than leaving a fake author in the final data.
            Set-PropertyValue $row 'creator' $null
            Set-PropertyValue $row 'creatorRepairStatus' 'unresolved_no_verified_author'

            $handles = Get-CaptionHandles (Get-PropertyValue $row 'caption')
            if ($handles.Count -gt 0) {
                Set-PropertyValue $row 'creatorCandidatesFromCaption' $handles
            }
        }

        if ($captionWasMissing -and -not (Test-HasCaption $row)) {
            Set-PropertyValue $row 'captionRepairStatus' 'unresolved_no_verified_caption'
        }

        if (($attempted % 10) -eq 0 -or ((Get-Date) - $lastSave).TotalSeconds -ge 60) {
            Save-CurrentWorking
            $lastSave = Get-Date
            $counts = Get-RepairCounts -Rows $rows
            Write-Log ("[{0}] {1}/{2} attempted | good creators={3}/{4} | captions={5}/{4} | fixed this run={6}" -f $Kind.ToUpperInvariant(), $attempted, $targets.Count, $counts.goodCreators, $count, $counts.captionsPresent, $fixedCreators) Cyan
        }

        Start-Sleep -Milliseconds (Get-Random -Minimum 1200 -Maximum 2600)
    }

    Save-DatasetJson -Kind $Kind -Rows $rows -SourceFiles $merged.SourceFiles -Path $finalPath -Status 'creator_repair_complete'
    Export-DatasetCsv -Kind $Kind -Rows $rows -Path $csvPath
    Save-CurrentWorking

    $finalCounts = Get-RepairCounts -Rows $rows
    Write-Log ("[{0}] DONE | good creators={1}/{2}; captions={3}/{2}; creators fixed during run={4}; captions added={5}; unresolved creators={6}" -f $Kind.ToUpperInvariant(), $finalCounts.goodCreators, $count, $finalCounts.captionsPresent, $fixedCreators, $captionsAdded, $finalCounts.creatorsMissingOrBad) Green
    Write-Log "JSON: $finalPath" Green
    Write-Log "CSV:  $csvPath" Green

    return [pscustomobject]@{
        Kind       = $Kind
        Json       = $finalPath
        Csv        = $csvPath
        Count      = $count
        Repair     = $finalCounts
        SourceBase = $merged.BasePath
    }
}

Write-Log "Downloads: $Downloads" Gray
Write-Log "Output:    $OutputRoot" Gray
Write-Log 'Merging all candidate JSONs first, then repairing attribution through Meta oEmbed.' Cyan

$results = @()
try {
    # Reposts are smaller, so finish them first.
    $results += Repair-Dataset -Kind 'reposts'
    $results += Repair-Dataset -Kind 'likes'

    $summaryPath = Join-Path $OutputRoot 'instagram-repair-summary.json'
    Write-JsonAtomic -Path $summaryPath -Data ([ordered]@{
        generatedAt = (Get-Date).ToUniversalTime().ToString('o')
        results     = $results
    })

    Write-Host ''
    Write-Host '============================================' -ForegroundColor Green
    Write-Host 'INSTAGRAM REPAIR FINISHED' -ForegroundColor Green
    Write-Host '============================================' -ForegroundColor Green
    $results | Format-Table Kind, Count, Json, Csv -AutoSize
    Write-Host "Summary: $summaryPath" -ForegroundColor Cyan
}
finally {
    if ($null -ne $script:HttpClient) { $script:HttpClient.Dispose() }
    if ($null -ne $handler) { $handler.Dispose() }
}
