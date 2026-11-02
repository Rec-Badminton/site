import { describe, expect, it } from 'vitest';
import {
  ICBAD_INSTANCE_URL,
  parseMatches,
  parsePools,
  parseStandings,
  readPool,
  scrapeInterclubs,
  seasonStartYear,
  shortTeamName,
  type Pool
} from './interclubs.js';
import type { InterclubsData } from './types.js';

const POOL_URL: string = 'https://icbad.ffbad.org/competition/2601159/tableau/18612';

// trimmed copies of the ICBad markup
const INSTANCE: string = `
  <td><a class="scrollTo" href="#tableau18612">
    National 3 Poule 3   </a></td>
  <h2 id="tableau18612">Interclubs Nationaux N3 - Championnat de France Interclubs N3 - Poule 3</h2>
  <a class="uk-button" href="${POOL_URL}">Voir listing, calendrier des rencontres</a>`;

const standingRow = (rank: number, team: string, points: number): string => `
  <tr class="">
    <td class="uk-text-center">${rank}</td>
    <td class="uk-visible@s table-logo-club"><img src="logo.png" /></td>
    <td class="nom-equipe"><a href="https://icbad.ffbad.org/equipe/1">
      ${team}   </a></td>
    <td>2</td><td>1</td><td>0</td><td>1</td><td>0</td><td>0</td><td>0</td>
    <td><strong>${points}</strong></td><td>4</td><td>8</td><td>40</td>
  </tr>`;

const matchRow = (
  id: number,
  when: string,
  venue: string,
  home: string,
  score: string,
  away: string
) => `
  <tr class="uk-visible@m clickable-row">
    <td><a href="https://icbad.ffbad.org/rencontre/${id}" class="row-link">${when}</a></td>
    <td>${venue}</td><td>${home}</td><td>${score}</td><td>${away}</td><td></td>
  </tr>
  <tr class="uk-hidden@m"><td colspan="7">${when} ${home} ${score} ${away}</td></tr>`;

const POOL: string = `
  <table class="uk-table classement-poule">
    <tr><th>#</th><th></th><th>Équipes</th></tr>
    ${standingRow(1, 'Club Alenconnais Badminton (61-CAB-2)', 13)}
    ${standingRow(2, 'REC Badminton (35-REC-1)', 9)}
  </table>
  <h2>Toutes les rencontres</h2>
  <table>
    <tr><th colspan="7" class="uk-text-center">J01</th></tr>
    ${matchRow(1, 'Le 19/09 à 16:00', 'Gymnase du SIUAPS Beaulieu, 35000 Rennes', 'REC Badminton (35-REC-1)', '2 - 6', 'Club Alenconnais Badminton (61-CAB-2)')}
    <tr><th colspan="7" class="uk-text-center">J02</th></tr>
    ${matchRow(2, 'Le 10/01', 'Avenue de la Ronde,', 'Club Alenconnais Badminton (61-CAB-2)', '0 - 0', 'REC Badminton (35-REC-1)')}
    ${matchRow(3, 'Le 14/02 à 14:00', 'Salle non définie', 'REC Badminton (35-REC-1)', '0 - 0', 'Club Alenconnais Badminton (61-CAB-2)')}
  </table>`;

const POOL_INFO: Pool = { id: '18612', label: 'National 3 Poule 3', url: POOL_URL };

describe('interclubs scraper', () => {
  it('reads the short pool names and their links', () => {
    expect(parsePools(INSTANCE)).toEqual([POOL_INFO]);
  });

  it('dates matches in the season they belong to', () => {
    expect(seasonStartYear(new Date('2026-09-01'))).toBe(2026);
    expect(seasonStartYear(new Date('2027-03-01'))).toBe(2026);
    expect(parseMatches(POOL, 2026).map((match) => [match.round, match.date, match.time])).toEqual([
      ['J1', '2026-09-19', '16:00'],
      ['J2', '2027-01-10', ''],
      ['J2', '2027-02-14', '14:00']
    ]);
  });

  it('reads the standings and flags the club teams', () => {
    expect(parseStandings(POOL)).toEqual([
      expect.objectContaining({ rank: 1, points: 13, isRec: false }),
      expect.objectContaining({ rank: 2, team: 'REC Badminton (35-REC-1)', played: 2, isRec: true })
    ]);
    expect(shortTeamName('REC Badminton (35-REC-12)')).toBe('REC 12');
  });

  it('builds each club team with its calendar and next match', () => {
    const { teams, upcoming } = readPool(POOL_INFO, POOL, 2026, '2026-11-02');

    expect(teams).toHaveLength(1);
    expect(teams[0]).toMatchObject({
      name: 'REC 1',
      division: { name: 'National 3 Poule 3', url: POOL_URL },
      rank: 2,
      points: 9
    });
    expect(teams[0].calendar).toEqual([
      {
        round: 'J1',
        date: '19/09',
        time: '16:00',
        url: 'https://icbad.ffbad.org/rencontre/1',
        opponent: 'Club Alenconnais Badminton (61-CAB-2)',
        venue: 'home',
        address: 'Gymnase du SIUAPS Beaulieu, 35000 Rennes',
        score: '2 - 6'
      },
      // away even with a set venue, unplayed score shown as a dash
      expect.objectContaining({ date: '10/01', venue: 'away', score: '—' }),
      // the unnamed club hall counts as home, without an address
      expect.not.objectContaining({ address: expect.anything() })
    ]);
    expect(upcoming).toEqual([
      {
        kickoff: '2027-01-10',
        match: {
          date: '10/01',
          url: 'https://icbad.ffbad.org/rencontre/2',
          team: 'REC 1',
          division: 'National 3 Poule 3',
          opponent: 'Club Alenconnais Badminton (61-CAB-2)',
          venue: 'away'
        }
      }
    ]);
  });

  it('scrapes every pool into the interclubs document', async () => {
    const pages: Record<string, string> = { [ICBAD_INSTANCE_URL]: INSTANCE, [POOL_URL]: POOL };
    const content: InterclubsData = await scrapeInterclubs(
      async (url: string) => pages[url],
      new Date('2026-11-02T08:00:00Z')
    );

    expect(content.teams.map((team) => team.name)).toEqual(['REC 1']);
    expect(content.upcoming.map((match) => match.date)).toEqual(['10/01']);
  });

  it('fails loudly when the markup changed', async () => {
    await expect(scrapeInterclubs(async () => '<html></html>', new Date())).rejects.toThrow(
      /markup changed/
    );
  });
});
