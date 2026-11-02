import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_LANGUAGE, detectLanguage, isLanguage } from '@/core/i18n/languages';

function setBrowserLanguages(preferred: string[], fallback: string = 'xx'): void {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(preferred);
  vi.spyOn(navigator, 'language', 'get').mockReturnValue(fallback);
}

describe('isLanguage', () => {
  it('accepts supported languages only', () => {
    expect(isLanguage('fr')).toBe(true);
    expect(isLanguage('en')).toBe(true);
    expect(isLanguage('de')).toBe(false);
    expect(isLanguage('en-GB')).toBe(false);
  });
});

describe('detectLanguage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('takes the first supported browser language, ignoring the region', () => {
    setBrowserLanguages(['de-DE', 'EN-us', 'fr']);
    expect(detectLanguage()).toBe('en');
  });

  it('falls back to navigator.language when the list is empty', () => {
    setBrowserLanguages([], 'en-US');
    expect(detectLanguage()).toBe('en');
  });

  it('defaults when nothing is supported', () => {
    setBrowserLanguages(['de', 'es']);
    expect(detectLanguage()).toBe(DEFAULT_LANGUAGE);
  });
});
