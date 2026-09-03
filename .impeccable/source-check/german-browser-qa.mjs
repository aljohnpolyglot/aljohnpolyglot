import { chromium } from 'playwright-core';
import fs from 'node:fs';

const baseUrl = process.argv[2] || 'http://127.0.0.1:4174/languages/german/';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const evidenceDir = '.impeccable/evidence/german';
fs.mkdirSync(evidenceDir, { recursive: true });

const browser = await chromium.launch({ executablePath: chromePath, headless: true });
const results = { url: baseUrl, passes: [], failures: [], consoleErrors: [] };

const check = (condition, label, details = '') => {
  (condition ? results.passes : results.failures).push(details ? `${label}: ${details}` : label);
};

async function prepare(page) {
  page.on('console', message => {
    if (message.type() === 'error' && !message.text().includes('Permissions policy violation: compute-pressure')) results.consoleErrors.push(message.text());
  });
  page.on('pageerror', error => results.consoleErrors.push(`PAGEERROR: ${error.message}`));
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.creator-card-de', { timeout: 15000 });
  await page.waitForSelector('.institution-card-de', { timeout: 15000 });
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });
  await page.waitForTimeout(1800);
}

const desktop = await browser.newPage({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 1 });
await prepare(desktop);
await desktop.locator('.institution-card-de img').evaluateAll(async images => {
  images.forEach(image => { image.loading = 'eager'; });
  await Promise.all(images.map(image => image.decode().catch(() => undefined)));
});
await desktop.screenshot({ path: `${evidenceDir}/desktop-first-1536x1024.png`, timeout: 60000 });

const desktopMetrics = await desktop.evaluate(() => {
  const globalHeader = document.querySelector('body > header');
  const chapter = document.querySelector('.chapter-nav-de');
  return {
    viewport: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    globalHeader: globalHeader ? { top: globalHeader.getBoundingClientRect().top, bottom: globalHeader.getBoundingClientRect().bottom } : null,
    chapter: chapter ? { top: chapter.getBoundingClientRect().top, bottom: chapter.getBoundingClientRect().bottom } : null,
    creators: document.querySelectorAll('.creator-card-de').length,
    institutions: document.querySelectorAll('.institution-card-de').length,
    extraEpisodes: document.querySelectorAll('.extra-playlist-item-de').length,
    books: document.querySelectorAll('.book-card-de').length,
    soundcloud: document.querySelector('#complete-german iframe')?.getAttribute('src') || '',
    font: getComputedStyle(document.querySelector('#hero-title-de')).fontFamily,
    texture: getComputedStyle(document.querySelector('.german-main')).backgroundImage,
    linguno: document.querySelector('.linguno-visual-de img')?.getAttribute('src') || '',
    institutionImageWidths: [...document.querySelectorAll('.institution-card-de img')].map(image => image.naturalWidth),
    creatorShelves: [...document.querySelectorAll('.creator-row-de')].map(row => {
      const cards = [...row.querySelectorAll('.creator-card-de')];
      return {
        heights: cards.map(card => Math.round(card.getBoundingClientRect().height)),
        imageRatios: cards.map(card => {
          const box = card.querySelector('.creator-card-image-de')?.getBoundingClientRect();
          return box ? Math.abs(box.width - box.height) : 999;
        })
      };
    }),
    directionContract: document.documentElement.innerHTML.includes('seed e37d0638')
  };
});

