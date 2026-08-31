$ErrorActionPreference = 'Stop'

$WebsiteRoot = 'D:\website'
$DataRoot = Join-Path $WebsiteRoot 'youtube-liked-data'
$BackupRoot = Join-Path $WebsiteRoot '_script-backups'
$Downloads = Join-Path $env:USERPROFILE 'Downloads'

New-Item -ItemType Directory -Force -Path $WebsiteRoot, $DataRoot, $BackupRoot | Out-Null

function Copy-NewerFile {
    param(
        [Parameter(Mandatory = $true)][string]$Source,
        [Parameter(Mandatory = $true)][string]$Destination
    )

    if (-not (Test-Path -LiteralPath $Source)) {
        Write-Warning "Missing source: $Source"
        return
    }

    $Copy = $true

    if (Test-Path -LiteralPath $Destination) {
        $SourceInfo = Get-Item -LiteralPath $Source
        $DestinationInfo = Get-Item -LiteralPath $Destination

        if ($SourceInfo.LastWriteTimeUtc -le $DestinationInfo.LastWriteTimeUtc) {
            Write-Host "Keeping newer/equal destination: $Destination" -ForegroundColor DarkGray
            $Copy = $false
        }
        else {
            $Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
            $Backup = Join-Path $BackupRoot ("{0}.{1}.bak" -f $DestinationInfo.Name, $Stamp)
            Copy-Item -LiteralPath $Destination -Destination $Backup -Force
            Write-Host "Backed up: $Backup" -ForegroundColor DarkGray
        }
    }

    if ($Copy) {
        Copy-Item -LiteralPath $Source -Destination $Destination -Force
        Write-Host "Copied: $Destination" -ForegroundColor Green
    }
}

# Keep scripts in D:\website, but never overwrite a newer fixed copy with an older Downloads copy.
Copy-NewerFile `
    -Source (Join-Path $Downloads 'Repair-Instagram-Hydration.ps1') `
    -Destination (Join-Path $WebsiteRoot 'Repair-Instagram-Hydration.ps1')

Copy-NewerFile `
    -Source (Join-Path $Downloads 'Fetch-All-YouTube-Likes.ps1') `
    -Destination (Join-Path $WebsiteRoot 'Fetch-All-YouTube-Likes.ps1')

$Node = Get-Command node.exe -ErrorAction SilentlyContinue
if (-not $Node) {
    throw 'Node.js was not found in PATH.'
}

$HelperPath = Join-Path $WebsiteRoot 'Normalize-YouTube-Likes.js'
$HelperBackup = $null

if (Test-Path -LiteralPath $HelperPath) {
    $Stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $HelperBackup = Join-Path $BackupRoot ("Normalize-YouTube-Likes.js.$Stamp.bak")
    Copy-Item -LiteralPath $HelperPath -Destination $HelperBackup -Force
}

$JavaScript = @'
'use strict';

const fs = require('fs');
const path = require('path');

const downloads = path.join(process.env.USERPROFILE || process.env.HOME || '', 'Downloads');
const website = 'D:\\website';
const outDir = path.join(website, 'youtube-liked-data');
const archiveDir = path.join(outDir, '_source-archive');

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(archiveDir, { recursive: true });

