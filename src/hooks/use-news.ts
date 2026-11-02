import { useQueries, type UseQueryResult } from '@tanstack/react-query';
import { useSiteContent } from '@/hooks/use-site-content';
import { fetchFeed, type NewsPost } from '@/core/api/curator';

const PER_FEED: number = 8;
const STALE_MS: number = 10 * 60 * 1000;

interface News {
  posts: NewsPost[];
  isLoading: boolean;
  isError: boolean;
}

// Latest posts of every network, newest first.
const useNews = (count: number): News => {
  const { curatorFeeds } = useSiteContent().settings;
  const feeds: string[] = [curatorFeeds.instagram, curatorFeeds.facebook].filter(Boolean);

  return useQueries({
    queries: feeds.map((feedId: string) => ({
      queryKey: ['news', feedId],
      queryFn: () => fetchFeed(feedId, PER_FEED),
      staleTime: STALE_MS
    })),
    combine: (results: UseQueryResult<NewsPost[]>[]): News => ({
      posts: results
        .flatMap((result: UseQueryResult<NewsPost[]>) => result.data ?? [])
        .sort((a: NewsPost, b: NewsPost) => b.date.getTime() - a.date.getTime())
        .slice(0, count),
      isLoading: results.some((result: UseQueryResult<NewsPost[]>) => result.isLoading),
      isError: results.every((result: UseQueryResult<NewsPost[]>) => result.isError)
    })
  });
};

export { useNews };
