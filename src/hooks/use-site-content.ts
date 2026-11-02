import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSiteContent } from '@/core/content/services';
import type { SiteData } from '@/core/content/types';

export const SITE_CONTENT_KEY: readonly string[] = ['siteContent'];

export const SiteContentContext = createContext<SiteData | null>(null);

// Fetched once per visit and retried once (the error screen offers more); saves invalidate it.
const useSiteContentQuery = () =>
  useQuery({
    queryKey: SITE_CONTENT_KEY,
    queryFn: fetchSiteContent,
    staleTime: Infinity,
    retry: 1
  });

const useSiteContent = (): SiteData => {
  const content: SiteData | null = useContext(SiteContentContext);
  if (!content) throw new Error('useSiteContent must be used within a SiteContentProvider');
  return content;
};

export { useSiteContentQuery, useSiteContent };
