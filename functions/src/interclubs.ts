// Interclubs scraper of the club ICBad page. ICBad has no API: the data is read from its
// HTML, so a markup change breaks it, and the sync then fails loudly instead of writing junk.
import { stripTags, type FetchText } from './html.js';
import {
  NOT_PLAYED,
  type Fixture,
  type HomeAway,
  type InterclubsData,
  type Standing,
  type Team,
  type UpcomingMatch
} from './types.js';

export const ICBAD_INSTANCE_URL: string = 'https://icbad.ffbad.org/instance/REC35';

// "REC Badminton (35-REC-1)"
const CLUB_PATTERN: RegExp = /\(\d{2}-REC-\d+\)/;
// ICBad prints unplayed fixtures as a 0 - 0 score
const UNPLAYED_SCORE: string = '0 - 0';

export interface Pool {
  id: string;
  // short pool name, e.g. "Régional 2 Poule 2"
  label: string;
  url: string;
}

interface Match {
  round: string;
  // ISO "YYYY-MM-DD"
  date: string;
  time: string;
  home: string;
  away: string;
  score: string;
  venue: string;
  url: string;
}

// The sidebar holds short pool names keyed by table id; headings carry the verbose wording.
export function parsePools(instanceHtml: string): Pool[] {
  const labels: Map<string, string> = new Map();
  const labelPattern: RegExp =
    /<a[^>]*class="scrollTo"[^>]*href="#tableau(\d+)"[^>]*>([\s\S]*?)<\/a>/g;
  for (const [, id, text] of instanceHtml.matchAll(labelPattern)) {
    labels.set(id, stripTags(text));
  }

  const poolPattern: RegExp =
    /<h2 id="tableau(\d+)">([\s\S]*?)<\/h2>[\s\S]*?href="(https:\/\/icbad\.ffbad\.org\/competition\/\d+\/tableau\/\d+)"/g;
  return [...instanceHtml.matchAll(poolPattern)].map(([, id, heading, url]: RegExpExecArray) => ({
    id,
    label: labels.get(id) || stripTags(heading),
    url
  }));
}

// First year of the season holding this date: August onwards opens a season.
export function seasonStartYear(today: Date): number {
  return today.getUTCMonth() + 1 >= 8 ? today.getUTCFullYear() : today.getUTCFullYear() - 1;
}

// ICBad prints "Le 19/09 à 16:00" without a year: rebuilt from the month and the season.
function isoDate(day: number, month: number, startYear: number): string {
  const year: number = month >= 8 ? startYear : startYear + 1;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parseMatches(poolHtml: string, startYear: number): Match[] {
  const section: string = poolHtml.slice(poolHtml.indexOf('Toutes les rencontres'));
  const matches: Match[] = [];
  let round: string = '';

  // desktop rows only: the markup repeats every match in a mobile variant
  const rowPattern: RegExp =
    /<th colspan="7"[^>]*>([\s\S]*?)<\/th>|<tr class="uk-visible@m clickable-row">([\s\S]*?)<\/tr>/g;
  for (const [, header, row] of section.matchAll(rowPattern)) {
    if (header !== undefined) {
      round = stripTags(header).replace(/^J0*/, 'J');
      continue;
    }

    const cells: string[] = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(
      (match: RegExpExecArray) => stripTags(match[1])
    );
    if (cells.length < 5) continue;

    const [when, venue, home, score, away] = cells;
    // fixtures are published before their kickoff time is set
    const stamp: RegExpMatchArray | null = when.match(/(\d{2})\/(\d{2})(?:\s*à\s*(\d{2}:\d{2}))?/);
    if (!stamp) continue;

    const link: RegExpMatchArray | null = row.match(
      /href="(https:\/\/icbad\.ffbad\.org\/rencontre\/\d+)"/
    );
    matches.push({
      round,
      date: isoDate(Number(stamp[1]), Number(stamp[2]), startYear),
      time: stamp[3] ?? '',
      home,
      away,
      score,
      // "Avenue de la Ronde," keeps the separator of an empty city
      venue: venue.replace(/,$/, '').trim(),
      url: link?.[1] ?? ''
    });
  }
  return matches;
}

export function parseStandings(poolHtml: string): Standing[] {
  const start: number = poolHtml.indexOf('classement-poule');
  if (start === -1) return [];
  const table: string = poolHtml.slice(start, poolHtml.indexOf('</table>', start));

  return [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)].flatMap(([, row]: RegExpExecArray) => {
    const cells: string[] = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(
      (match: RegExpExecArray) => stripTags(match[1])
    );
    if (cells.length < 11) return [];
    return [
      {
        rank: Number(cells[0]),
        team: cells[2],
        played: Number(cells[3]),
        won: Number(cells[4]),
        drawn: Number(cells[5]),
        lost: Number(cells[6]),
        points: Number(cells[10]),
        isRec: CLUB_PATTERN.test(cells[2])
      }
    ];
  });
}

