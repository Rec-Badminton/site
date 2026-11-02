import { useEffect } from 'react';
import { useI18n } from '@mxreakit/i18n';
import { Constants } from '@/core/constants';

export interface PageMeta {
  // translation namespace, e.g. "home" for meta.home.title
  key: string;
  // route, e.g. Constants.ROUTE_SCHEDULE
  path: string;
}

const setMeta = (selector: string, content: string) => {
  document.querySelectorAll<HTMLMetaElement>(selector).forEach((meta: HTMLMetaElement) => {
    meta.content = content;
  });
};

const usePageMeta = ({ key, path }: PageMeta) => {
  const { t } = useI18n();

  useEffect(() => {
    const description: string = t(`meta.${key}.description`);
    const url: string = Constants.pageUrl(path);
    document.title = `${Constants.COMPANY_NAME} - ${t(`meta.${key}.title`)}`;
    setMeta('meta[name="description"], meta[property="og:description"]', description);
    setMeta('meta[name="keywords"]', t(`meta.${key}.keywords`));
    setMeta('meta[property="og:url"]', url);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url);
  }, [t, key, path]);
};

export { usePageMeta };