check(desktopMetrics.scrollWidth <= desktopMetrics.viewport, 'Desktop has no document-level horizontal overflow', `${desktopMetrics.scrollWidth}/${desktopMetrics.viewport}`);
check(desktopMetrics.globalHeader && desktopMetrics.chapter && desktopMetrics.chapter.top >= desktopMetrics.globalHeader.bottom - 1, 'Global and local navigation do not overlap', JSON.stringify({ global: desktopMetrics.globalHeader, chapter: desktopMetrics.chapter }));
check(desktopMetrics.creators === 67, 'Institution records are removed from general creator shelves', String(desktopMetrics.creators));
check(desktopMetrics.institutions === 2, 'Dedicated institution section contains Goethe and the embassy', String(desktopMetrics.institutions));
check(desktopMetrics.extraEpisodes === 13, 'Extr@ playlist renders all episodes', String(desktopMetrics.extraEpisodes));
check(desktopMetrics.books === 5, 'German bookshelf renders local-cover titles', String(desktopMetrics.books));
check(desktopMetrics.soundcloud.includes('playlists/157713757'), 'Language Transfer uses the supplied official embed', desktopMetrics.soundcloud);
check(desktopMetrics.font.includes('Barlow Condensed DE'), 'Self-hosted display face is active', desktopMetrics.font);
check(desktopMetrics.texture.includes('german-jersey-mesh.webp'), 'Jersey texture is active');
check(desktopMetrics.linguno.includes('linguno-german-jersey.png'), 'German Linguno uses the reference-matched jersey mascot', desktopMetrics.linguno);
check(desktopMetrics.institutionImageWidths.every(width => width >= 400), 'Institution cards use highest-resolution matching official profile images', desktopMetrics.institutionImageWidths.join('/'));
check(desktopMetrics.creatorShelves.every(shelf => !shelf.heights.length || Math.max(...shelf.heights) - Math.min(...shelf.heights) <= 1), 'Every creator shelf uses uniform card heights');
check(desktopMetrics.creatorShelves.every(shelf => shelf.imageRatios.every(delta => delta <= 1)), 'Every creator card keeps a square image frame');
check(desktopMetrics.directionContract, 'Direction contract survives in rendered HTML');

const firstCreator = desktop.locator('.creator-card-de').first();
await firstCreator.evaluate(node => node.scrollIntoView({ block: 'center' }));
await firstCreator.click({ force: true });
check(await desktop.locator('#creator-modal-de').isVisible(), 'Creator modal opens');
check(await desktop.locator('#creator-modal-close-de').evaluate(node => node === document.activeElement), 'Creator modal moves focus to close control');
const modalImageRatio = await desktop.locator('#creator-modal-image-de').evaluate(image => {
  const box = image.getBoundingClientRect();
  return Math.abs(box.width - box.height);
});
check(modalImageRatio <= 1, 'Creator modal profile image remains compact and square', String(modalImageRatio));
await desktop.keyboard.press('Escape');
check(await desktop.locator('#creator-modal-de').isHidden(), 'Creator modal closes with Escape');
check(await firstCreator.evaluate(node => node === document.activeElement), 'Creator modal restores trigger focus');

await desktop.locator('#creator-level-de').selectOption('B1');
check((await desktop.locator('#creator-filter-status-de').textContent()).includes('B1'), 'CEFR filter announces selected level');
await desktop.locator('#creator-level-de').selectOption('all');

const firstBook = desktop.locator('.book-card-de button').first();
await firstBook.evaluate(node => node.scrollIntoView({ block: 'center' }));
await firstBook.click({ force: true });
check(await desktop.locator('#book-modal-de').isVisible(), 'Book modal opens');
await desktop.locator('#book-modal-close-de').click({ force: true });
check(await desktop.locator('#book-modal-de').isHidden(), 'Book modal closes from visible close control');

const goethe = desktop.locator('.institution-card-de').first();
await goethe.evaluate(node => node.scrollIntoView({ block: 'center' }));
await goethe.click({ force: true });
check((await desktop.locator('#creator-modal-title-de').textContent()).includes('Goethe-Institut'), 'Goethe is the lead institution and opens its detail modal');
await desktop.locator('#creator-modal-close-de').click({ force: true });

