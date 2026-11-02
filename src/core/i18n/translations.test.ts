import { describe, expect, it } from 'vitest';
import { fr } from '@/core/i18n/fr';
import { en } from '@/core/i18n/en';
import { applyTextOverrides } from '@/core/i18n/translations';
import { languages, type Language } from '@/core/i18n/languages';
import { BACKUP } from '@/tests/backup';
import type { Localized, SeasonResult, SlotStatus } from '@/core/content/types';
import { DAYS, SLOT_STATUS } from '@/core/schedule';

// Every key built from a data id, as the components build them.
function dataKeys(): string[] {
  return [
    ...DAYS.map((day: string) => `day.${day}`),
    ...(Object.keys(SLOT_STATUS) as SlotStatus[]).map(
      (status: SlotStatus) => SLOT_STATUS[status].labelKey
    ),
    ...BACKUP.competition.seasonResults.map(
      (result: SeasonResult) => `competition.trend.${result.trend}`
    )
  ];
}

function isLocalized(value: unknown): value is Localized {
  return (
    typeof value === 'object' &&
    value !== null &&
    languages.every(
      (language: Language) => typeof (value as Record<string, unknown>)[language] === 'string'
    )
  );
}

// Every Localized value nested in the given content, with its path.
function localizedValues(value: unknown, path: string = ''): [string, Localized][] {
  if (isLocalized(value)) return [[path, value]];
  if (typeof value !== 'object' || value === null) return [];
  return Object.entries(value).flatMap(([key, child]: [string, unknown]) =>
    localizedValues(child, `${path}.${key}`)
  );
}

describe('translations', () => {
  it('has the same keys in French and English', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(fr).sort());
  });

  it('translates every data id', () => {
    const missing: string[] = dataKeys().filter((key: string) => !(key in fr) || !(key in en));
    expect(missing).toEqual([]);
  });

  it('translates the backup content in both languages, or in none', () => {
    const halfTranslated: string[] = localizedValues(BACKUP)
      .filter(([, text]: [string, Localized]) => !text.fr !== !text.en)
      .map(([path]: [string, Localized]) => path);
    expect(halfTranslated).toEqual([]);
  });
});

describe('applyTextOverrides', () => {
  const base = { fr: { greeting: 'Bonjour', bye: 'Salut' }, en: { greeting: 'Hello', bye: 'Bye' } };

  it('replaces the overridden languages only', () => {
    expect(applyTextOverrides(base, [{ key: 'greeting', fr: 'Coucou', en: '' }])).toEqual({
      fr: { greeting: 'Coucou', bye: 'Salut' },
      en: { greeting: 'Hello', bye: 'Bye' }
    });
  });

  it('leaves the base dictionaries untouched', () => {
    applyTextOverrides(base, [{ key: 'bye', fr: 'Ciao', en: 'Ciao' }]);
    expect(base.fr.bye).toBe('Salut');
  });
});