const accountDefs = [
  {
    language: 'indonesian',
    email: 'importantpudding@gmail.com',
    stem: 'youtube-liked-indonesian-importantpudding',
    exact: ['youtube-liked-indonesian-importantpudding.json'],
    patterns: [/indonesian/i, /importantpudding/i]
  },
  {
    language: 'spanish',
    email: 'holasoyaljohn@gmail.com',
    stem: 'youtube-liked-spanish-holasoyaljohn',
    exact: ['youtube-liked-spanish-account.json'],
    patterns: [/spanish/i, /holasoyaljohn/i]
  },
  {
    language: 'french',
    email: 'monsiuerjeanlelait@gmail.com',
    stem: 'youtube-liked-french-monsiuerjeanlelait',
    exact: ['youtube-liked-french-account.json'],
    patterns: [/french/i, /monsiuerjeanlelait/i, /jeanlelait/i]
  },
  {
    language: 'brasil',
    email: 'lemakicatta@gmail.com',
    stem: 'youtube-liked-brasil-lemakicatta',
    exact: ['youtube-liked-brasaccount.json', 'youtube-liked-brasil-account.json'],
    patterns: [/brasaccount/i, /brasil/i, /lemakicatta/i]
  },
  {
    language: 'russian',
    email: 'paintingprety3489@gmail.com',
    stem: 'youtube-liked-russian-paintingprety3489',
    exact: ['youtube-liked-russian-account.json'],
    patterns: [/russian/i, /paintingprety3489/i]
  },
  {
    language: 'italian',
    email: 'pitanbatman@gmail.com',
    stem: 'youtube-liked-italian-pitanbatman',
    exact: ['youtube-liked-italian-account.json'],
    patterns: [/italian/i, /pitanbatman/i]
  },
  {
    language: 'german',
    email: 'mondwanderer6@gmail.com',
    stem: 'youtube-liked-german-mondwanderer6',
    exact: ['youtube-liked-german-account.json', 'youtube-liked-german-mondwanderer6.json'],
    patterns: [/german/i, /mondwanderer6/i]
  },
  {
    language: 'swedish',
    email: 'magnusmjolkson@gmail.com',
    stem: 'youtube-liked-swedish-magnusmjolkson',
    // User explicitly identified (7) as Swedish; keep it first as the ordering source.
    exact: [
      'youtube-liked-videos (7).json',
      'youtube-liked-swedish-account.json',
      'youtube-liked-swedish-magnusmjolkson.json'
    ],
    patterns: [/swedish/i, /magnusmjolkson/i, /magnusmj[öo]lkson/i]
  }
];

function safeReadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    return { ok: true, value: JSON.parse(raw), error: null };
  } catch (error) {
    return { ok: false, value: null, error: String(error && error.message ? error.message : error) };
  }
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function extractVideos(doc) {
  if (Array.isArray(doc)) return doc;
  const candidates = [
    doc && doc.videos,
    doc && doc.data && doc.data.videos,
    doc && doc.results,
    doc && doc.items,
    doc && doc.mostWatchedVideos,
    doc && doc.mostLikedVideos
  ];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

function extractVideoId(record) {
  if (!record || typeof record !== 'object') return null;
  if (record.videoId) return String(record.videoId);
  const possibleUrls = [record.videoUrl, record.sourceUrl, record.url, record.href];
  for (const value of possibleUrls) {
    if (!value) continue;
    try {
      const url = new URL(String(value), 'https://www.youtube.com');
      const queryId = url.searchParams.get('v');
      if (queryId) return queryId;
      const match = url.pathname.match(/^\/(?:shorts|live)\/([A-Za-z0-9_-]{6,})/);
      if (match) return match[1];
    } catch {}
  }
  return null;
}

function isEmpty(value) {
  return value === null || value === undefined || value === '' ||
    (Array.isArray(value) && value.length === 0);
}

function mergeFillMissing(base, incoming) {
  if (!base || typeof base !== 'object') return incoming;
  if (!incoming || typeof incoming !== 'object') return base;

  for (const [key, value] of Object.entries(incoming)) {
    if (key === '_sourceFiles') continue;
    if (isEmpty(base[key]) && !isEmpty(value)) {
      base[key] = value;
      continue;
    }
    if (
      base[key] && value &&
      typeof base[key] === 'object' && !Array.isArray(base[key]) &&
      typeof value === 'object' && !Array.isArray(value)
    ) {
      mergeFillMissing(base[key], value);
    }
  }
  return base;
}

function parseCompactNumber(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  let text = String(raw).trim().replace(/\s+/g, '');
  let multiplier = 1;
  const suffix = text.slice(-1).toUpperCase();
  if (suffix === 'K') { multiplier = 1e3; text = text.slice(0, -1); }
  else if (suffix === 'M') { multiplier = 1e6; text = text.slice(0, -1); }
  else if (suffix === 'B') { multiplier = 1e9; text = text.slice(0, -1); }

  const comma = text.lastIndexOf(',');
  const dot = text.lastIndexOf('.');
  if (comma >= 0 && dot >= 0) {
    text = comma > dot
      ? text.replace(/\./g, '').replace(',', '.')
      : text.replace(/,/g, '');
  } else if (comma >= 0) {
    text = multiplier > 1
      ? text.replace(',', '.')
      : (/^\d{1,3}(,\d{3})+$/.test(text) ? text.replace(/,/g, '') : text.replace(',', '.'));
  } else if (dot >= 0 && multiplier === 1 && /^\d{1,3}(\.\d{3})+$/.test(text)) {
    text = text.replace(/\./g, '');
  }

  const number = Number(text);
  return Number.isFinite(number) ? Math.round(number * multiplier) : null;
}

function normalizeVideo(record, index, sourceFiles) {
  const videoId = extractVideoId(record);
  if (!videoId) return null;

  const channelObject = record.channel && typeof record.channel === 'object'
    ? record.channel
    : {};
  const viewsObject = record.views && typeof record.views === 'object'
    ? record.views
    : {};

  const viewsText = viewsObject.text ?? record.viewsText ?? record.publicViewsText ?? null;
  const viewsNumber = parseCompactNumber(
    viewsObject.number ?? record.viewsNumber ?? record.publicViews ?? viewsText
  );

  return {
    likedOrder: Number(record.likedOrder ?? record.playlistOrder ?? record.firstSeenOrder) || (index + 1),
    videoId,
    title: record.title ?? null,
    videoUrl: record.videoUrl || `https://www.youtube.com/watch?v=${videoId}`,
    sourceUrl: record.sourceUrl ?? record.videoUrl ?? null,
    channel: {
      name: channelObject.name ?? record.channelName ?? null,
      url: channelObject.url ?? record.channelUrl ?? null,
      imageUrl: channelObject.imageUrl ?? record.creatorImageUrl ?? record.channelImageUrl ?? null
    },
    thumbnailUrl: record.thumbnailUrl ?? record.thumbnail ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    duration: record.duration ?? null,
    views: {
      text: viewsText,
      number: viewsNumber,
      note: 'Public YouTube view count, not personal watch count.'
    },
    metadata: record.metadata ?? record.metadataText ?? null,
    metadataParts: asArray(record.metadataParts),
    collectedAt: record.collectedAt ?? record.generatedAt ?? null,
    sourceFiles: Array.from(new Set(sourceFiles))
  };
}

function csvCell(value) {
  if (value === null || value === undefined) return '""';
  const text = Array.isArray(value) || typeof value === 'object'
    ? JSON.stringify(value)
    : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function buildCsv(output) {
  const columns = [
    'language', 'accountEmail', 'likedOrder', 'videoId', 'title', 'videoUrl',
    'channelName', 'channelUrl', 'creatorImageUrl', 'thumbnailUrl', 'duration',
    'publicViewsText', 'publicViewsNumber', 'metadata', 'collectedAt', 'sourceFiles'
  ];
  const lines = [columns.join(',')];
  for (const video of output.videos) {
    const row = [
      output.account.language,
      output.account.email,
      video.likedOrder,
      video.videoId,
      video.title,
      video.videoUrl,
      video.channel && video.channel.name,
      video.channel && video.channel.url,
      video.channel && video.channel.imageUrl,
      video.thumbnailUrl,
      video.duration,
      video.views && video.views.text,
      video.views && video.views.number,
      video.metadata,
      video.collectedAt,
      video.sourceFiles.join(' | ')
    ];
    lines.push(row.map(csvCell).join(','));
  }
  return '\uFEFF' + lines.join('\r\n');
}

function getDeclaredCount(doc) {
  const values = [
    doc && doc.summary && doc.summary.declaredPlaylistCount,
    doc && doc.summary && doc.summary.totalLikedVideos,
    doc && doc.summary && doc.summary.totalVideos,
    doc && doc.count
  ];
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number) && number > 0) return number;
  }
  return null;
}

