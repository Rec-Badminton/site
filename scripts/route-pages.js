// Vite plugin: writes one HTML entry per public page, each with its own title, description
// and canonical URL. Link previews and crawlers that skip JavaScript then see the right page,
// and any static host serves /creneaux/ without a rewrite rule.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Constants } from '../src/core/constants.ts';
import { fr } from '../src/core/i18n/fr.ts';
import { admin } from '../src/core/i18n/admin.ts';

// route of each page, keyed by its meta.<key>.* copy
const PAGES = {
  home: Constants.ROUTE_HOME,
  sessions: Constants.ROUTE_SCHEDULE,
  registration: Constants.ROUTE_REGISTRATION,
  competition: Constants.ROUTE_COMPETITION,
  shop: Constants.ROUTE_SHOP,
  contact: Constants.ROUTE_CONTACT,
  policy: Constants.ROUTE_DATA_POLICY
};

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const setContent = (html, selector, value) =>
  html.replace(new RegExp(`(<meta ${selector} content=")[^"]*(")`), `$1${escapeHtml(value)}$2`);

function pageHtml(html, key, url) {
  let page = html
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${escapeHtml(`${Constants.COMPANY_NAME} - ${fr[`meta.${key}.title`]}`)}</title>`
    )
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  page = setContent(page, 'name="description"', fr[`meta.${key}.description`]);
  page = setContent(page, 'property="og:description"', fr[`meta.${key}.description`]);
  page = setContent(page, 'name="keywords"', fr[`meta.${key}.keywords`]);
  return setContent(page, 'property="og:url"', url);
}

const noIndex = (html) =>
  html
    .replace(/\s*<link rel="canonical"[^>]*>/, '')
    .replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>');

export default function routePages() {
  let outDir = 'dist';
  return {
    name: 'route-pages',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const html = await readFile(path.join(outDir, 'index.html'), 'utf8');
      await Promise.all(
        Object.entries(PAGES).map(async ([key, route]) => {
          const file = path.join(outDir, route, 'index.html');
          await mkdir(path.dirname(file), { recursive: true });
          await writeFile(file, pageHtml(html, key, Constants.pageUrl(route)));
        })
      );
      // served by static hosts for unknown paths: the app renders its 404 page
      const notFound = noIndex(pageHtml(html, 'notFound', Constants.pageUrl(Constants.ROUTE_HOME)));
      await writeFile(path.join(outDir, '404.html'), notFound);

      // /admin answers 200; its sub-routes need a host rewrite (firebase.json) or fall back to 404.html
      const adminPage = noIndex(
        html.replace(
          /<title>[^<]*<\/title>/,
          `<title>${escapeHtml(`${Constants.COMPANY_NAME} - ${admin['admin.title']}`)}</title>`
        )
      );
      await mkdir(path.join(outDir, Constants.ROUTE_ADMIN), { recursive: true });
      await writeFile(path.join(outDir, Constants.ROUTE_ADMIN, 'index.html'), adminPage);
    }
  };
}