await desktop.evaluate(() => window.scrollTo(0, 0));
await desktop.waitForTimeout(250);
if (process.env.GERMAN_FULL_CAPTURE === '1') {
  await desktop.screenshot({ path: `${evidenceDir}/desktop-full-1536.png`, fullPage: true, timeout: 60000 });
}
await desktop.locator('#lernweg').evaluate(node => node.scrollIntoView({ block: 'start' }));
await desktop.waitForTimeout(4500);
const soundcloudFrame = desktop.frames().find(frame => frame.url().startsWith('https://w.soundcloud.com/player/'));
check(Boolean(soundcloudFrame), 'Language Transfer player frame loads from SoundCloud');
await desktop.screenshot({ path: `${evidenceDir}/desktop-learning-1536x1024.png`, timeout: 60000 });
await desktop.locator('#linguno').evaluate(node => node.scrollIntoView({ block: 'start' }));
await desktop.waitForTimeout(350);
await desktop.screenshot({ path: `${evidenceDir}/desktop-linguno-1536x1024.png`, timeout: 60000 });
await desktop.locator('#stimmen').evaluate(node => node.scrollIntoView({ block: 'start' }));
await desktop.waitForTimeout(350);
await desktop.screenshot({ path: `${evidenceDir}/desktop-creators-1536x1024.png`, timeout: 60000 });
const footballHeading = desktop.locator('.creator-shelf-title-de h3').filter({ hasText: /^Fußball$/i }).first();
await footballHeading.evaluate(node => node.scrollIntoView({ block: 'start' }));
await desktop.waitForTimeout(350);
await desktop.screenshot({ path: `${evidenceDir}/desktop-football-1536x1024.png`, timeout: 60000 });
await desktop.locator('#institutionen').evaluate(node => node.scrollIntoView({ block: 'start' }));
await desktop.waitForTimeout(350);
await desktop.screenshot({ path: `${evidenceDir}/desktop-institutions-1536x1024.png`, timeout: 60000 });

