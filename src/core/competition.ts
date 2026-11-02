import type { I18nFunctionString } from '@mxreakit/i18n';
import { NOT_PLAYED, type Fixture, type SeasonResult } from '@/core/content/types';
import type { Language } from '@/core/i18n/languages';

// search param preselecting a team on the competition page
export const TEAM_PARAM: string = 'equipe';

export function isPlayed(fixture: Fixture): boolean {
  return fixture.score !== NOT_PLAYED;
}

const EN_SUFFIXES: Record<Intl.LDMLPluralRule, string> = {
  one: 'st',
  two: 'nd',
  few: 'rd',
  other: 'th',
  zero: 'th',
  many: 'th'
};

export function ordinal(rank: number, language: Language): string {
  if (language === 'en') {
    return `${rank}${EN_SUFFIXES[new Intl.PluralRules('en', { type: 'ordinal' }).select(rank)]}`;
  }
  return rank === 1 ? '1er' : `${rank}e`;
}

// "4e de poule", or "8e de poule (1er aux barrages)" after play-offs
export function seasonRanking(
  result: SeasonResult,
  t: I18nFunctionString,
  language: Language
): string {
  const group: string = t('competition.season.groupRank', ordinal(result.groupRank, language));
  if (!result.playoffRank) return group;
  return `${group} (${t('competition.season.playoffRank', ordinal(result.playoffRank, language))})`;
}

// "Cs Betton Badminton (35-CSB-1)" -> "Cs Betton Badminton"
export function clubName(team: string): string {
  return team.replace(/\s*\([^)]*\)\s*$/, '');
}
