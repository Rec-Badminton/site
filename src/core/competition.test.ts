import { describe, expect, it } from 'vitest';
import { createTranslateString, type I18nFunctionString } from '@mxreakit/i18n';
import { clubName, isPlayed, ordinal, seasonRanking } from '@/core/competition';
import type { Fixture, SeasonResult } from '@/core/content/types';
import { translations } from '@/core/i18n/translations';

const fixture: Fixture = {
  round: 'J1',
  date: '02/11',
  url: '',
  opponent: 'Cs Betton Badminton (35-CSB-1)',
  venue: 'away',
  score: '—'
};

const result: SeasonResult = {
  previousTeam: 'REC 1',
  groupRank: 8,
  trend: 'same',
  nextTeam: 'REC 1'
};

describe('isPlayed', () => {
  it('detects fixtures without a score yet', () => {
    expect(isPlayed(fixture)).toBe(false);
    expect(isPlayed({ ...fixture, score: '5-3' })).toBe(true);
  });
});

describe('ordinal', () => {
  it('uses French abbreviations', () => {
    expect(ordinal(1, 'fr')).toBe('1er');
    expect(ordinal(2, 'fr')).toBe('2e');
    expect(ordinal(11, 'fr')).toBe('11e');
  });

  it('uses English suffixes, including the teens', () => {
    expect(
      [1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 101].map((rank: number) => ordinal(rank, 'en'))
    ).toEqual([
      '1st',
      '2nd',
      '3rd',
      '4th',
      '11th',
      '12th',
      '13th',
      '21st',
      '22nd',
      '23rd',
      '101st'
    ]);
  });
});

describe('seasonRanking', () => {
  const fr: I18nFunctionString = createTranslateString(translations, 'fr');
  const en: I18nFunctionString = createTranslateString(translations, 'en');

  it('shows the group rank alone without play-offs', () => {
    expect(seasonRanking(result, fr, 'fr')).toBe('8e de poule');
    expect(seasonRanking(result, en, 'en')).toBe('8th in group');
  });

  it('appends the play-off rank', () => {
    const withPlayoffs: SeasonResult = { ...result, playoffRank: 1 };
    expect(seasonRanking(withPlayoffs, fr, 'fr')).toBe('8e de poule (1er aux barrages)');
    expect(seasonRanking(withPlayoffs, en, 'en')).toBe('8th in group (1st in play-offs)');
  });
});

describe('clubName', () => {
  it('drops the trailing team code', () => {
    expect(clubName('Cs Betton Badminton (35-CSB-1)')).toBe('Cs Betton Badminton');
  });

  it('keeps names without a code and inner parentheses', () => {
    expect(clubName('REC 11')).toBe('REC 11');
    expect(clubName('Club (Rennes) Badminton')).toBe('Club (Rennes) Badminton');
  });
});
