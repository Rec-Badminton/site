import { useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/core/i18n/languages';

// Keeps the document language in sync with the selected language.
const LanguageSync = () => {
  const { language } = useLanguage();

  useEffect(() => {
    const current: Language = language;
    document.documentElement.lang = current;
  }, [language]);

  return null;
};

export default LanguageSync;
