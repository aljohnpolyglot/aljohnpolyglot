$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$Root = 'D:\website'
$OutputRoot = Join-Path $Root 'youtube-liked-data'
$BrowserRoot = Join-Path $OutputRoot 'browser-profiles'
$ChromeUserData = Join-Path $env:LOCALAPPDATA 'Google\Chrome\User Data'
$LocalStatePath = Join-Path $ChromeUserData 'Local State'
$PlaylistUrl = 'https://www.youtube.com/playlist?list=LL'
$ManifestPath = Join-Path $OutputRoot 'manifest.json'
$AllAccountsPath = Join-Path $OutputRoot 'all-accounts.json'
$LogPath = Join-Path $OutputRoot 'collector.log'

$Accounts = @(
    [pscustomobject]@{ Language='indonesian'; Email='importantpudding@gmail.com'; Slug='indonesian-importantpudding' },
    [pscustomobject]@{ Language='spanish';    Email='holasoyaljohn@gmail.com';      Slug='spanish-holasoyaljohn' },
    [pscustomobject]@{ Language='french';     Email='monsiuerjeanlelait@gmail.com'; Slug='french-monsiuerjeanlelait' },
    [pscustomobject]@{ Language='brasil';     Email='lemakicatta@gmail.com';        Slug='brasil-lemakicatta' },
    [pscustomobject]@{ Language='russian';    Email='paintingprety3489@gmail.com';  Slug='russian-paintingprety3489' },
    [pscustomobject]@{ Language='italian';    Email='pitanbatman@gmail.com';        Slug='italian-pitanbatman' },
    [pscustomobject]@{ Language='german';     Email='mondwanderer6@gmail.com';      Slug='german-mondwanderer6' },
    [pscustomobject]@{ Language='swedish';    Email='magnusmjolkson@gmail.com';     Slug='swedish-magnusmjolkson' }
)

New-Item -ItemType Directory -Force -Path $OutputRoot, $BrowserRoot | Out-Null

function Write-Log {
    param([string]$Message)
    $line = '[{0}] {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message
    Write-Host $line
    Add-Content -LiteralPath $LogPath -Value $line -Encoding UTF8
}

function Write-JsonAtomic {
    param(
        [Parameter(Mandatory=$true)]$Object,
        [Parameter(Mandatory=$true)][string]$Path,
        [int]$Depth = 100
    )
    $tmp = "$Path.tmp"
    $json = $Object | ConvertTo-Json -Depth $Depth
    [IO.File]::WriteAllText($tmp, $json, [Text.UTF8Encoding]::new($false))
    Move-Item -Force -LiteralPath $tmp -Destination $Path
}

function Get-ChromeExecutable {
    $candidates = @(
        "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
        "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
        "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
    )
    foreach ($candidate in $candidates) {
        if ($candidate -and (Test-Path -LiteralPath $candidate)) {
            return $candidate
        }
    }
    throw 'Google Chrome executable was not found.'
}

