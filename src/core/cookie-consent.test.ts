import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type ConsentModule = typeof import('@/core/cookie-consent');

const STORAGE_KEY: string = 'rec-consent';
const DAY_MS: number = 24 * 60 * 60 * 1000;

// the module reads storage once on load, so each test gets a fresh copy
async function loadConsent(): Promise<ConsentModule> {
  vi.resetModules();
  return import('@/core/cookie-consent');
}

function storeConsent(value: object): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

describe('cookie consent', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 25));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts undecided with only necessary cookies allowed', async () => {
    const consent: ConsentModule = await loadConsent();
    expect(consent.hasDecided()).toBe(false);
    expect(consent.hasConsent('necessary')).toBe(true);
    expect(consent.hasConsent('embeds')).toBe(false);
  });

  it('persists a saved choice across reloads', async () => {
    const first: ConsentModule = await loadConsent();
    first.saveConsent({ embeds: true });

    const reloaded: ConsentModule = await loadConsent();
    expect(reloaded.hasDecided()).toBe(true);
    expect(reloaded.hasConsent('embeds')).toBe(true);
  });

  it('asks again once the choice is older than about six months', async () => {
    storeConsent({ embeds: true, version: 1, savedAt: Date.now() - 183 * DAY_MS });
    const consent: ConsentModule = await loadConsent();
    expect(consent.hasDecided()).toBe(false);
  });

  it('keeps a choice younger than six months', async () => {
    storeConsent({ embeds: true, version: 1, savedAt: Date.now() - 181 * DAY_MS });
    const consent: ConsentModule = await loadConsent();
    expect(consent.hasConsent('embeds')).toBe(true);
  });

  it('ignores outdated versions and corrupted storage', async () => {
    storeConsent({ embeds: true, version: 0, savedAt: Date.now() });
    expect((await loadConsent()).hasDecided()).toBe(false);

    localStorage.setItem(STORAGE_KEY, '{not json');
    expect((await loadConsent()).hasDecided()).toBe(false);
  });

  it('grants one category on top of the previous choices', async () => {
    const consent: ConsentModule = await loadConsent();
    consent.grantConsent('embeds');
    expect(consent.consentChoices()).toEqual({ embeds: true });
  });

  it('notifies subscribers and closes the settings on save', async () => {
    const consent: ConsentModule = await loadConsent();
    const listener = vi.fn();
    const unsubscribe: () => void = consent.subscribeConsent(listener);

    consent.showCookieSettings();
    expect(consent.isCookieSettingsOpen()).toBe(true);
    consent.saveConsent({ embeds: false });
    expect(consent.isCookieSettingsOpen()).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);

    unsubscribe();
    consent.hideCookieSettings();
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('still records the choice when storage is unavailable', async () => {
    const consent: ConsentModule = await loadConsent();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => consent.saveConsent({ embeds: true })).not.toThrow();
    expect(consent.hasConsent('embeds')).toBe(true);
    vi.restoreAllMocks();
  });
});
