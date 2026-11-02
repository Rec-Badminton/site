import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';
import routePages from './scripts/route-pages.js';

const ASSET_DIRS = {
  css: 'css',
  ttf: 'fonts',
  woff: 'fonts',
  woff2: 'fonts',
  png: 'images',
  jpg: 'images',
  jpeg: 'images',
  webp: 'images',
  svg: 'images',
};

const REQUIRED_ENV = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_APP_ID',
];

export default defineConfig(({ command, mode }) => {
  // a build without Firebase config would deploy a site that cannot load its content
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), 'VITE_');
    const missing = REQUIRED_ENV.filter((name) => !env[name]);
    if (missing.length) throw new Error(`Missing env variables: ${missing.join(', ')}`);
  }

  return {
    server: {
      host: true,
      port: 8080,
    },
    plugins: [react(), tailwindcss(), routePages()],
    build: {
      rolldownOptions: {
        output: {
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: ({ names }) => {
            const extension = path.extname(names[0] ?? '').slice(1).toLowerCase();
            return `assets/${ASSET_DIRS[extension] ?? 'misc'}/[name]-[hash][extname]`;
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: './src/tests/setup.ts',
    },

  };
});