function discoverCandidates(def, allJsonNames) {
  const ordered = [];
  for (const exact of def.exact) {
    const full = path.join(downloads, exact);
    if (fs.existsSync(full)) ordered.push(full);
  }
  for (const name of allJsonNames) {
    if (!def.patterns.some((pattern) => pattern.test(name))) continue;
    const full = path.join(downloads, name);
    if (!ordered.some((existing) => existing.toLowerCase() === full.toLowerCase())) {
      ordered.push(full);
    }
  }
  return ordered;
}

const allDownloadNames = fs.existsSync(downloads) ? fs.readdirSync(downloads) : [];
const allJsonNames = allDownloadNames.filter((name) => /^youtube-liked.*\.json$/i.test(name));
const allSourceNames = allDownloadNames.filter((name) => /^youtube-liked.*\.(json|csv)$/i.test(name));

for (const sourceName of allSourceNames) {
  const from = path.join(downloads, sourceName);
  const to = path.join(archiveDir, sourceName);
  try { fs.copyFileSync(from, to); } catch (error) {
    console.warn(`[archive] Could not copy ${sourceName}: ${error.message}`);
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  sourceDirectory: downloads,
  outputDirectory: outDir,
  accounts: []
};
const allAccountRows = [];

for (const def of accountDefs) {
  const candidates = discoverCandidates(def, allJsonNames);
  const parsedSources = [];

  for (const filePath of candidates) {
    const parsed = safeReadJson(filePath);
    if (!parsed.ok) {
      console.warn(`[${def.language}] Invalid JSON ${path.basename(filePath)}: ${parsed.error}`);
      continue;
    }
    const videos = extractVideos(parsed.value);
    parsedSources.push({
      filePath,
      fileName: path.basename(filePath),
      doc: parsed.value,
      videos,
      declaredCount: getDeclaredCount(parsed.value)
    });
  }

  if (parsedSources.length === 0) {
    manifest.accounts.push({
      language: def.language,
      email: def.email,
      status: 'missing_source',
      outputJson: null,
      outputCsv: null,
      sourceFiles: candidates.map((x) => path.basename(x))
    });
    console.warn(`[${def.language}] No usable source JSON found.`);
    continue;
  }

  const merged = new Map();
  const insertionOrder = [];
  const sourceVideoCounts = {};

  for (const source of parsedSources) {
    sourceVideoCounts[source.fileName] = source.videos.length;
    for (const record of source.videos) {
      const videoId = extractVideoId(record);
      if (!videoId) continue;
      if (!merged.has(videoId)) {
        const clone = JSON.parse(JSON.stringify(record));
        clone._sourceFiles = [source.fileName];
        merged.set(videoId, clone);
        insertionOrder.push(videoId);
      } else {
        const existing = merged.get(videoId);
        mergeFillMissing(existing, record);
        existing._sourceFiles = Array.from(new Set([...(existing._sourceFiles || []), source.fileName]));
      }
    }
  }

  const videos = insertionOrder
    .map((videoId, index) => normalizeVideo(merged.get(videoId), index, merged.get(videoId)._sourceFiles || []))
    .filter(Boolean)
    .map((video, index) => ({ ...video, likedOrder: index + 1 }));

  const channelMap = new Map();
  for (const video of videos) {
    const key = (video.channel && (video.channel.url || video.channel.name)) || 'Unknown';
    if (!channelMap.has(key)) {
      channelMap.set(key, {
        channel: (video.channel && video.channel.name) || 'Unknown',
        channelUrl: (video.channel && video.channel.url) || null,
        imageUrl: (video.channel && video.channel.imageUrl) || null,
        likedVideoCount: 0,
        totalPublicViews: 0,
        videosWithViewCount: 0,
        videoIds: []
      });
    }
    const stat = channelMap.get(key);
    stat.likedVideoCount += 1;
    stat.videoIds.push(video.videoId);
    if (Number.isFinite(video.views && video.views.number)) {
      stat.totalPublicViews += video.views.number;
      stat.videosWithViewCount += 1;
    }
    if (!stat.imageUrl && video.channel && video.channel.imageUrl) stat.imageUrl = video.channel.imageUrl;
  }

  const mostLikedChannels = Array.from(channelMap.values()).sort(
    (a, b) => b.likedVideoCount - a.likedVideoCount || b.totalPublicViews - a.totalPublicViews
  );
  const videosByPublicViews = videos
    .filter((video) => Number.isFinite(video.views && video.views.number))
    .slice()
    .sort((a, b) => b.views.number - a.views.number);

  const declaredCounts = parsedSources
    .map((source) => source.declaredCount)
    .filter((value) => Number.isFinite(value));

  const output = {
    generatedAt: new Date().toISOString(),
    source: 'YouTube Liked Videos',
    caveat: 'Public YouTube view counts are not personal watch counts.',
    account: {
      language: def.language,
      email: def.email,
      localPart: def.email.split('@')[0],
      normalizedFileStem: def.stem
    },
    summary: {
      totalLikedVideos: videos.length,
      totalChannels: channelMap.size,
      declaredPlaylistCount: declaredCounts.length ? Math.max(...declaredCounts) : null,
      sourceFiles: parsedSources.map((source) => source.fileName),
      sourceVideoCounts
    },
    mostLikedChannels,
    videosByPublicViews,
    videos
  };

  const jsonPath = path.join(outDir, `${def.stem}.json`);
  const csvPath = path.join(outDir, `${def.stem}.csv`);
  fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2), 'utf8');
  fs.writeFileSync(csvPath, buildCsv(output), 'utf8');

  manifest.accounts.push({
    language: def.language,
    email: def.email,
    status: 'complete',
    totalVideos: videos.length,
    totalChannels: channelMap.size,
    sourceFiles: output.summary.sourceFiles,
    outputJson: path.basename(jsonPath),
    outputCsv: path.basename(csvPath)
  });

  for (const video of videos) {
    allAccountRows.push({
      language: def.language,
      accountEmail: def.email,
      ...video
    });
  }

  console.log(`[${def.language}] ${videos.length} videos -> ${path.basename(jsonPath)} + CSV`);
}

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
fs.writeFileSync(
  path.join(outDir, 'all-accounts.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), videos: allAccountRows }, null, 2),
  'utf8'
);

console.log(`\nDone. Normalized output: ${outDir}`);
console.table(manifest.accounts.map((account) => ({
  language: account.language,
  status: account.status,
  videos: account.totalVideos || 0,
  json: account.outputJson || ''
})));

'@

$Utf8NoBom = New-Object System.Text.UTF8Encoding -ArgumentList $false
[IO.File]::WriteAllText($HelperPath, $JavaScript, $Utf8NoBom)

Write-Host ''
Write-Host 'Normalizing and merging YouTube liked-video exports...' -ForegroundColor Cyan
Write-Host 'youtube-liked-videos (7).json is treated as the primary Swedish source.' -ForegroundColor Cyan

& $Node.Source $HelperPath
if ($LASTEXITCODE -ne 0) {
    throw "Normalizer failed with exit code $LASTEXITCODE"
}

$Bundle = Join-Path $DataRoot 'youtube-liked-normalized-bundle.zip'
if (Test-Path -LiteralPath $Bundle) {
    Remove-Item -LiteralPath $Bundle -Force
}

$BundleFiles = Get-ChildItem -LiteralPath $DataRoot -File | Where-Object {
    $_.Name -match '^youtube-liked-.*\.(json|csv)$' -or
    $_.Name -in @('manifest.json', 'all-accounts.json')
}

if ($BundleFiles.Count -gt 0) {
    Compress-Archive `
        -LiteralPath $BundleFiles.FullName `
        -DestinationPath $Bundle `
        -CompressionLevel Optimal
}

Write-Host ''
Write-Host 'DONE' -ForegroundColor Green
Write-Host "Normalized files: $DataRoot" -ForegroundColor Green
Write-Host "Raw source archive: $(Join-Path $DataRoot '_source-archive')" -ForegroundColor DarkGray
Write-Host "Upload bundle: $Bundle" -ForegroundColor Cyan
Write-Host ''

Get-Content -Raw -LiteralPath (Join-Path $DataRoot 'manifest.json') |
    ConvertFrom-Json |
    Select-Object -ExpandProperty accounts |
    Select-Object language, email, status, totalVideos, outputJson, outputCsv |
    Format-Table -AutoSize
