param(
    [int]$MaxItems = 0,
    [switch]$Headless,
    [switch]$LoginFirst,
    [int]$MinDelayMs = 2800,
    [int]$MaxDelayMs = 5200
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$Root = 'D:\website'
$InputDir = Join-Path $Root 'catalog-handoff\instagram-audit-clean'
$OutputDir = Join-Path $Root 'catalog-handoff\instagram-browser-recovered'
$ProfileDir = Join-Path $OutputDir 'chrome-profile'
$HelperPath = Join-Path $OutputDir 'recover-instagram-browser.cjs'
$ConfigPath = Join-Path $OutputDir 'recovery-config.json'

$LikesPath = Join-Path $InputDir 'instagram-1000-likes-AUDIT-CLEAN.json'
$RepostsPath = Join-Path $InputDir 'instagram-208-reposts-AUDIT-CLEAN.json'

foreach ($Required in @($LikesPath, $RepostsPath)) {
    if (-not (Test-Path -LiteralPath $Required)) {
        throw "Required audit-clean source not found: $Required"
    }
}

$Node = Get-Command node.exe -ErrorAction SilentlyContinue
if (-not $Node) {
    $Node = Get-Command node -ErrorAction SilentlyContinue
}
if (-not $Node) {
    throw 'Node.js was not found in PATH.'
}

$ChromeCandidates = @(
    "$env:ProgramFiles\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "$env:LOCALAPPDATA\Google\Chrome\Application\chrome.exe"
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }

$ChromePath = $ChromeCandidates | Select-Object -First 1
if (-not $ChromePath) {
    throw 'Google Chrome was not found in the standard install locations.'
}

New-Item -ItemType Directory -Force -Path $OutputDir, $ProfileDir | Out-Null

$JavaScript = @'
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

function loadPlaywright() {
  for (const name of ['playwright-core', 'playwright']) {
    try {
      return require(name);
    } catch (_) {}
  }
  throw new Error(
    'Neither playwright-core nor playwright is installed under D:\\website\\node_modules. ' +
    'Install one locally or run from the existing website project that already uses Playwright.'
  );
}

const { chromium } = loadPlaywright();
const config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

const BAD_CREATORS = new Set(['ajax', 'media', 'mjolkson']);
const RESERVED_USERNAMES = new Set([
  'accounts', 'about', 'developer', 'developers', 'direct', 'directory',
  'emailsignup', 'explore', 'help', 'legal', 'p', 'privacy', 'reel',
  'reels', 'stories', 'terms', 'web'
]);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const randomInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
const clean = value => String(value ?? '').replace(/\u00a0/g, ' ').replace(/\r/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

function isGoodCreator(value) {
  const creator = clean(value).replace(/^@/, '');
  return /^[A-Za-z0-9._]{1,30}$/.test(creator)
    && !BAD_CREATORS.has(creator.toLowerCase())
    && !RESERVED_USERNAMES.has(creator.toLowerCase());
}

function normalizeUsername(value) {
  const username = clean(value).replace(/^@/, '');
  return isGoodCreator(username) ? username : null;
}

function needsCreator(row) {
  return !isGoodCreator(row.creator);
}

function needsCaption(row) {
  return !clean(row.caption);
}

function atomicWriteJson(filePath, value) {
  const tempPath = `${filePath}.tmp`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(tempPath, JSON.stringify(value, null, 2), 'utf8');
  if (fs.existsSync(filePath)) fs.rmSync(filePath, { force: true });
  fs.renameSync(tempPath, filePath);
}

function csvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function writeCsv(filePath, rows, kind) {
  const orderKey = kind === 'likes' ? 'likeOrder' : 'repostOrder';
  const columns = [
    orderKey, 'creator', 'caption', 'postedAt', 'mediaType', 'permalink',
    'shortcode', 'mediaId', 'creatorAuditStatus', 'creatorRecoveryStatus',
    'creatorRecoverySource', 'creatorRecoveryConfidence',
    'captionRecoveryStatus', 'browserRecoveryLastError'
  ];
  const body = [
    columns.join(','),
    ...rows.map(row => columns.map(column => csvCell(row[column])).join(','))
  ].join('\r\n');
  fs.writeFileSync(filePath, `\uFEFF${body}`, 'utf8');
}

function getRows(document, key) {
  if (!document || !Array.isArray(document[key])) {
    throw new Error(`Expected top-level array '${key}' was not found.`);
  }
  return document[key];
}

function maybeLoadWorking(sourceDocument, sourceRows, workingPath, key) {
  if (!fs.existsSync(workingPath)) return sourceDocument;
  try {
    const working = JSON.parse(fs.readFileSync(workingPath, 'utf8'));
    const rows = getRows(working, key);
    if (rows.length !== sourceRows.length) return sourceDocument;
    const sourceKeys = [sourceRows[0]?.shortcode, sourceRows.at(-1)?.shortcode];
    const workingKeys = [rows[0]?.shortcode, rows.at(-1)?.shortcode];
    if (sourceKeys[0] !== workingKeys[0] || sourceKeys[1] !== workingKeys[1]) return sourceDocument;
    console.log(`[RESUME] ${path.basename(workingPath)} loaded.`);
    return working;
  } catch (error) {
    console.warn(`[RESUME] Could not read working file; using audit-clean source: ${error.message}`);
    return sourceDocument;
  }
}

function decodeJsonString(raw) {
  if (!raw) return '';
  try {
    return JSON.parse(`"${raw}"`);
  } catch (_) {
    return clean(raw.replace(/\\n/g, '\n').replace(/\\r/g, '').replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\u0026/g, '&'));
  }
}

function isGenericInstagramText(value) {
  const text = clean(value).toLowerCase();
  if (!text) return true;
  return [
    'sign up to see photos', 'log in to instagram', 'see instagram photos',
    'no te pierdas ninguna publicación', 'regístrate en instagram',
    'don\'t miss any posts', 'don\'t miss a post', 'sign up for instagram',
    'ne manquez aucune publication', 'inscrivez-vous sur instagram',
    'non perderti nessun post', 'iscriviti a instagram',
    'não perca nenhuma publicação', 'cadastre-se no instagram',
    'verpasse keinen beitrag', 'registriere dich bei instagram',
    'jangan lewatkan postingan', 'daftar ke instagram'
  ].some(fragment => text.includes(fragment));
}

function extractCaptionFromMeta(value) {
  const text = clean(value);
  if (!text || isGenericInstagramText(text)) return '';

  const quoted = text.match(/:\s*["“]([\s\S]+)["”]\s*$/);
  if (quoted?.[1] && !isGenericInstagramText(quoted[1])) return clean(quoted[1]);

  const instagramColon = text.match(/(?:on|sur|su|no|auf)\s+Instagram[^:]{0,180}:\s*([\s\S]+)$/i);
  if (instagramColon?.[1]) {
    const candidate = clean(instagramColon[1].replace(/^["“]|["”]$/g, ''));
    if (candidate && !isGenericInstagramText(candidate)) return candidate;
  }

  return '';
}

function collectUsernameCandidates(snapshot) {
  const candidates = [];
  const add = (value, source, confidence, weight) => {
    const username = normalizeUsername(value);
    if (!username) return;
    candidates.push({ username, source, confidence, weight });
  };

  const altPatterns = [
    /Foto del perfil de\s+@?([A-Za-z0-9._]{1,30})/i,
    /Profile picture of\s+@?([A-Za-z0-9._]{1,30})/i,
    /Photo de profil de\s+@?([A-Za-z0-9._]{1,30})/i,
    /Immagine del profilo di\s+@?([A-Za-z0-9._]{1,30})/i,
    /Profilbild von\s+@?([A-Za-z0-9._]{1,30})/i,
    /Foto do perfil de\s+@?([A-Za-z0-9._]{1,30})/i,
    /Foto profil(?: dari)?\s+@?([A-Za-z0-9._]{1,30})/i,
    /Profilbild för\s+@?([A-Za-z0-9._]{1,30})/i,
    /Фото профиля\s+@?([A-Za-z0-9._]{1,30})/i
  ];

  for (const alt of snapshot.altTexts || []) {
    for (const pattern of altPatterns) {
      const match = String(alt).match(pattern);
      if (match?.[1]) add(match[1], 'profile_image_alt', 'high', 100);
    }
  }

  const bodyPatterns = [
    /No te pierdas ninguna publicación de\s+@?([A-Za-z0-9._]{1,30})/i,
    /Don['’]t miss (?:any posts|a post) from\s+@?([A-Za-z0-9._]{1,30})/i,
    /Ne manquez aucune publication de\s+@?([A-Za-z0-9._]{1,30})/i,
    /Non perderti nessun post di\s+@?([A-Za-z0-9._]{1,30})/i,
    /Não perca nenhuma publicação de\s+@?([A-Za-z0-9._]{1,30})/i,
    /Verpasse keinen Beitrag von\s+@?([A-Za-z0-9._]{1,30})/i,
    /Jangan lewatkan postingan dari\s+@?([A-Za-z0-9._]{1,30})/i,
    /Missa inga inlägg från\s+@?([A-Za-z0-9._]{1,30})/i
  ];

  for (const pattern of bodyPatterns) {
    const match = String(snapshot.bodyText || '').match(pattern);
    if (match?.[1]) add(match[1], 'signup_landing_text', 'high', 95);
  }

  for (const source of [snapshot.ogTitle, snapshot.title, snapshot.description, snapshot.ogDescription]) {
    const text = clean(source);
    if (!text) continue;
    for (const pattern of [
      /@([A-Za-z0-9._]{1,30})\s+(?:on|su|sur|auf)\s+Instagram/i,
      /^([A-Za-z0-9._]{1,30})\s+(?:on|su|sur|auf)\s+Instagram/i,
      /Instagram (?:photo|post|reel) by\s+@?([A-Za-z0-9._]{1,30})/i
    ]) {
      const match = text.match(pattern);
      if (match?.[1]) add(match[1], 'page_meta', 'medium', 75);
    }
  }

  for (const username of snapshot.profileLinkCandidates || []) {
    add(username, 'profile_link', 'high', 90);
  }

  for (const scriptText of snapshot.scriptTexts || []) {
    for (const pattern of [
      /"owner"\s*:\s*\{[\s\S]{0,4000}?"username"\s*:\s*"([A-Za-z0-9._]{1,30})"/,
      /\\"owner\\"\s*:\s*\{[\s\S]{0,4000}?\\"username\\"\s*:\s*\\"([A-Za-z0-9._]{1,30})\\"/
    ]) {
      const match = scriptText.match(pattern);
      if (match?.[1]) add(match[1], 'embedded_owner_json', 'high', 98);
    }
  }

  candidates.sort((a, b) => b.weight - a.weight);
  return candidates[0] || null;
}

function collectCaption(snapshot) {
  const candidates = [];
  const add = (value, source, weight) => {
    const caption = clean(value);
    if (!caption || caption.length < 2 || isGenericInstagramText(caption)) return;
    candidates.push({ caption, source, weight });
  };

  add(extractCaptionFromMeta(snapshot.ogDescription), 'og_description', 100);
  add(extractCaptionFromMeta(snapshot.description), 'meta_description', 95);

  for (const jsonLd of snapshot.jsonLd || []) {
    if (typeof jsonLd === 'string') add(jsonLd, 'json_ld', 85);
  }

  for (const scriptText of snapshot.scriptTexts || []) {
    for (const pattern of [
      /"caption_text"\s*:\s*"((?:\\.|[^"\\])*)"/,
      /"edge_media_to_caption"\s*:\s*\{[\s\S]{0,7000}?"text"\s*:\s*"((?:\\.|[^"\\])*)"/,
      /"caption"\s*:\s*\{[\s\S]{0,5000}?"text"\s*:\s*"((?:\\.|[^"\\])*)"/
    ]) {
      const match = scriptText.match(pattern);
      if (match?.[1]) add(decodeJsonString(match[1]), 'embedded_caption_json', 90);
    }
  }

  candidates.sort((a, b) => b.weight - a.weight || b.caption.length - a.caption.length);
  return candidates[0] || null;
}

