import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import { Constants } from '@/core/constants';
import type { Team } from '@/core/content/types';
import { TEAM_PARAM, ordinal } from '@/core/competition';

// One line per team: the club's levels at a glance, details on the competition page.
const TeamsShowcase = () => {
  const { language } = useLanguage();
  const { interclubs } = useSiteContent().synced;

  return (
    <ul className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-x-6">
      {interclubs.teams.map((team: Team) => (
        <li key={team.name}>
          <Link
            to={`${Constants.ROUTE_COMPETITION}?${TEAM_PARAM}=${encodeURIComponent(team.name)}#equipes`}
            className="group flex min-h-20 items-center gap-3 bg-ink-soft pr-3 transition-colors hover:bg-ink-line sm:min-h-24 sm:gap-6 sm:pr-6"
          >
            <span className="flex w-20 shrink-0 items-center justify-center self-stretch bg-ink-deep font-display text-2xl font-extrabold italic sm:w-32 sm:text-[34px]">
              {team.name}
            </span>
            <span className="min-w-0 grow font-display text-lg leading-tight font-bold sm:text-2xl">
              {team.division.name}
            </span>
            <span className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="font-display text-3xl leading-none font-extrabold text-brand-light sm:text-[44px]">
                {ordinal(team.rank, language)}
              </span>
              <span className="text-sm text-muted-light">/ {team.standings.length}</span>
            </span>
            <ArrowRight
              className="hidden size-5 shrink-0 text-muted-light transition-transform group-hover:translate-x-1 sm:block"
              aria-hidden="true"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default TeamsShowcase;
