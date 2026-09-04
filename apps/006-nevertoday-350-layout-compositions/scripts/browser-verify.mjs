import fs from 'node:fs/promises';
import path from 'node:path';

const [webSocketUrl, baseUrl, outputDirectory] = process.argv.slice(2);

if (!webSocketUrl || !baseUrl || !outputDirectory) {
  throw new Error('Usage: node scripts/browser-verify.mjs <cdp-websocket-url> <base-url> <output-directory>');
}

const socket = new WebSocket(webSocketUrl);
const pending = new Map();
const browserErrors = [];
let messageId = 0;

const opened = new Promise((resolve, reject) => {
  socket.addEventListener('open', resolve, { once: true });
  socket.addEventListener('error', reject, { once: true });
});

socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }

  if (message.method === 'Runtime.exceptionThrown') {
    browserErrors.push(message.params.exceptionDetails.text);
  }
  if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') {
    browserErrors.push(message.params.entry.text);
  }
});

await opened;

function command(method, params = {}) {
  const id = ++messageId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function evaluate(expression) {
  const result = await command('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text);
  }

  return result.result.value;
}

async function setViewport(width, height, mobile = false) {
  await command('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
    screenWidth: width,
    screenHeight: height,
  });
}

async function navigate(url) {
  await command('Page.navigate', { url });
  await wait(1800);
  await evaluate(`new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))`);
}

async function scrollToCase() {
  await evaluate(`document.querySelector('#image-case').scrollIntoView({ block: 'start' })`);
  await wait(250);
}

async function scrollTo(selector) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({ block: 'start' })`);
  await wait(350);
}

async function capture(filename) {
  const result = await command('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await fs.writeFile(path.join(outputDirectory, filename), Buffer.from(result.data, 'base64'));
}

async function inspect(label) {
  return evaluate(`(() => {
    const visiblePanels = [...document.querySelectorAll('#case-studio [role="tabpanel"]')]
      .filter((panel) => !panel.hidden)
      .map((panel) => panel.id);
    return {
      label: ${JSON.stringify(label)},
      viewport: [window.innerWidth, window.innerHeight],
      noHorizontalOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      articleCharacters: document.querySelector('#article-input').value.length,
      analysisStatus: document.querySelector('#article-analysis-status').textContent.trim(),
      decisions: document.querySelectorAll('#layout-decisions [data-signal-rule]').length,
      decisionImages: document.querySelectorAll('#layout-decisions img').length,
      tabs: document.querySelectorAll('#case-studio [role="tab"]').length,
      visiblePanels,
      visualHookImages: document.querySelectorAll('.selfcase-visual-hook img').length,
      ownershipCards: document.querySelectorAll('.capability-ownership > ol > li').length,
      repositoryContactImages: document.querySelectorAll('.repository-contact-sheet img').length,
      reportCategoryBars: document.querySelectorAll('.generated-category-bars > div').length,
      carouselSlides: document.querySelectorAll('[data-carousel-slide]').length,
      posterCategoryBars: document.querySelectorAll('.knowledge-category-map > div').length,
      deckSlides: document.querySelectorAll('.deck-slide-grid > li').length,
      deckImages: document.querySelectorAll('.deck-slide-grid img').length,
      catalogCards: document.querySelectorAll('.catalog-card').length,
      categoryGroups: document.querySelectorAll('.catalog-category-group').length,
      topicGroups: document.querySelectorAll('.catalog-topic-group').length,
    };
  })()`);
}

await fs.mkdir(outputDirectory, { recursive: true });
await command('Page.enable');
await command('Runtime.enable');
await command('Log.enable');

await setViewport(1440, 1000);
await navigate(`${baseUrl}?browserVerify=desktop#image-case`);
await evaluate(`document.querySelector('#article-analyze').click()`);
await wait(1700);
await scrollToCase();
const desktop = await inspect('desktop');
await capture('repository-article-case.png');

await scrollTo('.capability-ownership');
await capture('repository-capability-ownership.png');

await scrollTo('#case-studio');
await wait(500);
const report = await inspect('report');
await capture('repository-visual-report.png');

