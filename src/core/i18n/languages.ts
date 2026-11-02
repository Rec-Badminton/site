import type { Localized } from '@/core/content/types';

export type Language = 'fr' | 'en';

export const DEFAULT_LANGUAGE: Language = 'fr';

export const languages: Language[] = ['fr', 'en'];

export const LANGUAGE_LABELS: Record<Language, string> = {
  fr: 'Français',
  en: 'English'
};

export const LOCALES: Record<Language, string> = {
  fr: 'fr-FR',
  en: 'en-GB'
};

export function isLanguage(value: string): value is Language {
  return (languages as string[]).includes(value);
}

// First browser language we support, e.g. "en-US" -> "en".
export function detectLanguage(): Language {
  const preferred: readonly string[] = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const tag of preferred) {
    const base: string = tag.toLowerCase().split('-', 1)[0] ?? '';
    if (isLanguage(base)) return base;
  }
  return DEFAULT_LANGUAGE;
}

// Copy in the given language, falling back to French when that translation is missing.
export function localize(text: Localized | undefined, language: Language): string {
  return text?.[language] || text?.[DEFAULT_LANGUAGE] || '';
}
