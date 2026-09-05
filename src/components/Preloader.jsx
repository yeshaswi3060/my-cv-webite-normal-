import { useEffect, useRef, useState } from 'react';
import { INTRO_STORAGE_KEY, INTRO_TIMING, shouldShowIntroduction } from '../data/intro';
import '../styles/preloader.css';

export default function Preloader({ children }) {
  const [initiallyVisible] = useState(shouldShowIntroduction);
  const [phase, setPhase] = useState(initiallyVisible ? 'loading' : 'done');
  const overlayRef = useRef(null);
  const skipRef = useRef(null);
  const exitRef = useRef(null);
  const focusAfterRevealRef = useRef(null);

  useEffect(() => {
    if (phase !== 'done' || !focusAfterRevealRef.current) return;
    const { target } = focusAfterRevealRef.current;
    focusAfterRevealRef.current = null;
    (target?.isConnected ? target : document.getElementById('main-content'))?.focus({ preventScroll: true });
  }, [phase]);

  useEffect(() => {
    if (!initiallyVisible) return;
    const started = Date.now();
    const body = document.body;
    const previous = { overflow: body.style.overflow, padding: body.style.paddingRight, focus: document.activeElement };
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timers = new Set();
    const removers = [];
    let disposed = false;
    let exiting = false;
    let finished = false;
    const schedule = (callback, delay) => {
      const timer = window.setTimeout(() => { timers.delete(timer); callback(); }, delay);
      timers.add(timer);
      return timer;
    };
    const clearPending = () => {
      timers.forEach(timer => window.clearTimeout(timer));
      timers.clear();
      removers.splice(0).forEach(remove => remove());
    };
    const restorePage = () => { body.style.overflow = previous.overflow; body.style.paddingRight = previous.padding; };
    const complete = () => {
      if (disposed || finished) return;
      finished = true;
      const restoreFocus = overlayRef.current?.contains(document.activeElement);
      clearPending();
      restorePage();
      try { window.sessionStorage.setItem(INTRO_STORAGE_KEY, 'seen'); } catch { /* Storage is optional. */ }
      if (restoreFocus) focusAfterRevealRef.current = {
        target: previous.focus !== body && !overlayRef.current?.contains(previous.focus) ? previous.focus : null,
      };
      setPhase('done');
    };
    const reveal = (immediate = false) => {
      if (disposed || finished) return;
      if (immediate) { complete(); return; }
      if (exiting) return;
      exiting = true;
      setPhase('exiting');
      schedule(complete, INTRO_TIMING.exit);
    };
    exitRef.current = () => reveal(motion.matches);

    // Reserve the scrollbar space instead of shifting the page during the reveal.
    const viewport = document.documentElement.clientWidth;
    const gutter = viewport > 0 ? Math.max(0, window.innerWidth - viewport) : 0;
    if (gutter) body.style.paddingRight = `${parseFloat(getComputedStyle(body).paddingRight) + gutter}px`;
    body.style.overflow = 'hidden';
    skipRef.current?.focus({ preventScroll: true });
    const keydown = event => {
      if (event.key === 'Escape') { event.preventDefault(); reveal(motion.matches); }
      if (event.key === 'Tab') { event.preventDefault(); skipRef.current?.focus(); }
    };
    const motionChanged = () => { if (motion.matches) complete(); };
    const pageRestored = event => { if (event.persisted) complete(); };
    document.addEventListener('keydown', keydown);
    motion.addEventListener('change', motionChanged);
    window.addEventListener('pageshow', pageRestored);
    removers.push(() => document.removeEventListener('keydown', keydown), () => motion.removeEventListener('change', motionChanged), () => window.removeEventListener('pageshow', pageRestored));

    // Wait only for typography and the frontmost project image, not every image.
    // The deadline also releases the page if a network request never settles.
    const heroImage = document.querySelector('[data-intro-content] .stage-position-0 img');
    const imageReady = !heroImage || heroImage.complete ? Promise.resolve() : new Promise(resolve => {
      const settled = () => resolve();
      heroImage.addEventListener('load', settled, { once: true });
      heroImage.addEventListener('error', settled, { once: true });
      removers.push(() => heroImage.removeEventListener('load', settled), () => heroImage.removeEventListener('error', settled));
    });
    Promise.allSettled([document.fonts?.ready ?? Promise.resolve(), imageReady]).then(() => {
      if (!disposed && !exiting && !finished) schedule(() => reveal(), Math.max(0, INTRO_TIMING.minimum - (Date.now() - started)));
    });
    schedule(() => reveal(), INTRO_TIMING.deadline);
    return () => {
      disposed = true;
      exitRef.current = null;
      clearPending();
      restorePage();
    };
  }, [initiallyVisible]);

  return <>
    <div className="portfolio-shell" data-intro-content data-intro-entering={phase === 'loading'} inert={phase !== 'done'} aria-busy={phase !== 'done' || undefined}>
      {children}
    </div>
    {phase !== 'done' && <div ref={overlayRef} className="portfolio-intro" data-phase={phase} role="dialog" aria-modal="true" aria-label="Opening Yeshaswi Singh’s portfolio">
      <div className="intro-curtain intro-curtain-top" aria-hidden="true" />
      <div className="intro-curtain intro-curtain-bottom" aria-hidden="true" />
      <div className="intro-topline">
        <span className="intro-edition">YS<span className="intro-divider" />PERSONAL PORTFOLIO</span>
        <button ref={skipRef} className="intro-skip" onClick={() => exitRef.current?.()}>Skip intro <span aria-hidden="true">↗</span></button>
      </div>
      <div className="intro-center">
        <div className="intro-emblem" aria-hidden="true">
          <div className="intro-blueprint"><i /><i /><i /><i /></div>
          <div className="intro-chip">
            <div className="intro-chip-edge" />
            <div className="intro-chip-face">
              <svg className="intro-monogram" viewBox="0 0 180 180" fill="none">
                <path className="intro-etch" d="M18 42V18H42M138 18H162V42M162 138V162H138M42 162H18V138" />
                <path className="intro-etch intro-etch-trace" d="M0 90H24M156 90H180M90 0V24M90 156V180" />
                <path className="intro-letter intro-letter-y" pathLength="1" d="M42 51L70 89L98 51M70 89V130" />
                <path className="intro-letter intro-letter-s" pathLength="1" d="M140 57C130 47 107 49 104 64C101 78 114 84 125 87C151 95 146 120 130 127C116 134 101 128 97 122" />
                <rect className="intro-signal" x="139" y="139" width="4" height="4" />
              </svg>
              <span className="intro-chip-sheen" />
            </div>
          </div>
        </div>
        <div className="intro-identity"><p>Yeshaswi Singh<span>.</span></p><span>DEVELOPER & SECURITY RESEARCHER</span></div>
      </div>
      <div className="intro-bottomline">
        <div className="intro-loading-state"><span className="intro-status" role="status" aria-live="polite">{phase === 'exiting' ? 'Ready to explore' : 'Preparing the portfolio'}</span><span className="intro-track" aria-hidden="true"><i /></span></div>
        <span className="intro-location">DELHI, INDIA<span>DESIGNED WITH INTENT.</span></span>
      </div>
    </div>}
  </>;
}
