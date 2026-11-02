import { useI18n } from '@mxreakit/i18n';
import { Equal, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
import PageLayout from '@/components/custom/PageLayout';
import PageHero from '@/components/custom/PageHero';
import Section from '@/components/ui/Section';
import { Table, Td, Th, Tr } from '@/components/ui/Table';
import TeamTabs from '@/components/sections/competition/TeamTabs';
import OutboundLink from '@/components/ui/OutboundLink';
import VenueLabel from '@/components/ui/VenueLabel';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import { Constants } from '@/core/constants';
import type { SeasonResult, Trend, UpcomingMatch } from '@/core/content/types';
import { clubName, seasonRanking } from '@/core/competition';
import { cn, formatDate } from '@/core/utils';

const SUMMARY: { id: string; labelKey: string }[] = [
  { id: 'tournois', labelKey: 'competition.nav.tournaments' },
  { id: 'interclubs', labelKey: 'competition.nav.interclubs' },
  { id: 'equipes', labelKey: 'competition.nav.teams' },
  { id: 'bilan', labelKey: 'competition.nav.season' }
];

const TRENDS: Record<Trend, { className: string; icon: LucideIcon }> = {
  up: {
    className: 'bg-[#e3f2e7] text-[#1d6b37]',
    icon: TrendingUp
  },
  down: {
    className: 'bg-brand-tint text-brand-dark',
    icon: TrendingDown
  },
  same: { className: 'bg-line text-ink', icon: Equal }
};

const TrendBadge = ({ trend }: { trend: Trend }) => {
  const { t } = useI18n();
  const { className, icon: Icon } = TRENDS[trend];
  return (
    <span className={cn('badge inline-flex items-center gap-1.5', className)}>
      <Icon className="size-4 shrink-0" strokeWidth={2.75} aria-hidden="true" />
      {t(`competition.trend.${trend}`)}
    </span>
  );
};

const MatchRow = ({ match }: { match: UpcomingMatch }) => {
  const home: boolean = match.venue === 'home';
  return (
    <a
      href={match.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-stretch bg-ink-soft transition-colors hover:bg-ink-line"
    >
      <div className="flex w-22 shrink-0 flex-col items-center justify-center bg-brand py-3">
        <span className="font-display text-[28px] leading-none font-extrabold">{match.date}</span>
        <span className="text-sm tabular-nums">{match.time}</span>
      </div>
      <div className="min-w-0 grow px-3 py-3 sm:px-5">
        <p className="font-display text-lg leading-tight font-bold sm:text-2xl">
          {match.team} <span className="text-muted-light">vs</span> {clubName(match.opponent)}
        </p>
        <p className="mt-0.5 text-[13px] leading-snug text-[#d6d2cb] sm:text-[15px]">
          {match.division}
          {match.address && ` · ${match.address}`}
        </p>
      </div>
      <span
        className={cn(
          'flex items-center px-4 font-display font-extrabold tracking-wider uppercase',
          home ? 'bg-white text-brand' : 'bg-ink-line text-white'
        )}
      >
        <VenueLabel home={home} />
      </span>
    </a>
  );
};

const CompetitionPage = () => {
  const { t } = useI18n();
  const { language, locale, localize } = useLanguage();
  const { competition, settings, photos, synced } = useSiteContent();
  const { interclubs } = synced;

  return (
    <PageLayout meta={{ key: 'competition', path: Constants.ROUTE_COMPETITION }}>
      <PageHero title={t('nav.competition')} image={photos.heroes.competition}>
        {t('competition.hero')}
      </PageHero>

      <nav aria-label={t('competition.summary')} className="border-b border-line">
        <div className="container-site flex flex-wrap justify-center gap-2 py-4">
          {SUMMARY.map(({ id, labelKey }) => (
            <a
              key={id}
              href={`#${id}`}
              className="bg-sand px-4 py-2 font-display text-xl font-bold uppercase transition-colors hover:bg-brand hover:text-white"
            >
              {t(labelKey)}
            </a>
          ))}
        </div>
      </nav>

      <Section id="tournois">
        <div className="flex flex-wrap items-center gap-12">
          <div className="min-w-0 flex-[2_1_480px]">
            <h2 className="section-title mb-5">{t('competition.tournaments.title')}</h2>
            <p className="mb-4 text-lg">{t('competition.tournaments.text')}</p>
            <p className="mb-8 text-muted">{t('competition.tournaments.question')}</p>
            <OutboundLink href={settings.links.badnet} className="btn btn-primary">
              {t('competition.tournaments.cta')}
            </OutboundLink>
          </div>
          <figure className="flex-[1_1_300px]">
            {photos.tournament.src && (
              <img
                src={photos.tournament.src}
                alt={localize(photos.tournament.alt)}
                className="aspect-[4/5] w-full object-cover"
              />
            )}
            <figcaption className="mt-2 text-sm text-muted">
              {t('competition.tournaments.caption')}
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section id="interclubs" className="bg-ink text-white">
        <div className="flex flex-wrap gap-12">
          <div className="min-w-0 flex-[1_1_380px]">
            <h2 className="section-title mb-5">{t('competition.interclubs.title')}</h2>
            <p className="mb-4 text-lg text-[#e2ded8]">{t('competition.interclubs.text')}</p>
            <p className="mb-8 text-muted-light">{t('competition.interclubs.late')}</p>
            <OutboundLink href={settings.links.interclubs} className="btn btn-primary">
              {t('competition.interclubs.cta')}
            </OutboundLink>
          </div>
          <div className="min-w-0 flex-[1_1_480px]">
            <h3 className="eyebrow mb-4 text-2xl text-brand-light">
              {t('competition.interclubs.upcoming')}
            </h3>
            <div className="flex flex-col gap-2">
              {interclubs.upcoming.map((match: UpcomingMatch) => (
                <MatchRow key={match.url} match={match} />
              ))}
            </div>
            {interclubs.updatedAt && (
              <p className="mt-4 text-sm text-muted-light">
                {t('competition.interclubs.updated', formatDate(interclubs.updatedAt, locale))}
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section id="equipes" className="bg-sand">
        <h2 className="section-title mb-7">{t('competition.teams.title')}</h2>
        <TeamTabs />
      </Section>

      <Section id="bilan">
        <h2 className="section-title mb-7">
          {t('competition.season.title', competition.previousSeason)}
        </h2>
        <Table
          caption={t('competition.season.title', competition.previousSeason)}
          head={
            <>
              <Th>{t('competition.season.previous')}</Th>
              <Th>{t('competition.season.ranking')}</Th>
              <Th align="center">{t('competition.season.result')}</Th>
              <Th>{t('competition.season.next')}</Th>
            </>
          }
        >
          {competition.seasonResults.map((result: SeasonResult) => (
            <Tr key={result.previousTeam}>
              <Td className="font-display text-xl font-extrabold">{result.previousTeam}</Td>
              <Td>{seasonRanking(result, t, language)}</Td>
              <Td align="center">
                <TrendBadge trend={result.trend} />
              </Td>
              <Td className="font-display text-xl font-extrabold">{result.nextTeam}</Td>
            </Tr>
          ))}
        </Table>
      </Section>
    </PageLayout>
  );
};

export default CompetitionPage;