async function snapshotFrame(frame) {
  return frame.evaluate(() => {
    const meta = selector => document.querySelector(selector)?.getAttribute('content') || '';
    const altTexts = [...document.querySelectorAll('img[alt]')].map(image => image.getAttribute('alt') || '').filter(Boolean);
    const profileLinkCandidates = [];

    for (const image of document.querySelectorAll('img[alt]')) {
      if (!/(profile|perfil|profil|profilo|профил)/i.test(image.getAttribute('alt') || '')) continue;
      let node = image;
      for (let depth = 0; node && depth < 8; depth++, node = node.parentElement) {
        const anchor = node.matches?.('a[href]') ? node : node.querySelector?.('a[href]');
        if (!anchor) continue;
        const href = anchor.getAttribute('href') || '';
        const match = href.match(/^\/@?([A-Za-z0-9._]{1,30})\/?(?:\?|$)/);
        if (match?.[1]) profileLinkCandidates.push(match[1]);
      }
    }

    const jsonLd = [];
    const walk = (value, depth = 0) => {
      if (value == null || depth > 10) return;
      if (Array.isArray(value)) {
        for (const item of value) walk(item, depth + 1);
        return;
      }
      if (typeof value !== 'object') return;
      for (const key of ['articleBody', 'caption', 'description']) {
        if (typeof value[key] === 'string' && value[key].trim()) jsonLd.push(value[key]);
      }
      for (const child of Object.values(value)) walk(child, depth + 1);
    };

    for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
      try { walk(JSON.parse(script.textContent || '')); } catch (_) {}
    }

    const scriptTexts = [...document.scripts]
      .map(script => script.textContent || '')
      .filter(text => /(?:owner|username|caption_text|edge_media_to_caption)/.test(text))
      .slice(0, 20)
      .map(text => text.slice(0, 400000));

    return {
      title: document.title || '',
      ogTitle: meta('meta[property="og:title"]'),
      ogDescription: meta('meta[property="og:description"]'),
      description: meta('meta[name="description"]'),
      bodyText: (document.body?.innerText || '').slice(0, 250000),
      altTexts,
      profileLinkCandidates: [...new Set(profileLinkCandidates)],
      jsonLd: [...new Set(jsonLd)].slice(0, 30),
      scriptTexts
    };
  });
}