// "REC Badminton (35-REC-1)" -> "REC 1"
export function shortTeamName(fullName: string): string {
  return (fullName.match(CLUB_PATTERN)?.[0] ?? fullName)
    .replace(/[()]/g, '')
    .replace(/^\d{2}-/, '')
    .replace('-', ' ');
}

// "2026-11-07" -> "07/11"
function displayDate(iso: string): string {
  return `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
}

// Halls without a postal code ("Salle non définie") carry no usable address.
function address(venue: string): string {
  return /\d{5}/.test(venue) ? venue : '';
}

// A reception is home at a Rennes gym or the unnamed club hall; plateau rounds hosted
// elsewhere stay away even when the federation lists the team as the host.
function homeAway(match: Match, team: string): HomeAway {
  const hosts: boolean = match.home === team;
  return hosts && (/non d[eé]fini/i.test(match.venue) || /rennes/i.test(match.venue))
    ? 'home'
    : 'away';
}

function toFixture(match: Match, team: string): Fixture {
  const venueAddress: string = address(match.venue);
  return {
    round: match.round,
    date: displayDate(match.date),
    ...(match.time && { time: match.time }),
    url: match.url,
    opponent: match.home === team ? match.away : match.home,
    venue: homeAway(match, team),
    ...(venueAddress && { address: venueAddress }),
    score: match.score === UNPLAYED_SCORE ? NOT_PLAYED : match.score
  };
}

const plays = (match: Match, team: string): boolean => match.home === team || match.away === team;

const kickoff = (match: Match): string => `${match.date}${match.time}`;

interface PoolResult {
  teams: Team[];
  upcoming: { kickoff: string; match: UpcomingMatch }[];
}

// The club teams of one pool, and the next match of each from today ("YYYY-MM-DD").
export function readPool(pool: Pool, html: string, startYear: number, today: string): PoolResult {
  const matches: Match[] = parseMatches(html, startYear);
  const standings: Standing[] = parseStandings(html);
  const result: PoolResult = { teams: [], upcoming: [] };

  standings
    .filter((standing: Standing) => standing.isRec)
    .forEach(({ team: fullName, rank, points }: Standing) => {
      const name: string = shortTeamName(fullName);
      const played: Match[] = matches.filter((match: Match) => plays(match, fullName));
      result.teams.push({
        name,
        division: { name: pool.label, url: pool.url },
        rank,
        points,
        standings,
        calendar: played.map((match: Match) => toFixture(match, fullName))
      });

      const next: Match | undefined = played
        .filter((match: Match) => match.date >= today)
        .sort((a: Match, b: Match) => kickoff(a).localeCompare(kickoff(b)))[0];
      if (!next) return;
      const { round: _round, score: _score, ...fixture }: Fixture = toFixture(next, fullName);
      result.upcoming.push({
        kickoff: kickoff(next),
        match: { ...fixture, team: name, division: pool.label }
      });
    });
  return result;
}

// Scrapes every pool of the club and builds the interclubs document.
export async function scrapeInterclubs(fetchText: FetchText, now: Date): Promise<InterclubsData> {
  const pools: Pool[] = parsePools(await fetchText(ICBAD_INSTANCE_URL));
  if (!pools.length) throw new Error(`No pool found on ${ICBAD_INSTANCE_URL}: markup changed?`);

  const startYear: number = seasonStartYear(now);
  // Swedish dates read "YYYY-MM-DD"
  const today: string = now.toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
  const results: PoolResult[] = [];
  // one pool after the other: keeps the load on ICBad low
  for (const pool of pools) {
    results.push(readPool(pool, await fetchText(pool.url), startYear, today));
  }

  const teams: Team[] = results.flatMap((result: PoolResult) => result.teams);
  if (!teams.length) throw new Error('No REC team found in the ICBad pools: markup changed?');
  return {
    upcoming: results
      .flatMap((result: PoolResult) => result.upcoming)
      .sort((a, b) => a.kickoff.localeCompare(b.kickoff))
      .map(({ match }) => match),
    teams
  };
}
