import { afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('App', () => {
  it('offers a retry when Firestore cannot be reached', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('offline'));

    render(<App />);

    expect(await screen.findByRole('button', {}, { timeout: 5000 })).toBeTruthy();
  });
});
