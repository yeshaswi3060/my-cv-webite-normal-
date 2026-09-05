export const INTRO_STORAGE_KEY = 'yeshaswi:portfolio-intro:v1';
// Three seconds in total: hold the signature for 2.3s, then reveal for 0.7s.
export const INTRO_TIMING = { minimum: 2300, deadline: 2300, exit: 700 };

export function shouldShowIntroduction() {
  if (typeof window === 'undefined') return false;
  if (window.location.pathname !== '/' || window.location.hash) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (new URLSearchParams(window.location.search).get('intro') === 'replay') return true;
  try { return window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== 'seen'; }
  catch { return true; }
}
