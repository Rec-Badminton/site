import { useCallback } from 'react';
import { useI18n } from '@mxreakit/i18n';
import type { Localized } from '@/core/content/types';
import {
  DEFAULT_LANGUAGE,
  LOCALES,
  isLanguage,
  localize,
  type Language
} from '@/core/i18n/languages';

interface LanguageInfo {
  language: Language;
  locale: string;
  setLanguage: (language: Language) => void;
  // picks the current language out of back office copy
  localize: (text: Localized | undefined) => string;
}

// Typed view of the i18n language, with the matching Intl locale.
const useLanguage = (): LanguageInfo => {
  const { language, setLanguage } = useI18n();
  const current: Language = isLanguage(language) ? language : DEFAULT_LANGUAGE;
  const localizeCurrent = useCallback(
    (text: Localized | undefined): string => localize(text, current),
    [current]
  );
  return { language: current, locale: LOCALES[current], setLanguage, localize: localizeCurrent };
};

export { useLanguage };
