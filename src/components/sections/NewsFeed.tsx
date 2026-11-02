import type { ComponentType } from 'react';
import { useI18n } from '@mxreakit/i18n';
import ArrowLabel from '@/components/ui/ArrowLabel';
import { Heart, MessageCircle, Play } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from '@/components/ui/SocialIcons';
import OutboundLink from '@/components/ui/OutboundLink';
import { useNews } from '@/hooks/use-news';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import type { Network, NewsPost } from '@/core/api/curator';
import type { SettingsLinks } from '@/core/content/types';

const POST_COUNT: number = 6;

const DATE_OPTIONS: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

const NETWORKS: Record<
  Network,
  { Icon: ComponentType<{ className?: string }>; link: keyof SettingsLinks }
> = {
  Instagram: { Icon: InstagramIcon, link: 'instagram' },
  Facebook: { Icon: FacebookIcon, link: 'facebook' }
};

// Thumbnail row on phones, full card from sm.
const PostCard = ({ post }: { post: NewsPost }) => {
  const { t } = useI18n();
  const { locale } = useLanguage();
  const { Icon } = NETWORKS[post.network];
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noreferrer"
      className="group flex bg-white transition-shadow hover:shadow-[0_10px_30px_rgba(20,24,22,0.15)] sm:flex-col"
    >
      <div className="relative aspect-square w-28 shrink-0 overflow-hidden bg-line sm:w-full">
        {post.image && (
          <img
            src={post.image}
            alt=""
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span className="absolute top-0 left-0 flex items-center gap-2 bg-ink p-1.5 font-display text-base font-bold tracking-wide text-white uppercase sm:px-3">
          <Icon className="size-4" />
          <span className="sr-only sm:not-sr-only">{post.network}</span>
        </span>
        {post.isVideo && (
          <span className="absolute inset-0 m-auto flex size-10 items-center justify-center bg-brand text-white sm:size-16">
            <Play className="size-5 fill-current sm:size-7" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="flex min-w-0 grow flex-col gap-1 px-4 py-3 sm:gap-2 sm:p-5">
        <time
          dateTime={post.date.toISOString()}
          className="text-xs font-semibold text-muted uppercase sm:text-sm"
        >
          {post.date.toLocaleDateString(locale, DATE_OPTIONS)}
        </time>
        <h3 className="line-clamp-2 font-display text-lg leading-tight font-extrabold group-hover:text-brand sm:text-2xl">
          {post.title}
        </h3>
        {post.body && (
          <p className="line-clamp-3 text-[15px] text-muted max-sm:hidden">{post.body}</p>
        )}
        <div className="mt-auto flex items-center gap-4 pt-1 text-sm font-semibold text-muted sm:pt-3">
          <span className="flex items-center gap-1">
            <Heart className="size-4" aria-hidden="true" />
            {post.likes}
            <span className="sr-only">{t('news.likes')}</span>
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="size-4" aria-hidden="true" />
            {post.comments}
            <span className="sr-only">{t('news.comments')}</span>
          </span>
          <span className="ml-auto hidden font-display text-base font-bold text-brand uppercase sm:inline">
            <ArrowLabel>{t('news.see')}</ArrowLabel>
          </span>
        </div>
      </div>
    </a>
  );
};

const SkeletonCard = () => (
  <div className="flex animate-pulse bg-white sm:flex-col">
    <div className="aspect-square w-28 shrink-0 bg-line sm:w-full" />
    <div className="flex grow flex-col gap-3 p-4 sm:p-5">
      <div className="h-3 w-1/3 bg-line" />
      <div className="h-6 w-4/5 bg-line" />
      <div className="h-4 w-full bg-line" />
    </div>
  </div>
);

const NewsFeed = () => {
  const { t } = useI18n();
  const { links } = useSiteContent().settings;
  const { posts, isLoading, isError } = useNews(POST_COUNT);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h2 className="section-title">{t('news.title')}</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(NETWORKS) as Network[]).map((network: Network) => {
            const { Icon, link } = NETWORKS[network];
            return (
              <OutboundLink
                key={network}
                href={links[link]}
                className="btn btn-dark px-4 text-lg sm:px-5 sm:text-xl"
              >
                <Icon className="size-5" />
                {network}
              </OutboundLink>
            );
          })}
        </div>
      </div>

      {isError ? (
        <p className="bg-white p-8 text-lg text-muted">{t('news.error')}</p>
      ) : (
        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {isLoading && posts.length === 0
            ? Array.from({ length: POST_COUNT }, (_, index: number) => <SkeletonCard key={index} />)
            : posts.map((post: NewsPost) => <PostCard key={post.id} post={post} />)}
        </div>
      )}
    </>
  );
};

export default NewsFeed;