async function collectSnapshot(page) {
  const snapshots = [];
  for (const frame of page.frames()) {
    try {
      snapshots.push(await snapshotFrame(frame));
    } catch (_) {}
  }
  return {
    title: snapshots.map(item => item.title).find(Boolean) || '',
    ogTitle: snapshots.map(item => item.ogTitle).find(Boolean) || '',
    ogDescription: snapshots.map(item => item.ogDescription).find(Boolean) || '',
    description: snapshots.map(item => item.description).find(Boolean) || '',
    bodyText: snapshots.map(item => item.bodyText).filter(Boolean).join('\n'),
    altTexts: snapshots.flatMap(item => item.altTexts || []),
    profileLinkCandidates: snapshots.flatMap(item => item.profileLinkCandidates || []),
    jsonLd: snapshots.flatMap(item => item.jsonLd || []),
    scriptTexts: snapshots.flatMap(item => item.scriptTexts || [])
  };
}

function permalinkVariants(permalink) {
  const base = String(permalink || '').split('?')[0].replace(/\/?$/, '/');
  if (!base) return [];
  return [base, `${base}embed/captioned/`];
}

function appearsRateLimited(status, snapshot) {
  const text = `${snapshot?.title || ''}\n${snapshot?.bodyText || ''}`.toLowerCase();
  return status === 429 || [
    'please wait a few minutes', 'try again later', 'inténtalo de nuevo más tarde',
    'we restrict certain activity', 'rate limit', 'too many requests'
  ].some(fragment => text.includes(fragment));
}

