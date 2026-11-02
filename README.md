# Rec Badminton

Website of the REC Badminton club (Rennes), [recbadminton.fr](https://recbadminton.fr), built with React, Vite and Tailwind CSS, its content
stored in Firebase.

## Getting started

Copy `.env.example` to `.env` and fill in the Firebase web config (public by design, not a secret).

```bash
npm ci
npm run dev           # http://localhost:8080
npm run build         # production bundle in dist/
npm run test
npm run typecheck
npm run format-lint   # format and fix lint issues
npm run pdf:booklet   # rebuild the welcome booklet PDF
```

## Structure

| Path                      | Content                                                                                              |
|---------------------------|------------------------------------------------------------------------------------------------------|
| `src/components/pages`    | One component per route (home, schedule, registration, competition, shop, contact, data policy, 404) |
| `src/components/custom`   | Site chrome: header, footer, page layout, cookie banner                                              |
| `src/components/sections` | Page sections: week schedule, venues map, news feed, shop catalog, competition tabs                  |
| `src/components/ui`       | Shared UI primitives                                                                                 |
| `src/hooks`               | React hooks: site and admin content, auth, consent, news, page meta                                  |
| `src/components/pdf`      | PDF documents (schedule export, welcome booklet) built with react-pdf                                |
| `src/components/admin`    | Back office on `/admin`: layout, navigation, one section per editable area                           |
| `src/core/admin`          | Firebase SDK (Auth, Firestore, Storage): admin chunk only                                            |
| `src/core/content`        | Content model (`types.ts`), its empty shape, Firestore REST reader                                   |
| `src/core/api`            | Curator.io client for the news feed                                                                  |
| `backup/`                 | Content backup: `content.json`, its images and the welcome booklet (not bundled)                     |
| `src/core/i18n`           | French and English copy, French back office copy (`admin.ts`)                                        |
| `src/core/constants.ts`   | Site URL and routes                                                                                  |
| `functions/`              | Cloud Functions syncing ICBad into the `synced` collection, plus their manual refresh                  |
| `scripts/route-pages.js`  | Build step writing one HTML entry per page, with its own title, description and canonical URL        |
| `scripts/render-booklet.mjs` | Renders the welcome booklet PDF (`npm run pdf:booklet`)                                           |
| `public/`                 | Files served as-is (welcome booklet PDF, icons, social preview image, manifest, robots, sitemap)     |

## Updating content

Content is edited from the back office (`/admin`) and stored in Firestore, one `content/<id>` document per area:
`settings` (contact, season, booklet, links, QR codes, news feeds), `banner`, `schedule`, `venues`, `memberships`, `shop`,
`partners`, `photos`, `competition`, `pages` and `texts`. The `synced` collection holds what the Cloud Functions fetch
from other sites (`interclubs`). Visitors read both over the Firestore REST API in a single `batchGet`
(`src/core/content`), so the public bundle ships no Firebase SDK; the site renders once they are loaded.

- **No content in the code**: the site renders only what Firestore holds. A document never saved renders empty
  (`EMPTY_CONTENT`), and the site shows a retry screen when Firestore cannot be reached.
- **Backup**: `backup/content.json` holds every document, with `backup:<path>` refs to the files next to it. Restore it
  from *Sauvegarde* in the back office (a `.zip` export, or the `backup` folder zipped): files are uploaded to Storage and
  every document is written. The same section exports the live content and its files as a `.zip` of the same format,
  which needs the bucket CORS config: `gcloud storage buckets update gs://<bucket> --cors-file=storage.cors.json`.
- **History**: every save records the whole site as a revision (`revisions/{id}`, its snapshot under
  `snapshot/content`), like a commit of a Git-based CMS. *Sauvegarde* lists the last 50 and restores any of them; a
  restore is itself a revision, so it can be undone.
- **Storage files**: uploads are named after the SHA-256 of their source file, so a file is stored once and restoring
  twice uploads nothing new. A file stays while the content or a kept revision points at it, and is deleted once the
  last such revision is pruned. *Fichiers* lists every stored file and deletes those nothing references.
- **Synced data**: `functions/` syncs `synced/interclubs` from ICBad (standings, fixtures, next match of each team)
  every morning; *Synchronisation* shows the last update and error and refreshes on demand (`refreshSynced`, admins
  only). A failed sync keeps the previous data and records its error. Synced documents are never backed up nor
  versioned: the next sync rebuilds them. ICBad has no API, so it is scraped.
- **Shop**: a manual catalog under *Boutique*. HelloAsso blocks automated reads of its pages, so the products will be
  synced through the official HelloAsso API (`api.helloasso.com/v5`) once the club gets credentials; *Synchronisation*
  shows it as under construction until then.
- **Copy**: data documents hold their own copy as `{ fr, en }` (`Localized`). Every other text lives in
  `src/core/i18n/fr.ts` and `en.ts`; the `texts` document overrides it key by key. `npm run test` fails when a key is
  missing in either language.
- **Images**: an image field holds a Storage URL. Uploads are resized and converted to WebP, stored under
  `images/<id>/` (`files/<id>/` for PDFs).
- **Reads**: a visit fetches the content once, in one `batchGet` billed as one read per document (12), well within
  the free 50k reads a day; merging the documents into one would cut it to a single read if ever needed.
- **Welcome booklet**: edit `src/components/pdf/BookletPdf.tsx` (French copy lives in the file, keep `CONTENTS` page
  numbers in sync), run `npm run pdf:booklet` (written to `backup/files/`), then upload the PDF under *Infos générales*.
  It is rendered from `backup/content.json`, not from Firestore. `public/assets/data/livret/BIENVENUE-AU-REC-26-27.pdf`
  keeps the former site's link alive: replace it with each new booklet.
- **Schedule PDF**: generated in the browser from the schedule and venue content, nothing to update.

## Back office

`/admin` is a lazy-loaded chunk: visitors never download the Firebase SDK. Sign-in uses Firebase Auth with the Google provider.

- **Admins**: a document `admins/{uid}` grants access (any content, the id is what matters). Create it from the Firebase console after the person signed in once (their uid is listed under Authentication). Rules deny client writes to `admins`.
- **Security**: the `/admin` client-side gate is UX only, access control lives in `firestore.rules` and `storage.rules`. Deploy them with `npx firebase-tools deploy --only firestore,storage --project <project-id>`.
- **Sections**: add an entry to `ADMIN_SECTIONS` (`src/components/admin/sections.ts`) with its copy under `admin.sections.<path>.*` in `src/core/i18n/admin.ts` (French only); it gets its route, navigation entry and overview card.
- **Forms**: each content document is edited by `ContentEditor` from a field schema (`src/components/admin/content/schemas.ts`): text, localized, number, color, time, select, image, file, nested groups and reorderable lists (cards or table rows). Adding a field to a content type means adding it to its default, its schema and its copy; `schemas.test.ts` checks the three agree.
- **Saving**: the editor reads its document through the SDK (errors are shown, never replaced by defaults), uploads the picked files on save, writes the whole document, records a revision, then refreshes the public content.
- **Feedback**: query and mutation errors are toasted by `useDataToast` (`DataError` messages are translation keys), as is the `meta.successKey` of successful mutations.

## Third-party services

| Service             | Used for                                    | Configured in                                  |
|---------------------|---------------------------------------------|------------------------------------------------|
| Curator.io          | Instagram and Facebook news feed (home)     | *Infos générales* (`settings.curatorFeeds`)    |
| Formspree           | Contact form                                | *Infos générales* (`settings.links.contactForm`) |
| Google Calendar     | Season calendar embed (sessions page)       | *Infos générales* (`settings.links.calendar`)  |
| OpenStreetMap       | Venue map tiles (Leaflet)                   | `src/components/sections/venues/VenueMap.tsx`  |
| Google Maps         | Directions links, nothing embedded          | `src/core/venues.ts`                           |
| Google Fonts        | Barlow web fonts                            | `src/styles/index.css`                         |
| HelloAsso           | Shop links, nothing embedded                | *Boutique*                                     |

- **Consent**: the banner stores the visitor's choice in `localStorage` (`rec-consent`, 6 months) and clears the former
  site's `cc_cookie`. Embeds that set cookies (the calendar) sit in a `ConsentGate` and load only once accepted.
- **Data policy**: `/politique-de-donnees` lists every service above; update it with any service added or removed.

## PDF documents

Both PDFs are React components rendered with [`@react-pdf/renderer`](https://react-pdf.org), sharing the site palette and Barlow fonts (`src/components/pdf/theme.ts`).
The schedule is rendered on demand in the visitor's browser; the booklet is rendered by `scripts/render-booklet.mjs` through Vite SSR into `backup/files/`.

react-pdf pitfalls:

- A `lineHeight` on a `Page` (or inherited by a `render` text) hides page numbers: body line height lives on a `View` (`base.body`).
- Barlow caps sit 0.3em below the top of a `lineHeight: 1` box: use `Label` for any text inside a filled box.
- No WebP or SVG images; check a page never overflows (an overflow silently adds a page).

## Deployment

GitFlow: `feature/*` branches open pull requests into `develop`, releases merge `develop` into `main` (production),
`hotfix/*` branches start from `main`.

- `quality.yml` checks formatting, lint, types and tests, compiles the Cloud Functions with their strict tsconfig,
  then builds `dist/`, on every pull request and on `main`, `develop`, `release/*` and `hotfix/*`.
- `build.yml` is the reusable build shared by quality and deployments. It reads the Firebase config from the
  `VITE_FIREBASE_*` repository secrets and fails when one is missing (`vite.config.js`).
- `rules.yml` deploys `firestore.rules` and `storage.rules` when they change on `main`.
- `functions.yml` deploys the Cloud Functions when `functions/` changes on `main` (Node 24, Blaze plan, region
  `europe-west1`). Until CI can authenticate, deploy them by hand: `npx firebase-tools deploy --only functions`.
- `deploy-pages.yml` (GitHub Pages) and `deploy-hosting.yml` (Firebase Hosting) deploy `dist/`, manually until the host
  is chosen; the kept one becomes `deploy.yml`, triggered on `main`.

Firebase deployments read the `FIREBASE_SERVICE_ACCOUNT` secret, a service account key holding the roles of what it
deploys (*Firebase Rules Admin*, *Cloud Functions Admin*, *Cloud Scheduler Admin*, *Firebase Hosting Admin*, *Service
Account User*). Neither the secret nor Workload Identity Federation, its keyless alternative, is set up yet.

`dist/` holds one `index.html` per page (`creneaux/index.html`…), a `404.html` and a noindex `admin/index.html`, so any
static host serves it without rewrite rules. On Firebase Hosting, `firebase.json` adds legacy redirects, cache headers
and a rewrite of the `/admin/*` routes; elsewhere they fall back to `404.html`, which still renders the back office.
