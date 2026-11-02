export type ConsentCategory = 'necessary' | 'embeds';

export type OptionalCategory = Exclude<ConsentCategory, 'necessary'>;

export type ConsentChoices = Record<OptionalCategory, boolean>;

interface StoredConsent extends ConsentChoices {
  version: number;
  savedAt: number;
}

const STORAGE_KEY: string = 'rec-consent';
// bump to ask everyone again after the categories change
const VERSION: number = 1;
// the CNIL recommends asking again after about 6 months
const VALIDITY_MS: number = 182 * 24 * 60 * 60 * 1000;
const LEGACY_COOKIE: string = 'cc_cookie';
const NO_CHOICES: ConsentChoices = { embeds: false };

const events: EventTarget = new EventTarget();
const notify = () => events.dispatchEvent(new Event('change'));

function readStored(): StoredConsent | null {
  try {
    const stored: StoredConsent | null = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (!stored || stored.version !== VERSION) return null;
    return Date.now() - stored.savedAt > VALIDITY_MS ? null : stored;
  } catch {
    return null;
  }
}

// cookie left by the previous consent library, set with and without a domain
function clearLegacyCookie(): void {
  const expired: string = `${LEGACY_COOKIE}=; Max-Age=0; path=/`;
  document.cookie = expired;
  document.cookie = `${expired}; domain=${location.hostname}`;
}

let stored: StoredConsent | null = readStored();
let settingsOpen: boolean = false;
clearLegacyCookie();

export function saveConsent(choices: ConsentChoices): void {
  stored = { ...choices, version: VERSION, savedAt: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // private mode: the choice still holds for this visit
  }
  settingsOpen = false;
  notify();
}

export function hasDecided(): boolean {
  return stored !== null;
}

export function consentChoices(): ConsentChoices {
  return stored ? { embeds: stored.embeds } : NO_CHOICES;
}

export function hasConsent(category: ConsentCategory): boolean {
  return category === 'necessary' || consentChoices()[category];
}

// Accept one more category while keeping the visitor's previous choices.
export function grantConsent(category: ConsentCategory): void {
  if (category === 'necessary') return;
  saveConsent({ ...consentChoices(), [category]: true });
}

export function isCookieSettingsOpen(): boolean {
  return settingsOpen;
}

export function showCookieSettings(): void {
  settingsOpen = true;
  notify();
}

export function hideCookieSettings(): void {
  settingsOpen = false;
  notify();
}

export function subscribeConsent(listener: () => void): () => void {
  events.addEventListener('change', listener);
  return () => events.removeEventListener('change', listener);
}
