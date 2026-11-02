// Renders the welcome booklet from its React source into backup/, to upload from the back office.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToFile } from '@react-pdf/renderer';
import { createServer } from 'vite';

const ROOT = path.resolve(import.meta.dirname, '..');
const BOOKLET_PATH = path.join(ROOT, 'backup/files/rec-badminton-welcome-booklet-26-27.pdf');
const MIME_TYPES = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', ttf: 'font/ttf' };

// inline assets as data URIs: react-pdf mistakes Windows paths for URLs
const inlineAssets = {
  name: 'pdf-inline-assets',
  enforce: 'pre',
  load(id) {
    const mime = MIME_TYPES[path.extname(id).slice(1)];
    if (!mime) return;
    const data = readFileSync(id).toString('base64');
    return `export default ${JSON.stringify(`data:${mime};base64,${data}`)};`;
  }
};

const server = await createServer({
  root: ROOT,
  plugins: [inlineAssets],
  appType: 'custom',
  logLevel: 'warn',
  server: { middlewareMode: true, hmr: false, ws: false }
});

try {
  // dependencies are externalized: react and react-pdf are shared with this script
  const { default: BookletPdf } = await server.ssrLoadModule('/src/components/pdf/BookletPdf.tsx');
  await renderToFile(createElement(BookletPdf), BOOKLET_PATH);
  console.log(`Booklet written to ${path.relative(ROOT, BOOKLET_PATH)}`);
} finally {
  await server.close();
}
