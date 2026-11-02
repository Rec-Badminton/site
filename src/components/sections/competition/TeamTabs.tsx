import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useI18n } from '@mxreakit/i18n';
import Tabs, { type TabItem } from '@/components/ui/Tabs';
import { Table, Td, Th, Tr } from '@/components/ui/Table';
import VenueLabel from '@/components/ui/VenueLabel';
import ResponsiveLabel from '@/components/ui/ResponsiveLabel';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import type { Fixture, Standing, Team } from '@/core/content/types';
import { TEAM_PARAM, clubName, isPlayed, ordinal } from '@/core/competition';
import { cn } from '@/core/utils';

const STANDING_COLUMNS: string[] = ['played', 'won', 'drawn', 'lost', 'points'];

const StandingsTable = ({ team }: { team: Team }) => {
  const { t } = useI18n();
  return (
    <>
      <Table
        caption={`${t('competition.teams.standings')} ${team.division.name}`}
        head={
          <>
            <Th align="center">#</Th>
            <Th>{t('competition.table.team')}</Th>
            {STANDING_COLUMNS.map((column: string) => (
              <Th key={column} align="right">
                <ResponsiveLabel
                  short={t(`competition.table.${column}Short`)}
                  full={t(`competition.table.${column}`)}
                />
              </Th>
            ))}
          </>
        }
      >
        {team.standings.map((row: Standing) => (
          <Tr key={row.rank} highlight={row.isRec}>
            <Td align="center" className="font-display text-xl font-extrabold">
              {row.rank}
            </Td>
            <Td>{clubName(row.team)}</Td>
            <Td align="right">{row.played}</Td>
            <Td align="right">{row.won}</Td>
            <Td align="right">{row.drawn}</Td>
            <Td align="right">{row.lost}</Td>
            <Td align="right" className="font-display text-xl font-extrabold">
              {row.points}
            </Td>
          </Tr>
        ))}
      </Table>
      <p className="mt-2 text-sm text-muted md:hidden">{t('competition.table.legend')}</p>
    </>
  );
};

const CalendarTable = ({ team }: { team: Team }) => {
  const { t } = useI18n();
  return (
    <Table
      caption={`${t('competition.teams.calendar')} ${team.name}`}
      head={
        <>
          <Th align="center">{t('competition.table.round')}</Th>
          <Th>{t('competition.table.date')}</Th>
          <Th>{t('competition.table.opponent')}</Th>
          <Th align="center">{t('competition.table.venue')}</Th>
          <Th align="center">{t('competition.table.score')}</Th>
        </>
      }
    >
      {team.calendar.map((fixture: Fixture) => (
        <Tr key={fixture.url}>
          <Td align="center" className="font-display text-xl font-extrabold">
            {/* data rounds are "J1", "J2"... (journée) */}
            {fixture.round.replace(/^J/, t('competition.table.roundPrefix'))}
          </Td>
          <Td className="whitespace-nowrap">
            <a
              href={fixture.url}
              target="_blank"
              rel="noreferrer"
              className="font-semibold hover:text-brand hover:underline"
            >
              {fixture.date}
            </a>
            {fixture.time && <span className="text-muted"> · {fixture.time}</span>}
          </Td>
          <Td>
            {clubName(fixture.opponent)}
            {fixture.address && <span className="block text-sm text-muted">{fixture.address}</span>}
          </Td>
          <Td align="center">
            <span
              className={cn(
                'badge',
                fixture.venue === 'home' ? 'bg-brand text-white' : 'bg-line text-ink'
              )}
            >
              <VenueLabel home={fixture.venue === 'home'} />
            </span>
          </Td>
          <Td
            align="center"
            className={cn('whitespace-nowrap', isPlayed(fixture) ? 'font-bold' : 'text-muted')}
          >
            {fixture.score}
          </Td>
        </Tr>
      ))}
    </Table>
  );
};

const TeamTabs = () => {
  const { t } = useI18n();
  const { language } = useLanguage();
  const { teams } = useSiteContent().synced.interclubs;
  const [searchParams] = useSearchParams();
  const [selected, setSelected] = useState<string>(
    () => searchParams.get(TEAM_PARAM) ?? teams[0]?.name ?? ''
  );
  const team: Team | undefined = teams.find((item: Team) => item.name === selected) ?? teams[0];
  if (!team) return null;

  const tabs: TabItem[] = teams.map((item: Team) => ({ id: item.name, label: item.name }));

  return (
    <Tabs label={t('teams.tabs')} items={tabs} value={team.name} onChange={setSelected}>
      <div className="flex flex-col gap-8 bg-white p-5 md:p-8">
        <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
          <a
            href={team.division.url}
            target="_blank"
            rel="noreferrer"
            className="font-display text-4xl font-extrabold hover:text-brand"
          >
            {team.division.name}
          </a>
          <span className="font-display text-2xl font-bold text-brand uppercase">
            {ordinal(team.rank, language)} ·{' '}
            {t(team.points > 1 ? 'common.points' : 'common.point', String(team.points))}
          </span>
        </div>
        <div>
          <h3 className="eyebrow mb-3 text-2xl">{t('competition.teams.standings')}</h3>
          <StandingsTable team={team} />
        </div>
        <div>
          <h3 className="eyebrow mb-3 text-2xl">{t('competition.teams.calendar')}</h3>
          <CalendarTable team={team} />
        </div>
      </div>
    </Tabs>
  );
};

export default TeamTabs;
