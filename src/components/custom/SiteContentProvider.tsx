import { useMemo, type ReactNode } from 'react';
import { I18nProvider, useI18n, type I18nTranslations } from '@mxreakit/i18n';
import { SiteContentContext, useSiteContentQuery } from '@/hooks/use-site-content';
import type { TextOverride } from '@/core/content/types';
import { detectLanguage } from '@/core/i18n/languages';
import { applyTextOverrides, translations } from '@/core/i18n/translations';
import logo from '@/assets/images/logo-rec.png';

const NO_OVERRIDES: TextOverride[] = [];

const SiteI18nProvider = ({
  overrides,
  children
}: {
  overrides: TextOverride[];
  children: ReactNode;
}) => {
  const merged: I18nTranslations = useMemo(
    () => applyTextOverrides(translations, overrides),
    [overrides]
  );

  return (
    <I18nProvider translations={merged} defaultLanguage={detectLanguage()}>
      {children}
    </I18nProvider>
  );
};

const ContentUnavailable = ({ onRetry }: { onRetry: () => void }) => {
  const { t } = useI18n();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-sand px-6 text-center">
      <img src={logo} alt="" className="size-28 rounded-full" />
      <h1 className="section-title">{t('unavailable.title')}</h1>
      <p className="max-w-md text-lg text-muted">{t('unavailable.text')}</p>
      <button type="button" onClick={onRetry} className="btn btn-primary">
        {t('unavailable.retry')}
      </button>
    </main>
  );
};

// All content comes from Firestore: pages render once it is loaded, never with stale copy.
const SiteContentProvider = ({ children }: { children: ReactNode }) => {
  const { data, isError, refetch } = useSiteContentQuery();

  if (isError) {
    return (
      <SiteI18nProvider overrides={NO_OVERRIDES}>
        <ContentUnavailable onRetry={() => refetch()} />
      </SiteI18nProvider>
    );
  }
  if (!data) return null;

  return (
    <SiteContentContext.Provider value={data}>
      <SiteI18nProvider overrides={data.texts.overrides}>{children}</SiteI18nProvider>
    </SiteContentContext.Provider>
  );
};

export default SiteContentProvider;
