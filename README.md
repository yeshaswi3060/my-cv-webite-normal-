# Yeshaswi Singh — Portfolio

A responsive, work-first portfolio built with React 19 and Vite.

## Development

```sh
npm ci
npm run dev
npm run build
npm test
```

## Design and interaction

- A three-plane project stage with pointer-driven perspective, touch swipe, keyboard controls, and depth transitions.
- Tilt-responsive project previews and layered expertise panels; scroll-reveal transitions throughout the CV.
- A monochrome editorial system with blue details and a contrasting work section.
- All original CV sections, nine qualification entries, six linked certificate images, and contact details.
- Responsive navigation with Escape handling, a focus loop, reduced-motion support, visible keyboard focus, and print styles.
- Real project and repository links reviewed from the public `yeshaswi3060` GitHub profile. Project visuals are illustrative interface compositions, not captured screenshots. The four featured websites were supplied directly by Yeshaswi: Pallora, Vastu Shikhar, Malyam, and AllCloths. Existing campaign/brand images from the first three sites are used in the previews; AllCloths uses a typographic cover. Its homepage returned HTTP 429 during review, so its description does not claim unverified features.

## Verification

### Signature introduction

The homepage now opens with a graphite, dimensional YS monogram, an animated line signature, and a split-curtain reveal. The requested five-second entrance holds for 4.3 seconds and reveals over 0.7 seconds. Skip or Escape releases it earlier. It plays once per browser-tab session; `/?intro=replay` replays it for review. Direct section links, other routes, and reduced-motion preferences bypass it. Failed or stalled assets never extend the five-second limit.

The preloader lifecycle suite also checks keyboard focus, scroll restoration, StrictMode, storage failures, asset errors, and back-forward cache restoration.

`npm test` runs component-level DOM tests with jsdom. It covers carousel behavior, pointer and swipe input, keyboard navigation, reduced motion, menu behavior, links and local assets, and both clipboard outcomes. These are not browser-layout or visual-regression tests.

Portfolio lint: `npx eslint src/App.jsx src/components src/pages/Home.jsx`.

The `/downloads`, `/ai-detection`, and `/monitoring` routes are preserved and lazy-loaded. Their pre-existing API and service requirements remain unchanged. The original AI detector expects an NVIDIA proxy/API configuration; the monitoring page uses its existing Supabase configuration. They are not part of the portfolio component test suite. Existing lint findings in those legacy pages are recorded separately.

## Rollback and source evidence

Local baseline snapshots, before/after logs, hashes, source diff, source archive, and a tested rollback script are in `artifacts/redesign/`. These are excluded from Git and are never part of the public build.

## Hosting

The project retains its Vercel configuration. `.openai/hosting.json` identifies a separate private Sites preview; creating that preview does not replace the existing Vercel website.