async function visitVariant(page, url) {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1800);
  const snapshot = await collectSnapshot(page);
  return { status: response?.status() ?? null, finalUrl: page.url(), snapshot };
}

async function recoverRow(page, row) {
  const creatorNeeded = needsCreator(row);
  const captionNeeded = needsCaption(row);
  let bestCreator = null;
  let bestCaption = null;
  let lastStatus = null;
  let lastUrl = null;

  for (const url of permalinkVariants(row.permalink)) {
    const result = await visitVariant(page, url);
    lastStatus = result.status;
    lastUrl = result.finalUrl;

    if (appearsRateLimited(result.status, result.snapshot)) {
      const error = new Error('Instagram rate limit detected');
      error.code = 'RATE_LIMIT';
      throw error;
    }

    const creator = collectUsernameCandidates(result.snapshot);
    const caption = collectCaption(result.snapshot);

    if (creator && (!bestCreator || creator.weight > bestCreator.weight)) bestCreator = creator;
    if (caption && (!bestCaption || caption.weight > bestCaption.weight)) bestCaption = caption;

    if ((!creatorNeeded || bestCreator) && (!captionNeeded || bestCaption)) break;
  }

  return { bestCreator, bestCaption, lastStatus, lastUrl };
}

async function promptEnter(message) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise(resolve => rl.question(message, () => resolve()));
  rl.close();
}

