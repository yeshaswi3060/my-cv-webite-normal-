export const INTRO_STORAGE_KEY = 'yeshaswi:portfolio-intro:v1';
// Five seconds in total: hold the signature for 4.3s, then reveal for 0.7s.
export const INTRO_TIMING = { minimum: 4300, deadline: 4300, exit: 700 };

export function shouldShowIntroduction() {
  if (typeof window === 'undefined') return false;
  if (window.location.pathname !== '/' || window.location.hash) return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (new URLSearchParams(window.location.search).get('intro') === 'replay') return true;
  try { return window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== 'seen'; }
  catch { return true; }
}
