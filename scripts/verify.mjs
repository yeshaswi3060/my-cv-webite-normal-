import assert from 'node:assert/strict';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { createServer } from 'vite';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';

// Component-level DOM tests, not browser or visual-layout tests.
const dom = new JSDOM('<!doctype html><html><body><div id="test-root"></div></body></html>', { url: 'http://localhost:5173/', pretendToBeVisual: true });
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Node: dom.window.Node, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true });
globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
window.scrollTo = () => {};
let reducedMotion = false;
const motionListeners = new Set();
window.matchMedia = () => ({ get matches() { return reducedMotion; }, addEventListener: (_, listener) => motionListeners.add(listener), removeEventListener: (_, listener) => motionListeners.delete(listener) });
class Observer {
  constructor(callback) { this.callback = callback; this.disconnected = false; }
  observe(target) { queueMicrotask(() => { if (!this.disconnected) this.callback([{ target, isIntersecting: true }]); }); }
  unobserve() {}
  disconnect() { this.disconnected = true; }
}
globalThis.IntersectionObserver = window.IntersectionObserver = Observer;
let copied = '';
Object.defineProperty(navigator, 'clipboard', { value: { writeText: async text => { copied = text; } }, configurable: true });
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const root = createRoot(document.getElementById('test-root'));
let passed = 0;
const check = (name, callback) => { callback(); passed++; console.log(`PASS ${name}`); };
const click = async element => { assert.ok(element, 'Control must exist'); await act(async () => { element.dispatchEvent(new window.MouseEvent('click', { bubbles: true })); }); };
const key = async (element, value) => { await act(async () => { element.dispatchEvent(new window.KeyboardEvent('keydown', { key: value, bubbles: true })); }); };
function pointer(type, x, y, pointerType = 'mouse') {
  const event = new window.MouseEvent(type, { bubbles: true, clientX: x, clientY: y });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  return event;
}
try {
  const { default: Home } = await server.ssrLoadModule('/src/pages/Home.jsx');
  const { default: Navbar } = await server.ssrLoadModule('/src/components/Navbar.jsx');
  const { default: Footer } = await server.ssrLoadModule('/src/components/Footer.jsx');
  await act(async () => root.render(React.createElement(MemoryRouter, null, React.createElement(Navbar), React.createElement(Home), React.createElement(Footer))));
  check('all seven CV sections and one named h1 render', () => {
    assert.equal(document.querySelectorAll('h1').length, 1);
    assert.match(document.querySelector('h1').textContent, /YESHASWI SINGH/);
    for (const id of ['home', 'about', 'projects', 'skills', 'experience', 'certifications', 'contact']) assert.ok(document.getElementById(id), id);
  });
  check('unique IDs and working internal navigation targets', () => {
    const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const link of document.querySelectorAll('a[href^="#"]')) assert.ok(document.querySelector(link.getAttribute('href')), link.outerHTML);
  });
  check('all local images and six certificate links exist', () => {
    for (const image of document.querySelectorAll('img[src^="/"]')) assert.ok(existsSync(resolve('public', image.getAttribute('src').slice(1))));
    assert.equal(document.querySelectorAll('.credential').length, 6);
    for (const link of document.querySelectorAll('.credential')) assert.ok(existsSync(resolve('public', decodeURIComponent(link.getAttribute('href').slice(1)))));
  });
  check('project links point to reviewed GitHub repositories', () => {
    const expected = ['UPSC', 'Sphere', 'clothing-web-vatsalya', 'web-data-scraper', 'Advanced-wifi-scaner', 'Search-Engine'];
    const hrefs = [...document.querySelectorAll('a')].map(a => a.href);
    for (const name of expected) assert.ok(hrefs.includes(`https://github.com/yeshaswi3060/${name}`));
  });
  const stage = document.querySelector('.project-stage');
  const title = () => document.querySelector('.stage-project-name strong').textContent;
  const next = document.querySelector('[aria-label="Next featured project"]');
  const previous = document.querySelector('[aria-label="Previous featured project"]');
  assert.equal(title(), 'Learnova');
  await click(next); assert.equal(title(), 'Vatsalya Boutique');
  await click(previous); assert.equal(title(), 'Learnova');
  await click(previous); assert.equal(title(), 'Sphere');
  await click(next); assert.equal(title(), 'Learnova');
  check('3D project carousel next, previous, and wraparound work', () => assert.equal(document.querySelectorAll('.stage-screen:not([inert])').length, 1));
  await key(next, 'ArrowRight'); assert.equal(title(), 'Vatsalya Boutique');
  await key(next, 'ArrowLeft');
  check('keyboard project switching works', () => assert.equal(title(), 'Learnova'));
  stage.getBoundingClientRect = () => ({ left: 0, top: 0, width: 600, height: 300, bottom: 300, right: 600 });
  await act(async () => { stage.dispatchEvent(pointer('pointermove', 480, 60)); await new Promise(done => setTimeout(done, 35)); });
  check('pointer movement changes the 3D perspective', () => assert.notEqual(stage.style.getPropertyValue('--stage-y'), '0deg'));
  await act(async () => { stage.dispatchEvent(pointer('pointerdown', 250, 100, 'touch')); stage.dispatchEvent(pointer('pointerup', 120, 100, 'touch')); });
  check('touch swipe switches the featured project', () => assert.equal(title(), 'Vatsalya Boutique'));
  await act(async () => { reducedMotion = true; motionListeners.forEach(listener => listener()); });
  check('reduced motion removes pointer and scroll rotation', () => { assert.equal(stage.style.getPropertyValue('--stage-y'), '0deg'); assert.equal(stage.style.getPropertyValue('--scroll-depth'), '0deg'); });
  const menu = document.querySelector('.menu-toggle');
  await click(menu);
  check('mobile menu opens and locks background scroll', () => { assert.equal(menu.getAttribute('aria-expanded'), 'true'); assert.equal(document.body.style.overflow, 'hidden'); });
  await key(document, 'Escape');
  check('Escape closes navigation and restores trigger focus', () => { assert.equal(menu.getAttribute('aria-expanded'), 'false'); assert.equal(document.body.style.overflow, ''); assert.equal(document.activeElement, menu); });
  await click(document.querySelector('.copy-email'));
  check('copy email writes the exact address and confirms success', () => { assert.equal(copied, 'yeshaswi3@gmail.com'); assert.equal(document.querySelector('.copy-status').textContent, 'Email copied'); });
  navigator.clipboard.writeText = async () => { throw new Error('Clipboard unavailable'); };
  await click(document.querySelector('.copy-email'));
  check('clipboard failure gives actionable feedback without false success', () => assert.match(document.querySelector('.copy-status').textContent, /Select the email address/));
  check('all nine supplied qualification entries are preserved', () => { assert.equal(document.querySelectorAll('.additional-credentials>div').length, 3); assert.equal(document.querySelectorAll('.credential').length, 6); });
  const css = readFileSync('src/styles/portfolio.css', 'utf8');
  check('responsive, print, focus, and reduced-motion styles are present', () => {
    for (const text of ['max-width:760px', 'max-width:380px', 'prefers-reduced-motion:reduce', '@media print', ':focus-visible', 'transform-style:preserve-3d']) assert.ok(css.includes(text), text);
  });
  check('rejected chrome object is absent from the shipped app', () => { assert.ok(!existsSync('src/components/OrbitScene.jsx')); assert.ok(!readFileSync('package.json', 'utf8').includes('"three"')); });
  if (process.argv[2]) writeFileSync(resolve(process.argv[2]), '<!doctype html>\n' + document.documentElement.outerHTML);
  console.log(`RESULT: ${passed}/${passed} checks passed`);
} finally {
  await act(async () => root.unmount());
  await server.close();
  dom.window.close();
}