function Get-InfoCache {
    if (-not (Test-Path -LiteralPath $LocalStatePath)) {
        throw "Chrome Local State not found: $LocalStatePath"
    }

    $map = @{}

    try {
        # Windows PowerShell 5.1 ConvertFrom-Json can fail on Chrome's
        # Local State because Chrome may contain property names that
        # differ only by letter case. JavaScriptSerializer preserves
        # those JSON keys without forcing them into a PSCustomObject.

        Add-Type `
            -AssemblyName System.Web.Extensions `
            -ErrorAction Stop

        $serializer =
            New-Object System.Web.Script.Serialization.JavaScriptSerializer

        $serializer.MaxJsonLength = [int]::MaxValue
        $serializer.RecursionLimit = 1024

        $raw = [IO.File]::ReadAllText(
            $LocalStatePath
        )

        $local = $serializer.DeserializeObject(
            $raw
        )

        $hasInfoCache =
            $local -is [System.Collections.IDictionary] -and
            $local.Contains('profile') -and
            $local['profile'] -is [System.Collections.IDictionary] -and
            $local['profile'].Contains('info_cache') -and
            $local['profile']['info_cache'] -is [System.Collections.IDictionary]

        if ($hasInfoCache) {
            $cache =
                $local['profile']['info_cache']

            foreach ($directory in $cache.Keys) {
                $info =
                    $cache[$directory]

                $name = $null
                $userName = $null
                $email = $null

                if ($info -is [System.Collections.IDictionary]) {
                    if ($info.Contains('name')) {
                        $name =
                            [string]$info['name']
                    }

                    if ($info.Contains('user_name')) {
                        $userName =
                            [string]$info['user_name']
                    }

                    if ($info.Contains('email')) {
                        $email =
                            [string]$info['email']
                    }
                }

                $map[[string]$directory] =
                    [pscustomobject]@{
                        name      = $name
                        user_name = $userName
                        email     = $email
                    }
            }
        }
    }
    catch {
        # Do not abort the whole automation. Profile discovery also
        # scans Preferences and Secure Preferences for each email.

        Write-Log (
            "WARNING: Chrome Local State parser fallback: {0}" -f
            $_.Exception.Message
        )
    }

    # Make sure all actual Chrome profile directories are represented,
    # even when Local State parsing supplied incomplete information.

    $profileDirs =
        Get-ChildItem `
            -LiteralPath $ChromeUserData `
            -Directory `
            -ErrorAction SilentlyContinue |
        Where-Object {
            $_.Name -eq 'Default' -or
            $_.Name -like 'Profile *'
        }

    foreach ($dir in $profileDirs) {
        if (-not $map.ContainsKey($dir.Name)) {
            $map[$dir.Name] =
                [pscustomobject]@{
                    name      = $dir.Name
                    user_name = $null
                    email     = $null
                }
        }
    }

    return $map
}

$InfoCache = Get-InfoCache

function Resolve-ChromeProfileDirectory {
    param([Parameter(Mandatory=$true)][string]$Email)

    $matches = New-Object System.Collections.Generic.List[string]

    foreach ($key in $InfoCache.Keys) {
        $info = $InfoCache[$key]
        $candidateEmails = @()
        foreach ($propertyName in @('user_name','email')) {
            if ($info.PSObject.Properties.Name -contains $propertyName) {
                $value = [string]$info.$propertyName
                if ($value) { $candidateEmails += $value }
            }
        }
        if ($candidateEmails | Where-Object { $_ -ieq $Email }) {
            $matches.Add($key)
        }
    }

    $profileDirs = Get-ChildItem -LiteralPath $ChromeUserData -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -eq 'Default' -or $_.Name -like 'Profile *' }

    foreach ($dir in $profileDirs) {
        if ($matches.Contains($dir.Name)) { continue }

        foreach ($fileName in @('Preferences','Secure Preferences')) {
            $file = Join-Path $dir.FullName $fileName
            if (-not (Test-Path -LiteralPath $file)) { continue }
            try {
                $raw = [IO.File]::ReadAllText($file)
                if ($raw.IndexOf($Email, [StringComparison]::OrdinalIgnoreCase) -ge 0) {
                    $matches.Add($dir.Name)
                    break
                }
            } catch {}
        }
    }

    $unique = @($matches | Select-Object -Unique)
    if ($unique.Count -eq 1) {
        return $unique[0]
    }
    if ($unique.Count -gt 1) {
        Write-Log "WARNING: Multiple Chrome profiles contain $Email : $($unique -join ', '). Using $($unique[0])."
        return $unique[0]
    }
    return $null
}

function Invoke-Robocopy {
    param(
        [Parameter(Mandatory=$true)][string]$Source,
        [Parameter(Mandatory=$true)][string]$Destination
    )
    if (-not (Test-Path -LiteralPath $Source)) { return }
    New-Item -ItemType Directory -Force -Path $Destination | Out-Null
    $args = @(
        $Source, $Destination,
        '/E','/R:2','/W:1','/ZB','/COPY:DAT','/DCOPY:DAT','/XJ',
        '/NFL','/NDL','/NJH','/NJS','/NP'
    )
    & robocopy @args | Out-Null
    $code = $LASTEXITCODE
    if ($code -gt 7) {
        throw "Robocopy failed ($code): $Source -> $Destination"
    }
}

function Copy-ChromeProfileSnapshot {
    param(
        [Parameter(Mandatory=$true)][string]$ProfileDirectory,
        [Parameter(Mandatory=$true)][string]$Slug
    )

    $snapshotRoot = Join-Path $BrowserRoot $Slug
    if (Test-Path -LiteralPath $snapshotRoot) {
        Remove-Item -LiteralPath $snapshotRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
    New-Item -ItemType Directory -Force -Path $snapshotRoot | Out-Null

    Copy-Item -LiteralPath $LocalStatePath -Destination (Join-Path $snapshotRoot 'Local State') -Force

    $sourceProfile = Join-Path $ChromeUserData $ProfileDirectory
    $destProfile = Join-Path $snapshotRoot $ProfileDirectory
    New-Item -ItemType Directory -Force -Path $destProfile | Out-Null

    foreach ($fileName in @(
        'Preferences',
        'Secure Preferences',
        'Web Data',
        'Web Data-journal',
        'Cookies',
        'Cookies-journal'
    )) {
        $src = Join-Path $sourceProfile $fileName
        if (Test-Path -LiteralPath $src) {
            try {
                Copy-Item -LiteralPath $src -Destination (Join-Path $destProfile $fileName) -Force
            } catch {
                Write-Log "Copy-Item could not copy $fileName; continuing because Network/Cookies is the important auth store."
            }
        }
    }

    foreach ($dirName in @(
        'Network',
        'Local Storage',
        'Session Storage',
        'IndexedDB'
    )) {
        Invoke-Robocopy -Source (Join-Path $sourceProfile $dirName) -Destination (Join-Path $destProfile $dirName)
    }

    return $snapshotRoot
}

function Stop-AutomationChrome {
    param([Parameter(Mandatory=$true)][string]$SnapshotRoot)
    $needle = $SnapshotRoot.ToLowerInvariant()
    try {
        Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" -ErrorAction SilentlyContinue |
            Where-Object {
                $_.CommandLine -and $_.CommandLine.ToLowerInvariant().Contains($needle)
            } |
            ForEach-Object {
                Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
            }
    } catch {}
}

function Wait-DebugEndpoint {
    param(
        [Parameter(Mandatory=$true)][int]$Port,
        [int]$TimeoutSeconds = 60
    )
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    do {
        try {
            return Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/version" -TimeoutSec 2
        } catch {
            Start-Sleep -Milliseconds 500
        }
    } while ((Get-Date) -lt $deadline)
    throw "Chrome debugging endpoint did not appear on port $Port."
}

function Get-OrCreateCdpTarget {
    param(
        [Parameter(Mandatory=$true)][int]$Port,
        [Parameter(Mandatory=$true)][string]$Url
    )

    $deadline = (Get-Date).AddSeconds(20)
    do {
        try {
            $targets = @(Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/list" -TimeoutSec 3)
            $match = $targets | Where-Object { $_.type -eq 'page' -and $_.url -like '*youtube.com/playlist*list=LL*' } | Select-Object -First 1
            if ($match) { return $match }
        } catch {}
        Start-Sleep -Milliseconds 500
    } while ((Get-Date) -lt $deadline)

    try {
        $encoded = [Uri]::EscapeDataString($Url)
        return Invoke-RestMethod -Method Put -Uri "http://127.0.0.1:$Port/json/new?$encoded" -TimeoutSec 10
    } catch {
        $targets = @(Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/list" -TimeoutSec 5)
        $page = $targets | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
        if ($page) { return $page }
        throw
    }
}

function New-CdpSocket {
    param([Parameter(Mandatory=$true)][string]$WebSocketUrl)
    $ws = [System.Net.WebSockets.ClientWebSocket]::new()
    $ws.ConnectAsync([Uri]$WebSocketUrl, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
    return $ws
}

function Receive-WebSocketText {
    param([Parameter(Mandatory=$true)][System.Net.WebSockets.ClientWebSocket]$Socket)
    $buffer = New-Object byte[] 65536
    $stream = [IO.MemoryStream]::new()
    try {
        do {
            $segment = [System.ArraySegment[byte]]::new($buffer)
            $result = $Socket.ReceiveAsync($segment, [Threading.CancellationToken]::None).GetAwaiter().GetResult()
            if ($result.MessageType -eq [System.Net.WebSockets.WebSocketMessageType]::Close) {
                throw 'Chrome CDP WebSocket closed.'
            }
            if ($result.Count -gt 0) {
                $stream.Write($buffer, 0, $result.Count)
            }
        } while (-not $result.EndOfMessage)

        return [Text.Encoding]::UTF8.GetString($stream.ToArray())
    }
    finally {
        $stream.Dispose()
    }
}

$script:CdpId = 0

function Invoke-Cdp {
    param(
        [Parameter(Mandatory=$true)][System.Net.WebSockets.ClientWebSocket]$Socket,
        [Parameter(Mandatory=$true)][string]$Method,
        $Params = $null
    )

    $script:CdpId++
    $id = $script:CdpId
    $message = [ordered]@{ id = $id; method = $Method }
    if ($null -ne $Params) { $message.params = $Params }
    $json = $message | ConvertTo-Json -Depth 50 -Compress
    $bytes = [Text.Encoding]::UTF8.GetBytes($json)
    $segment = [System.ArraySegment[byte]]::new($bytes)
    $Socket.SendAsync(
        $segment,
        [System.Net.WebSockets.WebSocketMessageType]::Text,
        $true,
        [Threading.CancellationToken]::None
    ).GetAwaiter().GetResult()

    while ($true) {
        $text = Receive-WebSocketText -Socket $Socket
        $obj = $text | ConvertFrom-Json
        if ($obj.PSObject.Properties.Name -contains 'id' -and [int]$obj.id -eq $id) {
            if ($obj.PSObject.Properties.Name -contains 'error') {
                throw "CDP error for $Method : $($obj.error.message)"
            }
            return $obj
        }
    }
}

function Invoke-CdpEval {
    param(
        [Parameter(Mandatory=$true)][System.Net.WebSockets.ClientWebSocket]$Socket,
        [Parameter(Mandatory=$true)][string]$Expression,
        [bool]$AwaitPromise = $false
    )
    $resp = Invoke-Cdp -Socket $Socket -Method 'Runtime.evaluate' -Params @{
        expression = $Expression
        returnByValue = $true
        awaitPromise = $AwaitPromise
        userGesture = $false
    }
    if ($null -ne $resp.result.exceptionDetails) {
        throw "JavaScript exception: $($resp.result.exceptionDetails.text)"
    }
    return $resp.result.result.value
}

$CollectorJs = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('KCgpID0+IHsKICBjb25zdCBzdGF0ZSA9IHdpbmRvdy5fX1lUX0FVVE9fU1RBVEUgPSB7CiAgICBydW5uaW5nOiB0cnVlLAogICAgY29tcGxldGU6IGZhbHNlLAogICAgYXV0aFJlcXVpcmVkOiBmYWxzZSwKICAgIGNvbGxlY3RlZDogMCwKICAgIHJvdW5kczogMCwKICAgIHN0YWJsZUJvdHRvbVJvdW5kczogMCwKICAgIGRlY2xhcmVkUGxheWxpc3RDb3VudDogbnVsbCwKICAgIGVuZFJlYXNvbjogbnVsbCwKICAgIGVycm9yOiBudWxsLAogICAgc3RhcnRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkKICB9OwoKICB3aW5kb3cuX19ZVF9BVVRPX1BST01JU0UgPSAoYXN5bmMgKCkgPT4gewogICAgY29uc3Qgc2xlZXAgPSBtcyA9PiBuZXcgUHJvbWlzZShyID0+IHNldFRpbWVvdXQociwgbXMpKTsKICAgIGNvbnN0IGNsZWFuID0gdiA9PiBTdHJpbmcodiA/PyAnJykucmVwbGFjZSgvXHUwMGEwL2csICcgJykucmVwbGFjZSgvXHMrL2csICcgJykudHJpbSgpOwogICAgY29uc3QgZGF0YSA9IG5ldyBNYXAoKTsKICAgIGxldCBmaXJzdFNlZW4gPSAwOwoKICAgIGNvbnN0IGdldFZpZGVvSWQgPSBocmVmID0+IHsKICAgICAgaWYgKCFocmVmKSByZXR1cm4gbnVsbDsKICAgICAgdHJ5IHsKICAgICAgICBjb25zdCB1ID0gbmV3IFVSTChocmVmLCBsb2NhdGlvbi5vcmlnaW4pOwogICAgICAgIGlmICh1LnBhdGhuYW1lID09PSAnL3dhdGNoJykgcmV0dXJuIHUuc2VhcmNoUGFyYW1zLmdldCgndicpOwogICAgICAgIGxldCBtID0gdS5wYXRobmFtZS5tYXRjaCgvXlwvc2hvcnRzXC8oW0EtWmEtejAtOV8tXXs2LH0pLyk7CiAgICAgICAgaWYgKG0pIHJldHVybiBtWzFdOwogICAgICAgIG0gPSB1LnBhdGhuYW1lLm1hdGNoKC9eXC9saXZlXC8oW0EtWmEtejAtOV8tXXs2LH0pLyk7CiAgICAgICAgaWYgKG0pIHJldHVybiBtWzFdOwogICAgICB9IGNhdGNoIHt9CiAgICAgIHJldHVybiBudWxsOwogICAgfTsKCiAgICBjb25zdCBwYXJzZVZpZXdzID0gdGV4dCA9PiB7CiAgICAgIGlmICghdGV4dCkgcmV0dXJuIHsgdGV4dDogbnVsbCwgbnVtYmVyOiBudWxsIH07CiAgICAgIGNvbnN0IHBhdHRlcm5zID0gWwogICAgICAgIC8oW1xkLixdK1xzKltLTUJdPylccyt2aWV3cz8vaSwKICAgICAgICAvKFtcZC4sXStccypbS01CXT8pXHMrdmlzdWFsaXphY2lvbmVzPy9pLAogICAgICAgIC8oW1xkLixdK1xzKltLTUJdPylccyt2dWVzPy9pLAogICAgICAgIC8oW1xkLixdK1xzKltLTUJdPylccyt2aXN1YWxpenphemlvbmkvaSwKICAgICAgICAvKFtcZC4sXStccypbS01CXT8pXHMrQXVmcnVmZS9pLAogICAgICAgIC8oW1xkLixdK1xzKltLTUJdPylccyt2aXN1YWxpemEoPzrDp3xjKcO1ZXMvaSwKICAgICAgICAvKFtcZC4sXStccypbS01CXT8pXHMrdGF5YW5nYW4vaQogICAgICBdOwogICAgICBsZXQgcmF3ID0gbnVsbDsKICAgICAgZm9yIChjb25zdCBwIG9mIHBhdHRlcm5zKSB7CiAgICAgICAgY29uc3QgbSA9IHRleHQubWF0Y2gocCk7CiAgICAgICAgaWYgKG0pIHsgcmF3ID0gY2xlYW4obVsxXSk7IGJyZWFrOyB9CiAgICAgIH0KICAgICAgaWYgKCFyYXcpIHJldHVybiB7IHRleHQ6IG51bGwsIG51bWJlcjogbnVsbCB9OwogICAgICBsZXQgcyA9IHJhdy5yZXBsYWNlKC9ccy9nLCAnJyk7CiAgICAgIGxldCBtdWx0ID0gMTsKICAgICAgY29uc3Qgc3VmZml4ID0gcy5zbGljZSgtMSkudG9VcHBlckNhc2UoKTsKICAgICAgaWYgKHN1ZmZpeCA9PT0gJ0snKSB7IG11bHQgPSAxZTM7IHMgPSBzLnNsaWNlKDAsIC0xKTsgfQogICAgICBlbHNlIGlmIChzdWZmaXggPT09ICdNJykgeyBtdWx0ID0gMWU2OyBzID0gcy5zbGljZSgwLCAtMSk7IH0KICAgICAgZWxzZSBpZiAoc3VmZml4ID09PSAnQicpIHsgbXVsdCA9IDFlOTsgcyA9IHMuc2xpY2UoMCwgLTEpOyB9CgogICAgICBjb25zdCBjb21tYSA9IHMubGFzdEluZGV4T2YoJywnKTsKICAgICAgY29uc3QgZG90ID0gcy5sYXN0SW5kZXhPZignLicpOwogICAgICBpZiAoY29tbWEgPj0gMCAmJiBkb3QgPj0gMCkgewogICAgICAgIGlmIChjb21tYSA+IGRvdCkgcyA9IHMucmVwbGFjZSgvXC4vZywgJycpLnJlcGxhY2UoJywnLCAnLicpOwogICAgICAgIGVsc2UgcyA9IHMucmVwbGFjZSgvLC9nLCAnJyk7CiAgICAgIH0gZWxzZSBpZiAoY29tbWEgPj0gMCkgewogICAgICAgIGlmIChtdWx0ID4gMSkgcyA9IHMucmVwbGFjZSgnLCcsICcuJyk7CiAgICAgICAgZWxzZSBpZiAoL15cZHsxLDN9KCxcZHszfSkrJC8udGVzdChzKSkgcyA9IHMucmVwbGFjZSgvLC9nLCAnJyk7CiAgICAgICAgZWxzZSBzID0gcy5yZXBsYWNlKCcsJywgJy4nKTsKICAgICAgfSBlbHNlIGlmIChkb3QgPj0gMCAmJiBtdWx0ID09PSAxICYmIC9eXGR7MSwzfShcLlxkezN9KSskLy50ZXN0KHMpKSB7CiAgICAgICAgcyA9IHMucmVwbGFjZSgvXC4vZywgJycpOwogICAgICB9CiAgICAgIGNvbnN0IG4gPSBOdW1iZXIocyk7CiAgICAgIHJldHVybiB7CiAgICAgICAgdGV4dDogcmF3LAogICAgICAgIG51bWJlcjogTnVtYmVyLmlzRmluaXRlKG4pID8gTWF0aC5yb3VuZChuICogbXVsdCkgOiBudWxsCiAgICAgIH07CiAgICB9OwoKICAgIGNvbnN0IGR1cmF0aW9uRnJvbSA9IHJvdyA9PiB7CiAgICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSBbCiAgICAgICAgLi4ucm93LnF1ZXJ5U2VsZWN0b3JBbGwoCiAgICAgICAgICAneXRkLXRodW1ibmFpbC1vdmVybGF5LXRpbWUtc3RhdHVzLXJlbmRlcmVyICN0ZXh0LCcgKwogICAgICAgICAgJy55dC1iYWRnZS1zaGFwZV9fdGV4dCwnICsKICAgICAgICAgICcuYmFkZ2Utc2hhcGUtd2l6X190ZXh0LCcgKwogICAgICAgICAgJ1tvdmVybGF5LXN0eWxlPSJERUZBVUxUIl0gI3RleHQnCiAgICAgICAgKQogICAgICBdOwogICAgICBmb3IgKGNvbnN0IGUgb2YgY2FuZGlkYXRlcykgewogICAgICAgIGNvbnN0IHQgPSBjbGVhbihlLnRleHRDb250ZW50KTsKICAgICAgICBpZiAoL15cZHsxLDN9OlxkezJ9KD86OlxkezJ9KT8kLy50ZXN0KHQpKSByZXR1cm4gdDsKICAgICAgfQogICAgICByZXR1cm4gbnVsbDsKICAgIH07CgogICAgY29uc3QgcGFyc2VSb3cgPSByb3cgPT4gewogICAgICBjb25zdCBhbmNob3JzID0gWwogICAgICAgIC4uLnJvdy5xdWVyeVNlbGVjdG9yQWxsKCdhW2hyZWYqPSIvd2F0Y2g/dj0iXSxhW2hyZWYqPSIvc2hvcnRzLyJdLGFbaHJlZio9Ii9saXZlLyJdJykKICAgICAgXTsKICAgICAgbGV0IGxpbmsgPSBudWxsOwogICAgICBsZXQgdmlkZW9JZCA9IG51bGw7CiAgICAgIGZvciAoY29uc3QgYSBvZiBhbmNob3JzKSB7CiAgICAgICAgY29uc3QgaWQgPSBnZXRWaWRlb0lkKGEuZ2V0QXR0cmlidXRlKCdocmVmJykpOwogICAgICAgIGlmIChpZCkgeyBsaW5rID0gYTsgdmlkZW9JZCA9IGlkOyBicmVhazsgfQogICAgICB9CiAgICAgIGlmICghdmlkZW9JZCkgcmV0dXJuIG51bGw7CgogICAgICBjb25zdCB0aXRsZUVsID0KICAgICAgICByb3cucXVlcnlTZWxlY3RvcignI3ZpZGVvLXRpdGxlJykgfHwKICAgICAgICByb3cucXVlcnlTZWxlY3RvcignLnl0TG9ja3VwTWV0YWRhdGFWaWV3TW9kZWxUaXRsZScpIHx8CiAgICAgICAgbGluazsKCiAgICAgIGNvbnN0IHRpdGxlID0KICAgICAgICBjbGVhbih0aXRsZUVsPy5nZXRBdHRyaWJ1dGUoJ3RpdGxlJykpIHx8CiAgICAgICAgY2xlYW4odGl0bGVFbD8udGV4dENvbnRlbnQpIHx8CiAgICAgICAgY2xlYW4odGl0bGVFbD8uZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJykpIHx8CiAgICAgICAgbnVsbDsKCiAgICAgIGNvbnN0IGNoYW5uZWxMaW5rID0gcm93LnF1ZXJ5U2VsZWN0b3IoCiAgICAgICAgJ2FbaHJlZl49Ii9AIl0sYVtocmVmKj0iL2NoYW5uZWwvIl0sYVtocmVmKj0iL2MvIl0sYVtocmVmKj0iL3VzZXIvIl0nCiAgICAgICk7CiAgICAgIGNvbnN0IGNoYW5uZWxOYW1lID0gY2xlYW4oY2hhbm5lbExpbms/LnRleHRDb250ZW50KSB8fCBudWxsOwogICAgICBsZXQgY2hhbm5lbFVybCA9IG51bGw7CiAgICAgIGlmIChjaGFubmVsTGluaz8uZ2V0QXR0cmlidXRlKCdocmVmJykpIHsKICAgICAgICB0cnkgeyBjaGFubmVsVXJsID0gbmV3IFVSTChjaGFubmVsTGluay5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSwgbG9jYXRpb24ub3JpZ2luKS5ocmVmOyB9IGNhdGNoIHt9CiAgICAgIH0KCiAgICAgIGNvbnN0IGF2YXRhciA9CiAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJy55dExvY2t1cE1ldGFkYXRhVmlld01vZGVsQXZhdGFyIGltZycpIHx8CiAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ3l0LWF2YXRhci1zaGFwZSBpbWcnKSB8fAogICAgICAgIHJvdy5xdWVyeVNlbGVjdG9yKCcueXQtc3BlYy1hdmF0YXItc2hhcGVfX2ltYWdlJyk7CgogICAgICBjb25zdCB0aHVtYiA9CiAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJy55dFRodW1ibmFpbFZpZXdNb2RlbEltYWdlIGltZycpIHx8CiAgICAgICAgcm93LnF1ZXJ5U2VsZWN0b3IoJ3l0ZC10aHVtYm5haWwgaW1nJykgfHwKICAgICAgICByb3cucXVlcnlTZWxlY3RvcigneXQtaW1hZ2UgaW1nJyk7CgogICAgICBjb25zdCBtZXRhZGF0YVBhcnRzID0gW107CiAgICAgIGZvciAoY29uc3QgZSBvZiByb3cucXVlcnlTZWxlY3RvckFsbCgKICAgICAgICAnLnl0Q29udGVudE1ldGFkYXRhVmlld01vZGVsTWV0YWRhdGFSb3csLmlubGluZS1tZXRhZGF0YS1pdGVtLCNtZXRhZGF0YS1saW5lLCNtZXRhZGF0YS1saW5lIHNwYW4nCiAgICAgICkpIHsKICAgICAgICBjb25zdCB0ID0gY2xlYW4oZS50ZXh0Q29udGVudCk7CiAgICAgICAgaWYgKHQgJiYgIW1ldGFkYXRhUGFydHMuaW5jbHVkZXModCkpIG1ldGFkYXRhUGFydHMucHVzaCh0KTsKICAgICAgfQogICAgICBjb25zdCBtZXRhZGF0YSA9IG1ldGFkYXRhUGFydHMuam9pbignIOKAoiAnKTsKICAgICAgY29uc3Qgdmlld3MgPSBwYXJzZVZpZXdzKG1ldGFkYXRhKTsKCiAgICAgIGxldCBwbGF5bGlzdE9yZGVyID0gbnVsbDsKICAgICAgY29uc3QgaW5kZXhFbCA9IHJvdy5xdWVyeVNlbGVjdG9yKCcjaW5kZXgsLmluZGV4LFtpZD0iaW5kZXgiXScpOwogICAgICBjb25zdCBpZHggPSBjbGVhbihpbmRleEVsPy50ZXh0Q29udGVudCkubWF0Y2goL1xkKy8pOwogICAgICBpZiAoaWR4KSB7CiAgICAgICAgY29uc3QgbiA9IE51bWJlcihpZHhbMF0pOwogICAgICAgIGlmIChOdW1iZXIuaXNGaW5pdGUobikpIHBsYXlsaXN0T3JkZXIgPSBuOwogICAgICB9CgogICAgICByZXR1cm4gewogICAgICAgIHZpZGVvSWQsCiAgICAgICAgcGxheWxpc3RPcmRlciwKICAgICAgICB0aXRsZSwKICAgICAgICB2aWRlb1VybDogYGh0dHBzOi8vd3d3LnlvdXR1YmUuY29tL3dhdGNoP3Y9JHt2aWRlb0lkfWAsCiAgICAgICAgY2hhbm5lbDogewogICAgICAgICAgbmFtZTogY2hhbm5lbE5hbWUsCiAgICAgICAgICB1cmw6IGNoYW5uZWxVcmwsCiAgICAgICAgICBpbWFnZVVybDogYXZhdGFyID8gKGF2YXRhci5jdXJyZW50U3JjIHx8IGF2YXRhci5zcmMgfHwgYXZhdGFyLmdldEF0dHJpYnV0ZSgnc3JjJykpIDogbnVsbAogICAgICAgIH0sCiAgICAgICAgdGh1bWJuYWlsVXJsOiB0aHVtYgogICAgICAgICAgPyAodGh1bWIuY3VycmVudFNyYyB8fCB0aHVtYi5zcmMgfHwgdGh1bWIuZ2V0QXR0cmlidXRlKCdzcmMnKSkKICAgICAgICAgIDogYGh0dHBzOi8vaS55dGltZy5jb20vdmkvJHt2aWRlb0lkfS9ocWRlZmF1bHQuanBnYCwKICAgICAgICBkdXJhdGlvbjogZHVyYXRpb25Gcm9tKHJvdyksCiAgICAgICAgdmlld3M6IHsKICAgICAgICAgIHRleHQ6IHZpZXdzLnRleHQsCiAgICAgICAgICBudW1iZXI6IHZpZXdzLm51bWJlciwKICAgICAgICAgIG5vdGU6ICdQdWJsaWMgWW91VHViZSB2aWV3IGNvdW50LCBub3QgcGVyc29uYWwgd2F0Y2ggY291bnQuJwogICAgICAgIH0sCiAgICAgICAgbWV0YWRhdGEsCiAgICAgICAgbWV0YWRhdGFQYXJ0cwogICAgICB9OwogICAgfTsKCiAgICBjb25zdCBzY2FuID0gKCkgPT4gewogICAgICBjb25zdCByb3dzID0gWwogICAgICAgIC4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3l0ZC1wbGF5bGlzdC12aWRlby1yZW5kZXJlcix5dC1sb2NrdXAtdmlldy1tb2RlbCcpCiAgICAgIF07CiAgICAgIGxldCBhZGRlZCA9IDA7CiAgICAgIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHsKICAgICAgICB0cnkgewogICAgICAgICAgY29uc3QgaXRlbSA9IHBhcnNlUm93KHJvdyk7CiAgICAgICAgICBpZiAoIWl0ZW0/LnZpZGVvSWQpIGNvbnRpbnVlOwogICAgICAgICAgY29uc3Qgb2xkID0gZGF0YS5nZXQoaXRlbS52aWRlb0lkKTsKICAgICAgICAgIGlmICghb2xkKSB7CiAgICAgICAgICAgIGZpcnN0U2VlbisrOwogICAgICAgICAgICBkYXRhLnNldChpdGVtLnZpZGVvSWQsIHsKICAgICAgICAgICAgICAuLi5pdGVtLAogICAgICAgICAgICAgIGZpcnN0U2Vlbk9yZGVyOiBmaXJzdFNlZW4sCiAgICAgICAgICAgICAgZmlyc3RTZWVuU2Nyb2xsWTogTWF0aC5yb3VuZCh3aW5kb3cuc2Nyb2xsWSksCiAgICAgICAgICAgICAgY29sbGVjdGVkQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKQogICAgICAgICAgICB9KTsKICAgICAgICAgICAgYWRkZWQrKzsKICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgIGRhdGEuc2V0KGl0ZW0udmlkZW9JZCwgewogICAgICAgICAgICAgIC4uLm9sZCwKICAgICAgICAgICAgICAuLi5PYmplY3QuZnJvbUVudHJpZXMoCiAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhpdGVtKS5maWx0ZXIoKFssIHZdKSA9PiB2ICE9PSBudWxsICYmIHYgIT09ICcnICYmIHYgIT09IHVuZGVmaW5lZCkKICAgICAgICAgICAgICApLAogICAgICAgICAgICAgIGNoYW5uZWw6IHsKICAgICAgICAgICAgICAgIC4uLm9sZC5jaGFubmVsLAogICAgICAgICAgICAgICAgLi4uT2JqZWN0LmZyb21FbnRyaWVzKAogICAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhpdGVtLmNoYW5uZWwgfHwge30pLmZpbHRlcigoWywgdl0pID0+IHYgIT09IG51bGwgJiYgdiAhPT0gJycpCiAgICAgICAgICAgICAgICApCiAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgICB2aWV3czogewogICAgICAgICAgICAgICAgLi4ub2xkLnZpZXdzLAogICAgICAgICAgICAgICAgLi4uT2JqZWN0LmZyb21FbnRyaWVzKAogICAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhpdGVtLnZpZXdzIHx8IHt9KS5maWx0ZXIoKFssIHZdKSA9PiB2ICE9PSBudWxsICYmIHYgIT09ICcnKQogICAgICAgICAgICAgICAgKQogICAgICAgICAgICAgIH0KICAgICAgICAgICAgfSk7CiAgICAgICAgICB9CiAgICAgICAgfSBjYXRjaCB7fQogICAgICB9CiAgICAgIHN0YXRlLmNvbGxlY3RlZCA9IGRhdGEuc2l6ZTsKICAgICAgcmV0dXJuIGFkZGVkOwogICAgfTsKCiAgICBjb25zdCBtZXRyaWNzID0gKCkgPT4gewogICAgICBjb25zdCBkID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OwogICAgICBjb25zdCB0b3AgPSB3aW5kb3cuc2Nyb2xsWSB8fCBkLnNjcm9sbFRvcCB8fCAwOwogICAgICBjb25zdCB2aWV3cG9ydCA9IHdpbmRvdy5pbm5lckhlaWdodCB8fCBkLmNsaWVudEhlaWdodCB8fCAxOwogICAgICBjb25zdCBoZWlnaHQgPSBNYXRoLm1heChkLnNjcm9sbEhlaWdodCwgZG9jdW1lbnQuYm9keT8uc2Nyb2xsSGVpZ2h0IHx8IDApOwogICAgICBjb25zdCByZW1haW5pbmcgPSBNYXRoLm1heCgwLCBoZWlnaHQgLSAodG9wICsgdmlld3BvcnQpKTsKICAgICAgcmV0dXJuIHsKICAgICAgICB0b3AsIHZpZXdwb3J0LCBoZWlnaHQsIHJlbWFpbmluZywKICAgICAgICBuZWFyQm90dG9tOiByZW1haW5pbmcgPD0gTWF0aC5tYXgoMTIwLCB2aWV3cG9ydCAqIDAuMDgpCiAgICAgIH07CiAgICB9OwoKICAgIGNvbnN0IGlzTG9hZGluZyA9ICgpID0+IHsKICAgICAgZm9yIChjb25zdCBzZWwgb2YgWwogICAgICAgICd5dGQtY29udGludWF0aW9uLWl0ZW0tcmVuZGVyZXIgdHAteXQtcGFwZXItc3Bpbm5lclthY3RpdmVdJywKICAgICAgICAneXRkLWNvbnRpbnVhdGlvbi1pdGVtLXJlbmRlcmVyIFtyb2xlPSJwcm9ncmVzc2JhciJdJywKICAgICAgICAneXQtc3Bpbm5lcicsCiAgICAgICAgJ3RwLXl0LXBhcGVyLXNwaW5uZXJbYWN0aXZlXScKICAgICAgXSkgewogICAgICAgIGZvciAoY29uc3QgbiBvZiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpIHsKICAgICAgICAgIGlmIChuLmdldENsaWVudFJlY3RzKCkubGVuZ3RoID4gMCkgcmV0dXJuIHRydWU7CiAgICAgICAgfQogICAgICB9CiAgICAgIHJldHVybiBmYWxzZTsKICAgIH07CgogICAgY29uc3Qgc2lnbmF0dXJlID0gKCkgPT4gewogICAgICBjb25zdCBpZHMgPSBbXTsKICAgICAgZm9yIChjb25zdCBhIG9mIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2FbaHJlZio9Ii93YXRjaD92PSJdLGFbaHJlZio9Ii9zaG9ydHMvIl0nKSkgewogICAgICAgIGNvbnN0IGlkID0gZ2V0VmlkZW9JZChhLmdldEF0dHJpYnV0ZSgnaHJlZicpKTsKICAgICAgICBpZiAoaWQgJiYgIWlkcy5pbmNsdWRlcyhpZCkpIGlkcy5wdXNoKGlkKTsKICAgICAgfQogICAgICByZXR1cm4gaWRzLnNsaWNlKC04KS5qb2luKCd8Jyk7CiAgICB9OwoKICAgIGNvbnN0IGRlY2xhcmVkQ291bnQgPSAoKSA9PiB7CiAgICAgIGNvbnN0IHRleHQgPSBjbGVhbigKICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd5dGQtcGxheWxpc3QtaGVhZGVyLXJlbmRlcmVyLHl0LXBhZ2UtaGVhZGVyLXJlbmRlcmVyLHl0ZC1wYWdlLWhlYWRlci1yZW5kZXJlcicpCiAgICAgICAgICA/LmlubmVyVGV4dAogICAgICApOwogICAgICBmb3IgKGNvbnN0IHAgb2YgWwogICAgICAgIC8oW1xkLC5dKylccyt2aWRlb3M/L2ksCiAgICAgICAgLyhbXGQsLl0rKVxzK3bDrWRlb3M/L2ksCiAgICAgICAgLyhbXGQsLl0rKVxzK3ZpZMOpb3M/L2kKICAgICAgXSkgewogICAgICAgIGNvbnN0IG0gPSB0ZXh0Lm1hdGNoKHApOwogICAgICAgIGlmIChtKSB7CiAgICAgICAgICBjb25zdCBuID0gTnVtYmVyKG1bMV0ucmVwbGFjZSgvWywuXS9nLCAnJykpOwogICAgICAgICAgaWYgKE51bWJlci5pc0Zpbml0ZShuKSAmJiBuID4gMCkgcmV0dXJuIG47CiAgICAgICAgfQogICAgICB9CiAgICAgIHJldHVybiBudWxsOwogICAgfTsKCiAgICBjb25zdCBtYWtlT3V0cHV0ID0gY29tcGxldGUgPT4gewogICAgICBsZXQgdmlkZW9zID0gWy4uLmRhdGEudmFsdWVzKCldLnNvcnQoKGEsIGIpID0+IHsKICAgICAgICBjb25zdCBhYSA9IGEucGxheWxpc3RPcmRlciA/PyBhLmZpcnN0U2Vlbk9yZGVyOwogICAgICAgIGNvbnN0IGJiID0gYi5wbGF5bGlzdE9yZGVyID8/IGIuZmlyc3RTZWVuT3JkZXI7CiAgICAgICAgcmV0dXJuIGFhIC0gYmI7CiAgICAgIH0pOwogICAgICB2aWRlb3MgPSB2aWRlb3MubWFwKCh2LCBpKSA9PiAoewogICAgICAgIC4uLnYsCiAgICAgICAgbGlrZWRPcmRlcjogdi5wbGF5bGlzdE9yZGVyID8/IChpICsgMSkKICAgICAgfSkpOwoKICAgICAgY29uc3QgY2hhbm5lbHMgPSBuZXcgTWFwKCk7CiAgICAgIGZvciAoY29uc3QgdiBvZiB2aWRlb3MpIHsKICAgICAgICBjb25zdCBrZXkgPSB2LmNoYW5uZWw/LnVybCB8fCB2LmNoYW5uZWw/Lm5hbWUgfHwgJ1Vua25vd24nOwogICAgICAgIGlmICghY2hhbm5lbHMuaGFzKGtleSkpIHsKICAgICAgICAgIGNoYW5uZWxzLnNldChrZXksIHsKICAgICAgICAgICAgY2hhbm5lbDogdi5jaGFubmVsPy5uYW1lIHx8ICdVbmtub3duJywKICAgICAgICAgICAgY2hhbm5lbFVybDogdi5jaGFubmVsPy51cmwgfHwgbnVsbCwKICAgICAgICAgICAgaW1hZ2VVcmw6IHYuY2hhbm5lbD8uaW1hZ2VVcmwgfHwgbnVsbCwKICAgICAgICAgICAgbGlrZWRWaWRlb0NvdW50OiAwLAogICAgICAgICAgICB0b3RhbFB1YmxpY1ZpZXdzOiAwLAogICAgICAgICAgICB2aWRlb3NXaXRoVmlld0NvdW50OiAwLAogICAgICAgICAgICB2aWRlb0lkczogW10KICAgICAgICAgIH0pOwogICAgICAgIH0KICAgICAgICBjb25zdCBjID0gY2hhbm5lbHMuZ2V0KGtleSk7CiAgICAgICAgYy5saWtlZFZpZGVvQ291bnQrKzsKICAgICAgICBjLnZpZGVvSWRzLnB1c2godi52aWRlb0lkKTsKICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKHYudmlld3M/Lm51bWJlcikpIHsKICAgICAgICAgIGMudG90YWxQdWJsaWNWaWV3cyArPSB2LnZpZXdzLm51bWJlcjsKICAgICAgICAgIGMudmlkZW9zV2l0aFZpZXdDb3VudCsrOwogICAgICAgIH0KICAgICAgfQoKICAgICAgY29uc3QgbW9zdExpa2VkQ2hhbm5lbHMgPSBbLi4uY2hhbm5lbHMudmFsdWVzKCldLnNvcnQoCiAgICAgICAgKGEsIGIpID0+CiAgICAgICAgICBiLmxpa2VkVmlkZW9Db3VudCAtIGEubGlrZWRWaWRlb0NvdW50IHx8CiAgICAgICAgICBiLnRvdGFsUHVibGljVmlld3MgLSBhLnRvdGFsUHVibGljVmlld3MKICAgICAgKTsKCiAgICAgIGNvbnN0IHZpZGVvc0J5UHVibGljVmlld3MgPSBbLi4udmlkZW9zXQogICAgICAgIC5maWx0ZXIodiA9PiBOdW1iZXIuaXNGaW5pdGUodi52aWV3cz8ubnVtYmVyKSkKICAgICAgICAuc29ydCgoYSwgYikgPT4gYi52aWV3cy5udW1iZXIgLSBhLnZpZXdzLm51bWJlcik7CgogICAgICByZXR1cm4gewogICAgICAgIGdlbmVyYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksCiAgICAgICAgc291cmNlOiAnWW91VHViZSBMaWtlZCBWaWRlb3MnLAogICAgICAgIGNvbXBsZXRlLAogICAgICAgIGNhdmVhdDoKICAgICAgICAgICJUaGUgTGlrZWQgVmlkZW9zIHBhZ2UgZXhwb3NlcyBwdWJsaWMgdmlkZW8gdmlldyBjb3VudHMsIG5vdCB0aGUgdXNlcidzIHBlcnNvbmFsIHdhdGNoIGZyZXF1ZW5jeS4iLAogICAgICAgIHN1bW1hcnk6IHsKICAgICAgICAgIHRvdGFsTGlrZWRWaWRlb3M6IHZpZGVvcy5sZW5ndGgsCiAgICAgICAgICB0b3RhbENoYW5uZWxzOiBjaGFubmVscy5zaXplLAogICAgICAgICAgZGVjbGFyZWRQbGF5bGlzdENvdW50OiBzdGF0ZS5kZWNsYXJlZFBsYXlsaXN0Q291bnQsCiAgICAgICAgICBzY3JvbGxQYXNzZXM6IHN0YXRlLnJvdW5kcywKICAgICAgICAgIGVuZFJlYXNvbjogc3RhdGUuZW5kUmVhc29uCiAgICAgICAgfSwKICAgICAgICBtb3N0TGlrZWRDaGFubmVscywKICAgICAgICB2aWRlb3NCeVB1YmxpY1ZpZXdzLAogICAgICAgIHZpZGVvcwogICAgICB9OwogICAgfTsKCiAgICB3aW5kb3cuX19ZVF9BVVRPX1NOQVBTSE9UID0gKCkgPT4gSlNPTi5zdHJpbmdpZnkobWFrZU91dHB1dChmYWxzZSkpOwoKICAgIHRyeSB7CiAgICAgIGlmICgKICAgICAgICBsb2NhdGlvbi5ob3N0bmFtZS5pbmNsdWRlcygnYWNjb3VudHMuZ29vZ2xlLmNvbScpIHx8CiAgICAgICAgKAogICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYVtocmVmKj0iYWNjb3VudHMuZ29vZ2xlLmNvbS9TZXJ2aWNlTG9naW4iXScpICYmCiAgICAgICAgICAhZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2F2YXRhci1idG4sYnV0dG9uI2F2YXRhci1idG4nKQogICAgICAgICkKICAgICAgKSB7CiAgICAgICAgc3RhdGUuYXV0aFJlcXVpcmVkID0gdHJ1ZTsKICAgICAgICBzdGF0ZS5ydW5uaW5nID0gZmFsc2U7CiAgICAgICAgc3RhdGUuZW5kUmVhc29uID0gJ2F1dGhlbnRpY2F0aW9uX3JlcXVpcmVkJzsKICAgICAgICByZXR1cm4gbnVsbDsKICAgICAgfQoKICAgICAgc3RhdGUuZGVjbGFyZWRQbGF5bGlzdENvdW50ID0gZGVjbGFyZWRDb3VudCgpOwoKICAgICAgd2luZG93LnNjcm9sbFRvKDAsIDApOwogICAgICBhd2FpdCBzbGVlcCgxMjAwKTsKICAgICAgc2NhbigpOwoKICAgICAgbGV0IHByZXZIZWlnaHQgPSBtZXRyaWNzKCkuaGVpZ2h0OwogICAgICBsZXQgcHJldlNpZyA9IHNpZ25hdHVyZSgpOwogICAgICBsZXQgcHJldkNvdW50ID0gZGF0YS5zaXplOwogICAgICBsZXQgc3RhYmxlID0gMDsKCiAgICAgIGZvciAobGV0IHJvdW5kID0gMTsgcm91bmQgPD0gMTAwMDA7IHJvdW5kKyspIHsKICAgICAgICBzdGF0ZS5yb3VuZHMgPSByb3VuZDsKCiAgICAgICAgc2NhbigpOwogICAgICAgIGNvbnN0IGJlZm9yZSA9IG1ldHJpY3MoKTsKICAgICAgICB3aW5kb3cuc2Nyb2xsQnkoMCwgTWF0aC5tYXgoNTAwLCBNYXRoLnJvdW5kKGJlZm9yZS52aWV3cG9ydCAqIDAuNzApKSk7CiAgICAgICAgYXdhaXQgc2xlZXAoYmVmb3JlLm5lYXJCb3R0b20gPyAxNDAwIDogNzAwKTsKICAgICAgICBzY2FuKCk7CgogICAgICAgIGNvbnN0IG5vdyA9IG1ldHJpY3MoKTsKICAgICAgICBjb25zdCBzaWcgPSBzaWduYXR1cmUoKTsKICAgICAgICBjb25zdCBjaGFuZ2VkID0KICAgICAgICAgIGRhdGEuc2l6ZSAhPT0gcHJldkNvdW50IHx8CiAgICAgICAgICBNYXRoLmFicyhub3cuaGVpZ2h0IC0gcHJldkhlaWdodCkgPiA1IHx8CiAgICAgICAgICBzaWcgIT09IHByZXZTaWcgfHwKICAgICAgICAgIGlzTG9hZGluZygpOwoKICAgICAgICBpZiAobm93Lm5lYXJCb3R0b20pIHsKICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBub3cuaGVpZ2h0KTsKICAgICAgICAgIGF3YWl0IHNsZWVwKDkwMCk7CiAgICAgICAgICBzY2FuKCk7CgogICAgICAgICAgaWYgKCFjaGFuZ2VkICYmICFpc0xvYWRpbmcoKSkgc3RhYmxlKys7CiAgICAgICAgICBlbHNlIHN0YWJsZSA9IDA7CgogICAgICAgICAgc3RhdGUuc3RhYmxlQm90dG9tUm91bmRzID0gc3RhYmxlOwoKICAgICAgICAgIGlmICgKICAgICAgICAgICAgc3RhdGUuZGVjbGFyZWRQbGF5bGlzdENvdW50ICYmCiAgICAgICAgICAgIGRhdGEuc2l6ZSA+PSBzdGF0ZS5kZWNsYXJlZFBsYXlsaXN0Q291bnQgJiYKICAgICAgICAgICAgc3RhYmxlID49IDIKICAgICAgICAgICkgewogICAgICAgICAgICBzdGF0ZS5lbmRSZWFzb24gPSAnZGVjbGFyZWRfY291bnRfcmVhY2hlZCc7CiAgICAgICAgICAgIGJyZWFrOwogICAgICAgICAgfQoKICAgICAgICAgIGlmIChzdGFibGUgPj0gOCkgewogICAgICAgICAgICBzdGF0ZS5lbmRSZWFzb24gPSAnc3RhYmxlX2JvdHRvbV9ub19tb3JlX2l0ZW1zJzsKICAgICAgICAgICAgYnJlYWs7CiAgICAgICAgICB9CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgIHN0YWJsZSA9IDA7CiAgICAgICAgICBzdGF0ZS5zdGFibGVCb3R0b21Sb3VuZHMgPSAwOwogICAgICAgIH0KCiAgICAgICAgcHJldkhlaWdodCA9IG5vdy5oZWlnaHQ7CiAgICAgICAgcHJldlNpZyA9IHNpZzsKICAgICAgICBwcmV2Q291bnQgPSBkYXRhLnNpemU7CiAgICAgIH0KCiAgICAgIHdpbmRvdy5zY3JvbGxUbygwLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsSGVpZ2h0KTsKICAgICAgYXdhaXQgc2xlZXAoMTgwMCk7CiAgICAgIHNjYW4oKTsKICAgICAgYXdhaXQgc2xlZXAoODAwKTsKICAgICAgc2NhbigpOwoKICAgICAgaWYgKCFzdGF0ZS5lbmRSZWFzb24pIHN0YXRlLmVuZFJlYXNvbiA9ICdjb2xsZWN0b3JfZmluaXNoZWQnOwoKICAgICAgY29uc3Qgb3V0cHV0ID0gbWFrZU91dHB1dCh0cnVlKTsKICAgICAgd2luZG93Ll9fWVRfQVVUT19PVVRQVVQgPSBvdXRwdXQ7CiAgICAgIHN0YXRlLmNvbGxlY3RlZCA9IG91dHB1dC5zdW1tYXJ5LnRvdGFsTGlrZWRWaWRlb3M7CiAgICAgIHN0YXRlLmNvbXBsZXRlID0gdHJ1ZTsKICAgICAgc3RhdGUucnVubmluZyA9IGZhbHNlOwogICAgICBzdGF0ZS5maW5pc2hlZEF0ID0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpOwogICAgICByZXR1cm4gb3V0cHV0OwogICAgfSBjYXRjaCAoZSkgewogICAgICBzdGF0ZS5lcnJvciA9IFN0cmluZyhlPy5zdGFjayB8fCBlPy5tZXNzYWdlIHx8IGUpOwogICAgICBzdGF0ZS5ydW5uaW5nID0gZmFsc2U7CiAgICAgIHN0YXRlLmZpbmlzaGVkQXQgPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCk7CiAgICAgIHJldHVybiBudWxsOwogICAgfQogIH0pKCk7CgogIHJldHVybiAnc3RhcnRlZCc7Cn0pKCk7'))

function Save-AccountCsv {
    param(
        [Parameter(Mandatory=$true)]$Output,
        [Parameter(Mandatory=$true)][string]$Path
    )
    $rows = foreach ($v in @($Output.videos)) {
        [pscustomobject]@{
            likedOrder = $v.likedOrder
            videoId = $v.videoId
            title = $v.title
            videoUrl = $v.videoUrl
            channelName = $v.channel.name
            channelUrl = $v.channel.url
            creatorImageUrl = $v.channel.imageUrl
            thumbnailUrl = $v.thumbnailUrl
            duration = $v.duration
            publicViewsText = $v.views.text
            publicViews = $v.views.number
            metadata = $v.metadata
            collectedAt = $v.collectedAt
        }
    }
    $rows | Export-Csv -LiteralPath $Path -NoTypeInformation -Encoding UTF8
}

$Chrome = Get-ChromeExecutable
Write-Log "Chrome: $Chrome"
Write-Log "Chrome User Data: $ChromeUserData"
Write-Log "Normal Chrome will NOT be killed. Automation uses copied profile snapshots."

$manifest = [ordered]@{
    generatedAt = (Get-Date).ToUniversalTime().ToString('o')
    accounts = @()
}
$allAccounts = New-Object System.Collections.Generic.List[object]

$accountIndex = 0

foreach ($account in $Accounts) {
    $accountIndex++
    $started = Get-Date
    $entry = [ordered]@{
        language = $account.Language
        email = $account.Email
        status = 'running'
        profileDirectory = $null
        startedAt = $started.ToUniversalTime().ToString('o')
        finishedAt = $null
        durationMs = $null
        totalVideos = 0
        totalChannels = 0
        declaredPlaylistCount = $null
        endReason = $null
        output = $null
        error = $null
    }

    $snapshotRoot = $null
    $socket = $null

    try {
        Write-Log "[$($account.Language.ToUpper())] Resolving Chrome profile for $($account.Email)"
        $profileDir = Resolve-ChromeProfileDirectory -Email $account.Email
        if (-not $profileDir) {
            $entry.status = 'account_not_found'
            $entry.error = 'Could not map this email to a real Chrome profile.'
            Write-Log "[$($account.Language.ToUpper())] Account profile NOT FOUND."
            continue
        }

        $entry.profileDirectory = $profileDir
        $displayName = $null
        if ($InfoCache.ContainsKey($profileDir)) {
            $info = $InfoCache[$profileDir]
            if ($info.PSObject.Properties.Name -contains 'name') {
                $displayName = [string]$info.name
            }
        }
        Write-Log "[$($account.Language.ToUpper())] Profile: $profileDir / $displayName"

        Write-Log "[$($account.Language.ToUpper())] Creating isolated authenticated profile snapshot..."
        $snapshotRoot = Copy-ChromeProfileSnapshot -ProfileDirectory $profileDir -Slug $account.Slug

        $port = 9330 + $accountIndex
        Stop-AutomationChrome -SnapshotRoot $snapshotRoot

        $chromeArgs = @(
            "--user-data-dir=`"$snapshotRoot`"",
            "--profile-directory=`"$profileDir`"",
            "--remote-debugging-port=$port",
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-background-mode',
            '--new-window',
            'about:blank'
        )

        Write-Log "[$($account.Language.ToUpper())] Launching isolated Chrome on CDP port $port..."
        Start-Process -FilePath $Chrome -ArgumentList $chromeArgs | Out-Null

        Wait-DebugEndpoint -Port $port -TimeoutSeconds 60 | Out-Null
        $target = Get-OrCreateCdpTarget -Port $port -Url $PlaylistUrl
        if (-not $target.webSocketDebuggerUrl) {
            throw 'No CDP WebSocket URL returned for YouTube page.'
        }

        $socket = New-CdpSocket -WebSocketUrl $target.webSocketDebuggerUrl
        Invoke-Cdp -Socket $socket -Method 'Runtime.enable' | Out-Null
        Invoke-Cdp -Socket $socket -Method 'Page.enable' | Out-Null

        Invoke-Cdp -Socket $socket -Method 'Page.navigate' -Params @{ url = $PlaylistUrl } | Out-Null

        $readyDeadline = (Get-Date).AddSeconds(60)
        do {
            Start-Sleep -Milliseconds 750
            $ready = Invoke-CdpEval -Socket $socket -Expression 'document.readyState'
        } while ($ready -ne 'complete' -and (Get-Date) -lt $readyDeadline)

        Start-Sleep -Seconds 4

        $urlNow = [string](Invoke-CdpEval -Socket $socket -Expression 'location.href')
        if ($urlNow -like '*accounts.google.com*') {
            $entry.status = 'needs_human_login'
            $entry.error = "Snapshot opened Google login: $urlNow"
            Write-Log "[$($account.Language.ToUpper())] Needs human login; continuing to next account."
            continue
        }

        $signedOut = Invoke-CdpEval -Socket $socket -Expression @'
Boolean(
  document.querySelector('a[href*="accounts.google.com/ServiceLogin"]') &&
  !document.querySelector('#avatar-btn,button#avatar-btn')
)
'@
        if ([bool]$signedOut) {
            $entry.status = 'needs_human_login'
            $entry.error = 'YouTube appears signed out in the copied profile snapshot.'
            Write-Log "[$($account.Language.ToUpper())] Snapshot is signed out; continuing."
            continue
        }

        Write-Log "[$($account.Language.ToUpper())] YouTube authenticated. Starting complete LL collection."
        Invoke-CdpEval -Socket $socket -Expression $CollectorJs | Out-Null

        $lastCount = -1
        $lastLog = Get-Date
        $lastPartialSave = Get-Date
        $partialPath = Join-Path $OutputRoot "$($account.Slug).partial.json"
        $runDeadline = (Get-Date).AddMinutes(75)

        while ((Get-Date) -lt $runDeadline) {
            Start-Sleep -Seconds 5
            $stateJson = Invoke-CdpEval -Socket $socket -Expression 'JSON.stringify(window.__YT_AUTO_STATE || null)'
            if (-not $stateJson -or $stateJson -eq 'null') {
                continue
            }
            $state = $stateJson | ConvertFrom-Json

            if ([int]$state.collected -ne $lastCount -or ((Get-Date) - $lastLog).TotalSeconds -ge 30) {
                Write-Log "[$($account.Language.ToUpper())] collected=$($state.collected) rounds=$($state.rounds) endCheck=$($state.stableBottomRounds)"
                $lastCount = [int]$state.collected
                $lastLog = Get-Date
            }

            if (((Get-Date) - $lastPartialSave).TotalSeconds -ge 60) {
                try {
                    $partialJson = Invoke-CdpEval -Socket $socket -Expression 'window.__YT_AUTO_SNAPSHOT ? window.__YT_AUTO_SNAPSHOT() : null'
                    if ($partialJson) {
                        [IO.File]::WriteAllText("$partialPath.tmp", [string]$partialJson, [Text.UTF8Encoding]::new($false))
                        Move-Item -Force -LiteralPath "$partialPath.tmp" -Destination $partialPath
                        $lastPartialSave = Get-Date
                    }
                } catch {}
            }

            if ([bool]$state.authRequired) {
                $entry.status = 'needs_human_login'
                $entry.error = 'Collector detected authentication required.'
                break
            }

            if ($state.error) {
                throw "Collector JavaScript error: $($state.error)"
            }

            if ([bool]$state.complete) {
                break
            }
        }

        $finalStateJson = Invoke-CdpEval -Socket $socket -Expression 'JSON.stringify(window.__YT_AUTO_STATE || null)'
        $finalState = $finalStateJson | ConvertFrom-Json

        if ($entry.status -eq 'needs_human_login') {
            Write-Log "[$($account.Language.ToUpper())] Needs human login; saved any available partial."
            continue
        }

        if (-not [bool]$finalState.complete) {
            throw "Collector timed out before completion. Collected $($finalState.collected) videos."
        }

        Write-Log "[$($account.Language.ToUpper())] Collection complete. Pulling JSON from page memory..."
        $outputJson = Invoke-CdpEval -Socket $socket -Expression 'JSON.stringify(window.__YT_AUTO_OUTPUT || null)'
        if (-not $outputJson -or $outputJson -eq 'null') {
            throw 'Collector reported complete but final output was missing.'
        }

        $output = $outputJson | ConvertFrom-Json
        $videoIds = @($output.videos | ForEach-Object { $_.videoId })
        $uniqueIds = @($videoIds | Select-Object -Unique)
        if ($uniqueIds.Count -ne $videoIds.Count) {
            throw "Validation failed: duplicate video IDs ($($videoIds.Count) rows, $($uniqueIds.Count) unique)."
        }

        $jsonPath = Join-Path $OutputRoot "$($account.Slug).json"
        $csvPath = Join-Path $OutputRoot "$($account.Slug).csv"

        $wrapped = [ordered]@{
            generatedAt = (Get-Date).ToUniversalTime().ToString('o')
            language = $account.Language
            accountEmail = $account.Email
            chromeProfileDirectory = $profileDir
            chromeProfileName = $displayName
            data = $output
        }

        Write-JsonAtomic -Object $wrapped -Path $jsonPath -Depth 100
        Save-AccountCsv -Output $output -Path $csvPath

        if (Test-Path -LiteralPath $partialPath) {
            Remove-Item -LiteralPath $partialPath -Force -ErrorAction SilentlyContinue
        }

        foreach ($v in @($output.videos)) {
            $allAccounts.Add([pscustomobject]@{
                language = $account.Language
                accountEmail = $account.Email
                likedOrder = $v.likedOrder
                videoId = $v.videoId
                title = $v.title
                videoUrl = $v.videoUrl
                channel = $v.channel
                thumbnailUrl = $v.thumbnailUrl
                duration = $v.duration
                views = $v.views
                metadata = $v.metadata
                collectedAt = $v.collectedAt
            })
        }

        $entry.status = 'complete'
        $entry.totalVideos = [int]$output.summary.totalLikedVideos
        $entry.totalChannels = [int]$output.summary.totalChannels
        $entry.declaredPlaylistCount = $output.summary.declaredPlaylistCount
        $entry.endReason = $output.summary.endReason
        $entry.output = [IO.Path]::GetFileName($jsonPath)

        Write-Log "[$($account.Language.ToUpper())] COMPLETE: $($entry.totalVideos) videos / $($entry.totalChannels) channels."
    }
    catch {
        if ($entry.status -eq 'running') {
            $entry.status = 'failed'
        }
        $entry.error = $_.Exception.Message
        Write-Log "[$($account.Language.ToUpper())] FAILED: $($entry.error)"
    }
    finally {
        if ($socket) {
            try {
                $socket.CloseAsync(
                    [System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure,
                    'done',
                    [Threading.CancellationToken]::None
                ).GetAwaiter().GetResult()
            } catch {}
            try { $socket.Dispose() } catch {}
        }

        if ($snapshotRoot) {
            Stop-AutomationChrome -SnapshotRoot $snapshotRoot
            Start-Sleep -Seconds 1
            try {
                Remove-Item -LiteralPath $snapshotRoot -Recurse -Force -ErrorAction SilentlyContinue
            } catch {}
        }

        $finished = Get-Date
        $entry.finishedAt = $finished.ToUniversalTime().ToString('o')
        $entry.durationMs = [int64](($finished - $started).TotalMilliseconds)
        $manifest.accounts += [pscustomobject]$entry
        $manifest.generatedAt = (Get-Date).ToUniversalTime().ToString('o')
        Write-JsonAtomic -Object ([pscustomobject]$manifest) -Path $ManifestPath -Depth 30
    }
}

$aggregate = [ordered]@{
    generatedAt = (Get-Date).ToUniversalTime().ToString('o')
    accountCount = $Accounts.Count
    completedAccounts = @($manifest.accounts | Where-Object { $_.status -eq 'complete' }).Count
    totalLikeAssociations = $allAccounts.Count
    uniqueVideoIds = @($allAccounts | ForEach-Object { $_.videoId } | Select-Object -Unique).Count
    videos = @($allAccounts)
}
Write-JsonAtomic -Object ([pscustomobject]$aggregate) -Path $AllAccountsPath -Depth 100

Write-Host ''
Write-Host '==================== FINISHED ====================' -ForegroundColor Green
$manifest.accounts |
    Select-Object language,email,status,totalVideos,totalChannels,profileDirectory,error |
    Format-Table -AutoSize
Write-Host ''
Write-Host "Manifest:    $ManifestPath" -ForegroundColor Cyan
Write-Host "All accounts: $AllAccountsPath" -ForegroundColor Cyan
Write-Host "Logs:        $LogPath" -ForegroundColor Cyan
Write-Host 'Your normal Chrome/Instagram tabs were not intentionally closed.' -ForegroundColor Green
