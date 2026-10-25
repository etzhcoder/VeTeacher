# VeTeacher

A responsive, installable learning app for veterans. Everyday technology and civilian career skills; no returning-to-school path.

## Run

Requires Node 22 or newer. No runtime dependencies or build step.

```sh
npm start
# http://127.0.0.1:4173
npm test
npm run check
```

The deployable application is in `dist/`. Source is plain JavaScript modules, semantic HTML, and CSS. Lesson content and validation helpers live in `dist/data.js`; views and browser interaction in `dist/app.js`.

## Included

- Six lessons, each with three explanations, alternate explanations/examples, untimed knowledge checks, and a checklist.
- Simulations for email attachments, video-call controls, suspicious messages, applications, résumé statements, and interview answers.
- Local progress, exact step restoration, notes, bookmarks, downloadable checklists, selective progress sharing, and help-request drafts.
- Optional setup; text sizes, contrast, focus view, concise explanations, reduced motion, opt-in completion sound, and read-aloud speed.
- Responsive desktop/tablet/phone layouts, web manifest, offline asset caching, and backup export/import to move between devices.

## Data and scope

No server-side learner account, cloud synchronization, analytics, paid API, or generative AI. State is saved under `veteacher-v1` in browser localStorage. Backups include preferences, notes and practice drafts; progress summaries exclude notes and drafts. No messages are sent automatically. Practice uses reserved example domains and fictional details intentionally. No camera/microphone capture.

This is an independent educational prototype, not a VA service or medical intervention. The résumé/interview builders arrange learner-provided words; they do not verify claims or assess employability. Review lesson content and conduct usability testing with veterans before describing accessibility or learning effectiveness as validated.

Installation and offline behavior depend on browser support. Read-aloud uses the browser/OS speech service and may need internet. Initial asset caching requires a successful online visit. Clearing browser storage removes progress. Backups provide manual transfer; there is no automatic synchronization.

## Design

UIArc inspired the restrained buttons, segmented controls, dialogs and switches; no paid components were copied. The user-requested `design-taste-frontend` skill is installed in the parent project's `.agents/skills/`.

Chosen direction: Editorial greeting, seed 1362663712. Instrument Sans, pale sage surfaces, a custom open-book V mark, and a read → practice → take-away sequence. The font is bundled with its SIL OFL license. All icons/mark are local SVG; no external photography.

## Deployment

`.openai/hosting.json` identifies the private Sites project. Static directory: `dist`. Preserve its identity on updates. Bump the service-worker cache name when changing cached assets.