async function main() {
  fs.mkdirSync(config.outputDir, { recursive: true });
  fs.mkdirSync(config.profileDir, { recursive: true });

  const args = ['--no-first-run', '--no-default-browser-check'];
  if (!config.headless && !config.loginFirst) args.push('--start-minimized');

  const context = await chromium.launchPersistentContext(config.profileDir, {
    executablePath: config.chromePath,
    headless: Boolean(config.headless),
    locale: 'es-ES',
    viewport: { width: 1280, height: 900 },
    ignoreHTTPSErrors: true,
    args
  });

  context.setDefaultTimeout(15000);
  const pages = context.pages();
  const page = pages[0] || await context.newPage();

  await page.route('**/*', route => {
    const type = route.request().resourceType();
    if (type === 'media' || type === 'font') return route.abort();
    return route.continue();
  });

  if (config.loginFirst) {
    await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    console.log('\nLog into Instagram in the automation Chrome window if needed.');
    await promptEnter('When the browser is ready, press ENTER here to start recovery... ');
  }

  const state = {
    context,
    activeDocument: null,
    activeWorkingPath: null,
    activeKey: null,
    stopping: false
  };

  const saveActive = () => {
    if (!state.activeDocument || !state.activeWorkingPath) return;
    atomicWriteJson(state.activeWorkingPath, state.activeDocument);
  };

  const stopHandler = async signal => {
    if (state.stopping) return;
    state.stopping = true;
    console.warn(`\n${signal}: saving current working file before exit...`);
    try { saveActive(); } catch (_) {}
    try { await context.close(); } catch (_) {}
    process.exit(130);
  };

  process.on('SIGINT', () => stopHandler('SIGINT'));
  process.on('SIGTERM', () => stopHandler('SIGTERM'));

  const combinedSummary = {
    generatedAt: new Date().toISOString(),
    source: 'Instagram browser DOM owner/caption recovery',
    datasets: []
  };
  const allUnresolved = [];
  let globalAttempts = 0;

  for (const source of config.sources) {
    const sourceDocument = JSON.parse(fs.readFileSync(source.path, 'utf8'));
    const sourceRows = getRows(sourceDocument, source.key);
    const workingPath = path.join(config.outputDir, `${path.basename(source.path, '.json')}-BROWSER-WORKING.json`);
    const finalJsonPath = path.join(config.outputDir, `${path.basename(source.path, '.json')}-BROWSER-RECOVERED.json`);
    const finalCsvPath = path.join(config.outputDir, `${path.basename(source.path, '.json')}-BROWSER-RECOVERED.csv`);

    const document = maybeLoadWorking(sourceDocument, sourceRows, workingPath, source.key);
    const rows = getRows(document, source.key);
    state.activeDocument = document;
    state.activeWorkingPath = workingPath;
    state.activeKey = source.key;

    const before = {
      missingCreators: rows.filter(needsCreator).length,
      missingCaptions: rows.filter(needsCaption).length
    };

    let attempted = 0;
    let creatorsRecovered = 0;
    let captionsRecovered = 0;
    let rateLimitCount = 0;

    console.log(`\n[${source.kind.toUpperCase()}] ${rows.length} rows | creator gaps=${before.missingCreators} | caption gaps=${before.missingCaptions}`);

    for (let index = 0; index < rows.length; index++) {
      if (config.maxItems > 0 && globalAttempts >= config.maxItems) break;
      const row = rows[index];
      if (!needsCreator(row) && !needsCaption(row)) continue;
      if (!row.permalink) continue;

      attempted++;
      globalAttempts++;
      const creatorWasNeeded = needsCreator(row);
      const captionWasNeeded = needsCaption(row);
      row.browserRecoveryAttemptCount = Number(row.browserRecoveryAttemptCount || 0) + 1;
      row.browserRecoveryAttemptedAt = new Date().toISOString();

      let recovered = null;
      let retries = 0;
      while (!recovered) {
        try {
          recovered = await recoverRow(page, row);
        } catch (error) {
          if (error.code === 'RATE_LIMIT') {
            rateLimitCount++;
            retries++;
            const waitMs = Math.min(30 * 60 * 1000, [3, 8, 15, 30][Math.min(retries - 1, 3)] * 60 * 1000) + randomInt(15000, 60000);
            console.warn(`[${source.kind}] 429/rate limit at ${index + 1}/${rows.length}; cooling down ~${Math.ceil(waitMs / 60000)} min and retrying same item.`);
            saveActive();
            await sleep(waitMs);
            continue;
          }
          row.browserRecoveryLastError = String(error?.message || error);
          row.creatorRecoveryStatus = creatorWasNeeded ? 'unresolved_browser_error' : row.creatorRecoveryStatus;
          row.captionRecoveryStatus = captionWasNeeded ? 'unresolved_browser_error' : row.captionRecoveryStatus;
          break;
        }
      }

      if (recovered) {
        row.browserRecoveryHttpStatus = recovered.lastStatus;
        row.browserRecoveryFinalUrl = recovered.lastUrl;
        row.browserRecoveryLastError = '';

        if (creatorWasNeeded && recovered.bestCreator) {
          row.creatorBeforeBrowserRecovery = row.creator ?? null;
          row.creator = recovered.bestCreator.username;
          row.creatorRecoveryStatus = 'recovered';
          row.creatorRecoverySource = recovered.bestCreator.source;
          row.creatorRecoveryConfidence = recovered.bestCreator.confidence;
          row.creatorRecoveredAt = new Date().toISOString();
          row.creatorAuditStatus = 'recovered_from_public_instagram_page';
          creatorsRecovered++;
        } else if (creatorWasNeeded) {
          row.creatorRecoveryStatus = 'unresolved_no_verified_owner_in_page';
        }

        if (captionWasNeeded && recovered.bestCaption) {
          row.caption = recovered.bestCaption.caption;
          row.captionRecoveryStatus = 'recovered';
          row.captionRecoverySource = recovered.bestCaption.source;
          row.captionRecoveredAt = new Date().toISOString();
          captionsRecovered++;
        } else if (captionWasNeeded) {
          row.captionRecoveryStatus = 'unresolved_no_verified_caption_in_page';
        }
      }

      if (attempted % 5 === 0) saveActive();
      if (attempted % 10 === 0 || creatorWasNeeded && isGoodCreator(row.creator) || captionWasNeeded && clean(row.caption)) {
        console.log(`[${source.kind}] ${attempted} attempted | creators recovered=${creatorsRecovered} | captions recovered=${captionsRecovered} | remaining creators=${rows.filter(needsCreator).length} | remaining captions=${rows.filter(needsCaption).length}`);
      }

      await sleep(randomInt(config.minDelayMs, config.maxDelayMs));
      if (attempted % 40 === 0) {
        const rest = randomInt(25000, 55000);
        console.log(`[${source.kind}] courtesy pause ${Math.ceil(rest / 1000)}s...`);
        await sleep(rest);
      }
    }

    saveActive();
    const after = {
      missingCreators: rows.filter(needsCreator).length,
      missingCaptions: rows.filter(needsCaption).length
    };

    const finalDocument = {
      ...document,
      browserRecovery: {
        generatedAt: new Date().toISOString(),
        sourceFile: source.path,
        attemptedThisRun: attempted,
        creatorsRecoveredThisRun: creatorsRecovered,
        captionsRecoveredThisRun: captionsRecovered,
        rateLimitCount,
        before,
        after
      },
      [source.key]: rows
    };

    atomicWriteJson(finalJsonPath, finalDocument);
    writeCsv(finalCsvPath, rows, source.kind);

    for (const row of rows) {
      if (needsCreator(row) || needsCaption(row)) {
        allUnresolved.push({
          kind: source.kind,
          order: source.kind === 'likes' ? row.likeOrder : row.repostOrder,
          permalink: row.permalink,
          shortcode: row.shortcode,
          creator: row.creator ?? null,
          caption: row.caption ?? '',
          creatorRecoveryStatus: row.creatorRecoveryStatus ?? null,
          captionRecoveryStatus: row.captionRecoveryStatus ?? null,
          error: row.browserRecoveryLastError ?? null
        });
      }
    }

    combinedSummary.datasets.push({
      kind: source.kind,
      count: rows.length,
      attemptedThisRun: attempted,
      creatorsRecoveredThisRun: creatorsRecovered,
      captionsRecoveredThisRun: captionsRecovered,
      before,
      after,
      finalJsonPath,
      finalCsvPath,
      workingPath
    });

    console.log(`[${source.kind.toUpperCase()}] DONE | creators ${before.missingCreators} -> ${after.missingCreators} missing | captions ${before.missingCaptions} -> ${after.missingCaptions} missing`);
  }

  atomicWriteJson(path.join(config.outputDir, 'instagram-browser-recovery-summary.json'), combinedSummary);
  atomicWriteJson(path.join(config.outputDir, 'instagram-browser-recovery-unresolved.json'), {
    generatedAt: new Date().toISOString(),
    count: allUnresolved.length,
    rows: allUnresolved
  });

  await context.close();
  console.log(`\nFinished. Outputs: ${config.outputDir}`);
}