const intermediate = await browser.newPage({ viewport: { width: 1024, height: 900 }, deviceScaleFactor: 1 });
await prepare(intermediate);
await intermediate.waitForTimeout(6000);
const intermediateMetrics = await intermediate.evaluate(() => {
  const track = document.querySelector('.institution-cards-de');
  return {
    overflow: [document.documentElement.scrollWidth, window.innerWidth],
    institutionScroll: track ? [track.scrollWidth, track.clientWidth] : [0, 0]
  };
});
check(intermediateMetrics.overflow[0] <= intermediateMetrics.overflow[1], 'Intermediate layout has no document-level horizontal overflow', intermediateMetrics.overflow.join('/'));
check(intermediateMetrics.institutionScroll[0] > intermediateMetrics.institutionScroll[1], 'Intermediate institution cards form a contained horizontal shelf', intermediateMetrics.institutionScroll.join('/'));
await intermediate.screenshot({ path: `${evidenceDir}/intermediate-first-1024x900.png`, timeout: 60000 });
const intermediateFootballHeading = intermediate.locator('.creator-shelf-title-de h3').filter({ hasText: /^Fußball$/i }).first();
await intermediateFootballHeading.evaluate(node => node.scrollIntoView({ block: 'start' }));
await intermediate.waitForTimeout(350);
await intermediate.screenshot({ path: `${evidenceDir}/intermediate-football-1024x900.png`, timeout: 60000 });
await intermediate.locator('#institutionen').evaluate(node => node.scrollIntoView({ block: 'start' }));
await intermediate.waitForTimeout(350);
await intermediate.screenshot({ path: `${evidenceDir}/intermediate-institutions-1024x900.png`, timeout: 60000 });
await intermediate.locator('.institution-card-de').nth(1).click({ force: true });
const institutionModalMetrics = await intermediate.evaluate(() => {
  const profile = document.querySelector('.creator-modal-profile-de')?.getBoundingClientRect();
  const title = document.querySelector('#creator-modal-title-de')?.getBoundingClientRect();
  const image = document.querySelector('#creator-modal-image-de')?.getBoundingClientRect();
  return {
    titleContained: Boolean(profile && title && title.left >= profile.left && title.right <= profile.right + 1),
    imageRatioDelta: image ? Math.abs(image.width - image.height) : 999
  };
});
check(institutionModalMetrics.titleContained, 'Long institution modal title stays inside its profile column');
check(institutionModalMetrics.imageRatioDelta <= 1, 'Institution modal image remains compact and square', String(institutionModalMetrics.imageRatioDelta));
check(await intermediate.locator('#creator-video-unavailable-de').isVisible(), 'Institution modal shows its explicit unavailable-video state');
check(await intermediate.locator('#creator-modal-video-de').isHidden(), 'Unavailable institution video frame stays hidden');
await intermediate.screenshot({ path: `${evidenceDir}/intermediate-institution-modal-1024x900.png`, timeout: 60000 });
await intermediate.locator('#creator-modal-close-de').click({ force: true });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await prepare(mobile);
const mobileMetrics = await mobile.evaluate(() => ({
  viewport: window.innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  chapter: document.querySelector('.chapter-nav-de')?.getBoundingClientRect().toJSON(),
  global: document.querySelector('body > header')?.getBoundingClientRect().toJSON(),
  extraScrolls: document.querySelector('.extra-playlist-list-de')?.scrollHeight > document.querySelector('.extra-playlist-list-de')?.clientHeight,
  institutionScroll: (() => { const track = document.querySelector('.institution-cards-de'); return track ? [track.scrollWidth, track.clientWidth] : [0, 0]; })(),
  modalInitiallyHidden: document.querySelector('#creator-modal-de')?.hidden
}));
check(mobileMetrics.scrollWidth <= mobileMetrics.viewport, 'Mobile has no document-level horizontal overflow', `${mobileMetrics.scrollWidth}/${mobileMetrics.viewport}`);
check(mobileMetrics.chapter && mobileMetrics.global && mobileMetrics.chapter.top >= mobileMetrics.global.bottom - 1, 'Mobile keeps both navigation layers visible and separated');
check(mobileMetrics.extraScrolls, 'Mobile Extr@ list remains contained and independently scrollable');
check(mobileMetrics.institutionScroll[0] > mobileMetrics.institutionScroll[1], 'Mobile institution cards form a contained horizontal shelf', mobileMetrics.institutionScroll.join('/'));
check(mobileMetrics.modalInitiallyHidden, 'Mobile modal is hidden by default');
await mobile.screenshot({ path: `${evidenceDir}/mobile-first-390x844.png`, timeout: 60000 });
if (process.env.GERMAN_FULL_CAPTURE === '1') {
  await mobile.screenshot({ path: `${evidenceDir}/mobile-full-390.png`, fullPage: true, timeout: 60000 });
}
await mobile.locator('#institutionen').evaluate(node => node.scrollIntoView({ block: 'start' }));
await mobile.waitForTimeout(350);
await mobile.screenshot({ path: `${evidenceDir}/mobile-institutions-390x844.png`, timeout: 60000 });
await mobile.locator('.institution-card-de').nth(1).evaluate(node => node.scrollIntoView({ block: 'center' }));
await mobile.waitForTimeout(350);
await mobile.screenshot({ path: `${evidenceDir}/mobile-institutions-embassy-390x844.png`, timeout: 60000 });
await mobile.locator('.institution-card-de').nth(1).click({ force: true });
const mobileInstitutionModalMetrics = await mobile.evaluate(() => {
  const profile = document.querySelector('.creator-modal-profile-de')?.getBoundingClientRect();
  const title = document.querySelector('#creator-modal-title-de')?.getBoundingClientRect();
  const image = document.querySelector('#creator-modal-image-de')?.getBoundingClientRect();
  const level = document.querySelector('#creator-modal-level-de')?.getBoundingClientRect();
  return {
    titleContained: Boolean(profile && title && title.left >= profile.left && title.right <= profile.right + 1),
    imageRatioDelta: image ? Math.abs(image.width - image.height) : 999,
    levelGap: title && level ? level.top - title.bottom : -1
  };
});
check(mobileInstitutionModalMetrics.titleContained, 'Mobile long institution title stays contained');
check(mobileInstitutionModalMetrics.imageRatioDelta <= 1, 'Mobile institution modal image remains square', String(mobileInstitutionModalMetrics.imageRatioDelta));
check(mobileInstitutionModalMetrics.levelGap >= 12, 'Mobile institution CEFR metadata keeps breathing room', String(mobileInstitutionModalMetrics.levelGap));
await mobile.screenshot({ path: `${evidenceDir}/mobile-institution-modal-390x844.png`, timeout: 60000 });
await mobile.locator('#creator-video-unavailable-de').scrollIntoViewIfNeeded();
await mobile.waitForTimeout(250);
check(await mobile.locator('#creator-video-unavailable-de').isVisible(), 'Mobile institution modal exposes the unavailable-video state');
await mobile.screenshot({ path: `${evidenceDir}/mobile-institution-modal-unavailable-390x844.png`, timeout: 60000 });
await mobile.locator('#creator-modal-close-de').click({ force: true });

await browser.close();
fs.writeFileSync(`${evidenceDir}/qa-results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
if (results.failures.length) process.exitCode = 1;
