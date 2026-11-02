import { Link } from 'react-router-dom';
import { useI18n } from '@mxreakit/i18n';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import { Constants } from '@/core/constants';
import type { Photo } from '@/core/content/types';

const PhotoRow = ({ hidden }: { hidden?: boolean }) => {
  const { localize } = useLanguage();
  const { photos } = useSiteContent();
  return (
    <div className="flex shrink-0 gap-1 pr-1" aria-hidden={hidden}>
      {photos.carousel
        .filter((photo: Photo) => photo.src)
        .map((photo: Photo, index: number) => (
          <img
            key={`${photo.src}-${index}`}
            src={photo.src}
            alt={hidden ? '' : localize(photo.alt)}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            className="h-64 w-auto shrink-0 object-cover md:h-80"
          />
        ))}
    </div>
  );
};

// Endless strip of club photos leading into the join call-to-action.
const JoinSection = () => {
  const { t, tc } = useI18n();
  return (
    <section aria-labelledby="join-title" className="bg-brand text-white">
      <div
        role="region"
        aria-label={t('join.photos')}
        className="overflow-hidden bg-ink motion-reduce:overflow-x-auto"
      >
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
          <PhotoRow />
          <PhotoRow hidden />
        </div>
      </div>

      <div className="container-site flex flex-wrap items-center justify-between gap-8 py-18">
        <div className="flex-[1_1_520px]">
          <h2 id="join-title" className="section-title mb-3">
            {tc('join.title', { 0: <span className="text-ink" /> })}
          </h2>
          <p className="max-w-2xl text-[19px] text-white">{t('join.text')}</p>
        </div>
        <div className="flex flex-wrap gap-3.5">
          <Link to={Constants.ROUTE_REGISTRATION} className="btn btn-dark">
            {t('common.signup')}
          </Link>
          <Link to={`${Constants.ROUTE_REGISTRATION}#tarifs`} className="btn btn-outline-light">
            {t('common.prices')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;