main().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
'@

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText($HelperPath, $JavaScript, $Utf8NoBom)

$Config = [ordered]@{
    root = $Root
    outputDir = $OutputDir
    profileDir = $ProfileDir
    chromePath = $ChromePath
    headless = [bool]$Headless
    loginFirst = [bool]$LoginFirst
    maxItems = $MaxItems
    minDelayMs = $MinDelayMs
    maxDelayMs = $MaxDelayMs
    sources = @(
        [ordered]@{ kind = 'likes'; key = 'likes'; path = $LikesPath },
        [ordered]@{ kind = 'reposts'; key = 'reposts'; path = $RepostsPath }
    )
}

[IO.File]::WriteAllText(
    $ConfigPath,
    ($Config | ConvertTo-Json -Depth 8),
    $Utf8NoBom
)

Write-Host ''
Write-Host 'INSTAGRAM BROWSER OWNER/CAPTION RECOVERY' -ForegroundColor Cyan
Write-Host "Chrome:   $ChromePath" -ForegroundColor DarkGray
Write-Host "Inputs:   $InputDir" -ForegroundColor DarkGray
Write-Host "Outputs:  $OutputDir" -ForegroundColor DarkGray
Write-Host "MaxItems: $(if ($MaxItems -gt 0) { $MaxItems } else { 'ALL' })" -ForegroundColor DarkGray
Write-Host ''
Write-Host 'The audit-clean JSON files are read-only. Progress is written to separate BROWSER-WORKING files.' -ForegroundColor Yellow
Write-Host 'Press Ctrl+C at any time; the helper saves the active working JSON before exit.' -ForegroundColor Yellow
Write-Host ''

& $Node.Source $HelperPath $ConfigPath

if ($LASTEXITCODE -ne 0) {
    throw "Instagram browser recovery exited with code $LASTEXITCODE"
}

Write-Host ''
Write-Host 'RECOVERY COMPLETE' -ForegroundColor Green
Write-Host "Summary: $(Join-Path $OutputDir 'instagram-browser-recovery-summary.json')" -ForegroundColor Green
Write-Host "Unresolved: $(Join-Path $OutputDir 'instagram-browser-recovery-unresolved.json')" -ForegroundColor Yellow
