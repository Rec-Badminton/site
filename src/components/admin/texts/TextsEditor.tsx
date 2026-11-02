import { memo, useCallback, useState, type ChangeEvent, type FormEvent } from 'react';
import { useI18n } from '@mxreakit/i18n';
import { RotateCcw, Search } from 'lucide-react';
import QueryState from '@/components/admin/QueryState';
import SaveBar from '@/components/admin/SaveBar';
import SectionHeader from '@/components/admin/SectionHeader';
import { useAdminContent, useSaveContent } from '@/hooks/use-admin-content';
import { useUnsavedChanges } from '@/hooks/use-unsaved-changes';
import { isEqual } from '@/core/admin/draft';
import type { TextOverride, TextsContent } from '@/core/content/types';
import { en } from '@/core/i18n/en';
import { fr } from '@/core/i18n/fr';
import { languages, type Language } from '@/core/i18n/languages';
import { cn } from '@/core/utils';

type Overrides = Record<string, Record<Language, string>>;

const DEFAULTS: Record<Language, Record<string, string>> = { fr, en };
const KEYS: string[] = Object.keys(fr);
// keys grouped by their first segment, in dictionary order
const NAMESPACES: string[] = [...new Set(KEYS.map((key: string) => key.split('.', 1)[0] ?? key))];

const toOverrides = (content: TextsContent): Overrides =>
  Object.fromEntries(
    content.overrides.map((override: TextOverride) => [
      override.key,
      { fr: override.fr, en: override.en }
    ])
  );

const toContent = (overrides: Overrides): TextsContent => ({
  overrides: Object.entries(overrides)
    .filter(
      ([key, values]: [string, Record<Language, string>]) => key in fr && (values.fr || values.en)
    )
    .map(([key, values]: [string, Record<Language, string>]) => ({ key, ...values }))
});

// lowercase without accents, so "creneau" finds "Créneau"
const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

const rowsFor = (value: string): number => Math.min(6, Math.max(1, Math.ceil(value.length / 70)));

interface TextRowProps {
  textKey: string;
  values: Record<Language, string> | undefined;
  onChange: (key: string, values: Record<Language, string> | undefined) => void;
}

const TextRow = memo(({ textKey, values, onChange }: TextRowProps) => {
  const { t } = useI18n();
  const current: Record<Language, string> = values ?? { fr: '', en: '' };
  const changed: boolean = Boolean(current.fr || current.en);

  return (
    <li
      className={cn(
        'flex flex-col gap-2 bg-white p-4',
        changed && 'shadow-[inset_4px_0_0_var(--color-brand)]'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <code className="text-sm text-muted">{textKey}</code>
        {changed && (
          <button
            type="button"
            onClick={() => onChange(textKey, undefined)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark hover:underline"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            {t('admin.texts.restore')}
          </button>
        )}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {languages.map((language: Language) => {
          const fallback: string = DEFAULTS[language][textKey] ?? '';
          return (
            <div key={language} className="flex gap-2">
              <span className="flex w-9 shrink-0 items-start justify-center bg-ink pt-2.5 font-display text-sm font-extrabold text-white uppercase">
                {language}
              </span>
              <textarea
                aria-label={`${textKey} (${t(`admin.language.${language}`)})`}
                value={current[language]}
                placeholder={fallback}
                rows={rowsFor(current[language] || fallback)}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  onChange(textKey, { ...current, [language]: event.target.value })
                }
                className="field-input resize-y text-[15px] placeholder:text-muted/70"
              />
            </div>
          );
        })}
      </div>
    </li>
  );
});
TextRow.displayName = 'TextRow';

const TextsForm = ({ saved }: { saved: TextsContent }) => {
  const { t } = useI18n();
  const [base, setBase] = useState<TextsContent>(saved);
  const [draft, setDraft] = useState<Overrides>(() => toOverrides(saved));
  const [query, setQuery] = useState<string>('');
  const [onlyChanged, setOnlyChanged] = useState<boolean>(false);
  const { mutate: save, isPending } = useSaveContent('texts');

  // a successful save refetches the document: start over from it
  if (saved !== base) {
    setBase(saved);
    setDraft(toOverrides(saved));
  }

  // empty overrides do not count: clearing a field back is no change
  const dirty: boolean = !isEqual(toOverrides(toContent(draft)), toOverrides(base));
  useUnsavedChanges(dirty);

  const change = useCallback((key: string, values: Record<Language, string> | undefined) => {
    setDraft((current: Overrides) => {
      const next: Overrides = { ...current };
      if (values) next[key] = values;
      else delete next[key];
      return next;
    });
  }, []);

  const search: string = normalize(query.trim());
  const visible = (key: string): boolean => {
    const values: Record<Language, string> | undefined = draft[key];
    if (onlyChanged && !(values?.fr || values?.en)) return false;
    if (!search) return true;
    return [key, fr[key] ?? '', en[key] ?? '', values?.fr ?? '', values?.en ?? ''].some(
      (value: string) => normalize(value).includes(search)
    );
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save({ draft: toContent(draft), previous: base });
  };

  const reset = () => setDraft(toOverrides(base));

  return (
    <form onSubmit={submit} className="flex flex-col">
      <SectionHeader
        title={t('admin.sections.texts.label')}
        description={t('admin.sections.texts.description')}
      />
      <p className="mb-6 bg-warning-tint p-4 text-warning">{t('admin.texts.markup')}</p>

      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <label className="relative min-w-0 grow basis-72">
          <span className="sr-only">{t('admin.texts.search')}</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value)}
            placeholder={t('admin.texts.search')}
            className="field-input pl-10"
          />
        </label>
        <label className="flex cursor-pointer items-center gap-3 font-semibold">
          <input
            type="checkbox"
            checked={onlyChanged}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setOnlyChanged(event.target.checked)
            }
            className="size-5 accent-brand"
          />
          {t('admin.texts.onlyChanged')}
        </label>
      </div>

      <div className="flex flex-col gap-3">
        {NAMESPACES.map((namespace: string) => {
          const keys: string[] = KEYS.filter(
            (key: string) => key.startsWith(`${namespace}.`) && visible(key)
          );
          if (!keys.length) return null;
          return (
            <details
              key={namespace}
              open={Boolean(search) || onlyChanged}
              className="group bg-sand"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4 font-display text-2xl font-extrabold uppercase hover:text-brand">
                {t(`admin.texts.group.${namespace}`)}
                <span className="badge bg-ink text-white">{keys.length}</span>
              </summary>
              <ul className="flex flex-col gap-1 px-2 pb-2">
                {keys.map((key: string) => (
                  <TextRow key={key} textKey={key} values={draft[key]} onChange={change} />
                ))}
              </ul>
            </details>
          );
        })}
      </div>

      <SaveBar dirty={dirty} isPending={isPending} onReset={reset} />
    </form>
  );
};

// Overrides of the site copy, key by key, over the French and English dictionaries.
const TextsEditor = () => (
  <QueryState query={useAdminContent('texts')}>
    {(saved: TextsContent) => <TextsForm saved={saved} />}
  </QueryState>
);

export default TextsEditor;