await evaluate(`document.querySelector('#repo-tab-carousel').click()`);
await wait(250);
const carousel = await inspect('carousel');
const carouselStatusBefore = await evaluate(`document.querySelector('#repo-carousel-status').textContent.trim()`);
await evaluate(`document.querySelector('#repo-carousel-next').click()`);
await wait(150);
const carouselStatusAfter = await evaluate(`document.querySelector('#repo-carousel-status').textContent.trim()`);
await evaluate(`document.querySelector('#repo-carousel-prev').click()`);
await capture('repository-visual-carousel.png');

await evaluate(`document.querySelector('#repo-tab-poster').click()`);
await wait(300);
const poster = await inspect('poster');
await capture('repository-visual-poster.png');

await evaluate(`document.querySelector('#repo-tab-deck').click()`);
await wait(300);
const deck = await inspect('deck');
await capture('repository-visual-deck.png');

await evaluate(`document.querySelector('#repo-tab-deck').focus()`);
await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowLeft', code: 'ArrowLeft' });
await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowLeft', code: 'ArrowLeft' });
await wait(100);
const keyboardTab = await evaluate(`document.activeElement.id`);

await command('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
});
const reducedMotion = await evaluate(`({
  matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
  scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
})`);

await command('Emulation.setEmulatedMedia', { features: [] });
await setViewport(390, 844, true);
await navigate(`${baseUrl}?browserVerify=mobile#image-case`);
await scrollToCase();
const mobile = await inspect('mobile');
await capture('repository-article-case-mobile.png');
await scrollTo('#repo-panel-report');
await wait(350);
await capture('repository-visual-report-mobile.png');

const verification = {
  desktop,
  report,
  carousel,
  carouselStatusBefore,
  carouselStatusAfter,
  poster,
  deck,
  keyboardTab,
  reducedMotion,
  mobile,
  browserErrors,
};
console.log(JSON.stringify(verification, null, 2));

const failures = [];
if (!desktop.noHorizontalOverflow || !mobile.noHorizontalOverflow) failures.push('horizontal overflow');
if (desktop.decisions !== 6) failures.push(`expected 6 decisions, received ${desktop.decisions}`);
if (desktop.decisionImages !== 6) failures.push(`expected 6 decision images, received ${desktop.decisionImages}`);
if (desktop.tabs !== 4) failures.push(`expected 4 output tabs, received ${desktop.tabs}`);
if (desktop.visiblePanels.join() !== 'repo-panel-report') failures.push('desktop report panel visibility');
if (report.visiblePanels.join() !== 'repo-panel-report') failures.push('report panel visibility');
if (carousel.visiblePanels.join() !== 'repo-panel-carousel') failures.push('carousel panel visibility');
if (poster.visiblePanels.join() !== 'repo-panel-poster') failures.push('poster panel visibility');
if (deck.visiblePanels.join() !== 'repo-panel-deck') failures.push('deck panel visibility');
if (desktop.visualHookImages !== 3 || desktop.repositoryContactImages !== 4) failures.push('repository visual evidence');
if (desktop.ownershipCards !== 3) failures.push(`expected 3 capability ownership cards, received ${desktop.ownershipCards}`);
if (desktop.reportCategoryBars !== 8 || desktop.posterCategoryBars !== 8) failures.push('category data visualizations');
if (desktop.carouselSlides !== 6 || desktop.deckSlides !== 6 || desktop.deckImages < 4) failures.push('distinct output compositions');
if (carouselStatusBefore !== '01 / 06' || carouselStatusAfter !== '02 / 06') failures.push('carousel controls');
if (keyboardTab !== 'repo-tab-poster') failures.push(`keyboard tabs, focused ${keyboardTab}`);
if (!desktop.analysisStatus.includes('命中 6/6')) failures.push('article analysis did not complete');
if (desktop.catalogCards !== 350 || desktop.categoryGroups !== 8 || desktop.topicGroups !== 33) {
  failures.push('catalog regression');
}
if (!reducedMotion.matches || reducedMotion.scrollBehavior !== 'auto') failures.push('reduced motion');
if (browserErrors.length) failures.push(`browser errors: ${browserErrors.join(' | ')}`);

socket.close();

if (failures.length) {
  throw new Error(`Browser verification failed: ${failures.join('; ')}`);
}
