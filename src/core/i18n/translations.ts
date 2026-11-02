import type { I18nTranslations } from '@mxreakit/i18n';
import type { TextOverride } from '@/core/content/types';
import { fr } from '@/core/i18n/fr';
import { en } from '@/core/i18n/en';
import type { Language } from '@/core/i18n/languages';

export const translations: I18nTranslations = { fr, en };

// Back office copy over the dictionaries; an empty override keeps the default.
export function applyTextOverrides(
  base: I18nTranslations,
  overrides: TextOverride[]
): I18nTranslations {
  return Object.fromEntries(
    Object.entries(base).map(([language, dictionary]: [string, Record<string, string>]) => [
      language,
      {
        ...dictionary,
        ...Object.fromEntries(
          overrides
            .filter((override: TextOverride) => override[language as Language])
            .map((override: TextOverride) => [override.key, override[language as Language]])
        )
      }
    ])
  );
}
