import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import React, { act, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Lifecycle and accessibility behavior in jsdom; not browser visual testing.
const dom = new JSDOM('<!doctype html><html><body><div id="test-root"></div></body></html>', { url: 'http://localhost:5173/', pretendToBeVisual: true });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Node: dom.window.Node, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
Object.defineProperty(globalThis, 'sessionStorage', { value: dom.window.sessionStorage, configurable: true });
globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
globalThis.getComputedStyle = window.getComputedStyle.bind(window);
let reduced = false;
const listeners = new Set();
window.matchMedia = () => ({ get matches() { return reduced; }, addEventListener: (_, callback) => listeners.add(callback), removeEventListener: (_, callback) => listeners.delete(callback) });
let imageComplete = true;
Object.defineProperty(window.HTMLImageElement.prototype, 'complete', { get: () => imageComplete, configurable: true });
let fontsReady = Promise.resolve();
Object.defineProperty(document, 'fonts', { get: () => ({ ready: fontsReady }), configurable: true });
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const root = createRoot(document.getElementById('test-root'));
let passed = 0;
let instance = 0;
const check = (name, fn) => { fn(); passed++; console.log(`PASS ${name}`); };
const wait = async milliseconds => { await act(async () => { await new Promise(resolve => window.setTimeout(resolve, milliseconds)); }); };
const press = async key => { await act(async () => document.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true }))); };
const clear = async () => { await act(async () => root.render(null)); };
const reset = async () => { await clear(); window.history.replaceState({}, '', '/'); sessionStorage.clear(); reduced = false; imageComplete = true; fontsReady = Promise.resolve(); document.body.style.overflow = ''; document.body.style.paddingRight = ''; };
try {
  const { default: Preloader } = await server.ssrLoadModule('/src/components/Preloader.jsx');
  const { shouldShowIntroduction, INTRO_STORAGE_KEY, INTRO_TIMING: timing } = await server.ssrLoadModule('/src/data/intro.js');
  const content = () => React.createElement('main', { id: 'main-content', tabIndex: -1 }, React.createElement('div', { className: 'stage-position-0' }, React.createElement('img', { src: '/projects/pallora.webp', alt: 'Pallora' })), React.createElement('a', { href: '#projects' }, 'View work'));
  const mount = async () => { await act(async () => root.render(React.createElement(StrictMode, null, React.createElement(Preloader, { key: ++instance }, content())))); };
  await reset(); await mount();
  check('premium intro renders a custom YS monogram and an honest loading status', () => {
    assert.ok(document.querySelector('[role="dialog"]'));
    assert.equal(document.querySelectorAll('.intro-letter').length, 2);
    assert.match(document.querySelector('.intro-identity').textContent, /Yeshaswi Singh/);
    assert.equal(document.querySelector('[role="status"]').textContent, 'Preparing the portfolio');
    assert.equal(document.querySelectorAll('[role="progressbar"]').length, 0);
  });
  check('intro locks background interactions and gives keyboard access to Skip', () => {
    assert.ok(document.querySelector('.portfolio-shell').hasAttribute('inert'));
    assert.equal(document.querySelector('.portfolio-shell').getAttribute('aria-busy'), 'true');
    assert.equal(document.body.style.overflow, 'hidden');
    assert.ok(document.activeElement === document.querySelector('.intro-skip'));
  });
  await press('Tab');
  check('keyboard focus stays inside the introductory dialog', () => assert.ok(document.activeElement === document.querySelector('.intro-skip')));
  check('homepage entrance animation is paused while the intro covers it', () => assert.equal(document.querySelector('.portfolio-shell').dataset.introEntering, 'true'));
  await wait(timing.minimum + 70);
  check('ready assets respect the requested hold before the shutter reveal', () => {
    assert.equal(document.querySelector('.portfolio-intro').dataset.phase, 'exiting');
    assert.equal(document.querySelector('[role="status"]').textContent, 'Ready to explore');
    assert.equal(document.querySelector('.portfolio-shell').dataset.introEntering, 'false');
  });
  await wait(timing.exit + 70);
  check('StrictMode completion removes the overlay, restores focus and scroll, and records the visit', () => {
    assert.equal(Boolean(document.querySelector('.portfolio-intro')), false);
    assert.equal(document.querySelector('.portfolio-shell').hasAttribute('inert'), false);
    assert.equal(document.querySelector('.portfolio-shell').hasAttribute('aria-busy'), false);
    assert.equal(document.body.style.overflow, '');
    assert.equal(document.activeElement?.id, 'main-content');
    assert.equal(sessionStorage.getItem(INTRO_STORAGE_KEY), 'seen');
    assert.equal(listeners.size, 0);
  });
  await clear(); await mount();
  check('subsequent visits in the same tab open the portfolio directly', () => assert.equal(Boolean(document.querySelector('.portfolio-intro')), false));
  window.history.replaceState({}, '', '/?intro=replay'); await clear(); await mount();
  check('the explicit replay link lets the introduction be reviewed again', () => assert.ok(document.querySelector('.portfolio-intro')));
  await press('Escape');
  assert.equal(document.querySelector('.portfolio-intro').dataset.phase, 'exiting');
  await wait(timing.exit + 70);
  check('Escape skips the loading wait and releases the page', () => assert.equal(Boolean(document.querySelector('.portfolio-intro')), false));
  await reset(); window.history.replaceState({}, '', '/#skills');
  check('deep links bypass the intro and preserve their destination', () => assert.equal(shouldShowIntroduction(), false));
  window.history.replaceState({}, '', '/downloads');
  check('existing product routes never display the homepage intro', () => assert.equal(shouldShowIntroduction(), false));
  window.history.replaceState({}, '', '/'); reduced = true; await mount();
  check('reduced-motion visitors enter immediately without a forced animation', () => assert.equal(Boolean(document.querySelector('.portfolio-intro')), false));
  await reset(); document.body.style.overflow = 'clip'; document.body.style.paddingRight = '12px'; await mount(); await clear();
  check('early unmount cleans up listeners, timers, and the original body styles', () => {
    assert.equal(document.body.style.overflow, 'clip'); assert.equal(document.body.style.paddingRight, '12px');
    assert.equal(listeners.size, 0); assert.equal(sessionStorage.getItem(INTRO_STORAGE_KEY), null);
  });
  await reset();
  const storageGet = window.Storage.prototype.getItem;
  const storageSet = window.Storage.prototype.setItem;
  window.Storage.prototype.getItem = () => { throw new Error('Storage unavailable'); };
  window.Storage.prototype.setItem = () => { throw new Error('Storage unavailable'); };
  try {
    await mount();
    await act(async () => document.querySelector('.intro-skip').click());
    await wait(timing.exit + 70);
    check('Skip still works when browser storage is blocked', () => assert.equal(Boolean(document.querySelector('.portfolio-intro')), false));
  } finally { window.Storage.prototype.getItem = storageGet; window.Storage.prototype.setItem = storageSet; }
  await reset(); imageComplete = false;
  let rejectFonts;
  fontsReady = new Promise((_, reject) => { rejectFonts = reject; });
  await mount();
  await act(async () => { rejectFonts(new Error('Font failed')); document.querySelector('.stage-position-0 img').dispatchEvent(new window.Event('error')); });
  await wait(timing.minimum + 60); await wait(timing.exit + 60);
  check('failed image and font requests release the page rather than strand the loader', () => assert.equal(Boolean(document.querySelector('.portfolio-intro')), false));
  await reset(); imageComplete = false; fontsReady = new Promise(() => {}); await mount();
  await wait(timing.minimum - 150);
  assert.equal(document.querySelector('.portfolio-intro').dataset.phase, 'loading');
  await wait(timing.deadline - timing.minimum + 250);
  assert.equal(document.querySelector('.portfolio-intro').dataset.phase, 'exiting');
  await wait(timing.exit + 60);
  check('the hard deadline releases the page even if assets never settle', () => assert.equal(Boolean(document.querySelector('.portfolio-intro')), false));
  await reset(); await mount();
  await act(async () => { reduced = true; [...listeners].forEach(callback => callback()); });
  check('changing to reduced motion during loading immediately dismisses the intro', () => { assert.equal(Boolean(document.querySelector('.portfolio-intro')), false); assert.equal(document.body.style.overflow, ''); });
  await reset(); await mount();
  await act(async () => window.dispatchEvent(new window.PageTransitionEvent('pageshow', { persisted: true })));
  check('back-forward cache restoration never leaves a locked page', () => assert.equal(Boolean(document.querySelector('.portfolio-intro')), false));
  const css = readFileSync('src/styles/preloader.css', 'utf8');
  check('intro styling includes mobile, landscape, motion, focus, and print handling', () => {
    for (const text of ['max-width:600px', 'max-height:520px', 'prefers-reduced-motion:reduce', ':focus-visible', '@media print', 'transform-style:preserve-3d']) assert.ok(css.includes(text), text);
    assert.ok(readFileSync('src/App.jsx', 'utf8').includes('<Preloader>'));
  });
  console.log(`RESULT: ${passed}/${passed} preloader checks passed`);
} finally {
  await act(async () => root.unmount());
  await server.close();
  dom.window.close();
}

