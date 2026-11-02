import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

vi.stubEnv('VITE_FIREBASE_API_KEY', 'test');
vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'test.firebaseapp.com');
vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'test');
vi.stubEnv('VITE_FIREBASE_STORAGE_BUCKET', 'test.firebasestorage.app');
vi.stubEnv('VITE_FIREBASE_APP_ID', 'test');

afterEach(() => {
  cleanup();
});

Object.defineProperty(globalThis, 'scrollTo', { writable: true, value: vi.fn() });

Object.defineProperty(globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});
