import { Link } from 'react-router-dom';
import { useI18n } from '@mxreakit/i18n';
import PageLayout from '@/components/custom/PageLayout';
import Section from '@/components/ui/Section';
import ArrowLabel from '@/components/ui/ArrowLabel';
import WeekOverview from '@/components/sections/WeekOverview';
import TeamsShowcase from '@/components/sections/TeamsShowcase';
import NewsFeed from '@/components/sections/NewsFeed';
import JoinSection from '@/components/sections/JoinSection';
import DownloadLink from '@/components/ui/DownloadLink';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import { Constants } from '@/core/constants';
import { formatDate } from '@/core/utils';

const Hero = () => {
  const { t, tc } = useI18n();
  const { settings, photos } = useSiteContent();
  return (
    <section className="relative bg-ink text-center text-white">
      {photos.heroes.home && (
        <img
          src={photos.heroes.home}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover opacity-40"
        />
      )}
      <div className="relative mx-auto max-w-[980px] px-6 pt-24 pb-24 lg:pt-38 lg:pb-26">
        <h1 className="display-title mb-6 text-6xl tracking-tight md:text-8xl lg:text-[104px]">
          {tc('home.hero.title', { 0: <span className="text-brand-light" /> })}
        </h1>
        <p className="mx-auto mb-9 max-w-2xl text-[21px] text-[#ece9e4]">{t('home.hero.text')}</p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Link to={Constants.ROUTE_REGISTRATION} className="btn btn-primary">
            {t('home.hero.join')}
          </Link>
          <DownloadLink href={settings.booklet} className="btn btn-outline-light">
            {t('home.hero.booklet')}
          </DownloadLink>
        </div>
      </div>
    </section>
  );
};

const HomePage = () => {
  const { t } = useI18n();
  const { locale } = useLanguage();
  const { interclubs } = useSiteContent().synced;
  return (
    <PageLayout meta={{ key: 'home', path: Constants.ROUTE_HOME }}>
      <Hero />

      <Section id="creneaux" className="bg-sand">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <h2 className="section-title">{t('home.sessions.title')}</h2>
          <Link
            to={Constants.ROUTE_SCHEDULE}
            className="group font-bold text-brand-dark hover:underline"
          >
            <ArrowLabel>{t('home.sessions.link')}</ArrowLabel>
          </Link>
        </div>
        <WeekOverview />
      </Section>

      <Section id="equipes" className="bg-ink text-white">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title mb-2">{t('home.teams.title')}</h2>
            {interclubs.updatedAt && (
              <p className="text-muted-light">
                {t('home.teams.updated', formatDate(interclubs.updatedAt, locale))}
              </p>
            )}
          </div>
          <Link
            to={`${Constants.ROUTE_COMPETITION}#equipes`}
            className="group font-bold text-brand-light hover:underline"
          >
            <ArrowLabel>{t('teams.more')}</ArrowLabel>
          </Link>
        </div>
        <TeamsShowcase />
      </Section>

      <JoinSection />

      <Section label={t('news.title')} className="bg-sand">
        <NewsFeed />
      </Section>
    </PageLayout>
  );
};

export default HomePage;
