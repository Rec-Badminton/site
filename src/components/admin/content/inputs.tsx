import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useI18n } from '@mxreakit/i18n';
import { FileText, Upload } from 'lucide-react';
import { readImageSize, type Size } from '@/core/admin/image-optimizer';
import type { Localized } from '@/core/content/types';
import { languages, type Language } from '@/core/i18n/languages';
import { cn } from '@/core/utils';
import type { Option } from '@/components/admin/content/schema';

// Number typed as text, so "-" or "48." stay editable until they parse.
export const NumberInput = ({
  id,
  value,
  step,
  onChange
}: {
  id: string;
  value: number;
  step?: number;
  onChange: (value: number) => void;
}) => {
  const [text, setText] = useState<string>(String(value ?? ''));
  const [synced, setSynced] = useState<number>(value);

  if (value !== synced) {
    setSynced(value);
    if (Number(text) !== value) setText(String(value ?? ''));
  }

  const change = (event: ChangeEvent<HTMLInputElement>) => {
    const next: string = event.target.value.replace(',', '.');
    setText(next);
    const parsed: number = Number(next);
    if (next.trim() !== '' && !Number.isNaN(parsed)) onChange(parsed);
  };

  return (
    <input
      id={id}
      type="text"
      inputMode={step && step < 1 ? 'decimal' : 'numeric'}
      value={text}
      onChange={change}
      className="field-input tabular-nums"
    />
  );
};

const LANGUAGE_NAMES: Record<Language, string> = {
  fr: 'admin.language.fr',
  en: 'admin.language.en'
};

export const LocalizedInput = ({
  id,
  value,
  multiline,
  onChange
}: {
  id: string;
  value: Localized | undefined;
  multiline?: boolean;
  onChange: (value: Localized) => void;
}) => {
  const { t } = useI18n();
  const current: Localized = { fr: '', en: '', ...value };

  return (
    <div className="grid gap-2 md:grid-cols-2">
      {languages.map((language: Language) => {
        const props = {
          id: language === 'fr' ? id : `${id}-${language}`,
          value: current[language],
          'aria-label': t(LANGUAGE_NAMES[language]),
          className: cn('field-input', multiline && 'min-h-28 resize-y'),
          onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange({ ...current, [language]: event.target.value })
        };
        return (
          <div key={language} className="flex gap-2">
            <span className="flex w-9 shrink-0 items-start justify-center bg-ink pt-2.5 font-display text-sm font-extrabold text-white uppercase">
              {language}
            </span>
            {multiline ? <textarea rows={4} {...props} /> : <input type="text" {...props} />}
          </div>
        );
      })}
    </div>
  );
};

export const ColorInput = ({
  id,
  value,
  onChange
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex gap-2">
    <input
      type="color"
      value={/^#[0-9a-f]{6}$/i.test(value) ? value : '#000000'}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      aria-hidden="true"
      tabIndex={-1}
      className="h-11 w-14 shrink-0 cursor-pointer border-2 border-line bg-white p-1"
    />
    <input
      id={id}
      type="text"
      value={value ?? ''}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
      className="field-input font-mono"
    />
  </div>
);

export const MultiSelect = ({
  value,
  options,
  onChange
}: {
  value: string[];
  options: Option[];
  onChange: (value: string[]) => void;
}) => {
  const selected: string[] = value ?? [];
  const toggle = (option: string) =>
    onChange(
      selected.includes(option)
        ? selected.filter((item: string) => item !== option)
        : [...selected, option]
    );

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option: Option) => {
        const active: boolean = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(option.value)}
            className={cn(
              'border-2 px-3 py-1 text-sm font-bold transition-colors',
              active
                ? 'border-brand bg-brand text-white'
                : 'border-line bg-white text-ink hover:border-brand'
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

// Button-styled file input.
const FilePicker = ({
  label,
  accept,
  onPick
}: {
  label: string;
  accept: string;
  onPick: (file: File) => void;
}) => {
  const change = (event: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = event.target.files?.[0];
    // allow picking the same file again
    event.target.value = '';
    if (file) onPick(file);
  };

  return (
    <label className="btn btn-outline-dark min-h-10 cursor-pointer px-4 py-1.5 text-lg has-focus-visible:outline-2 has-focus-visible:outline-brand">
      <Upload className="size-[1.1em] shrink-0" aria-hidden="true" />
      {label}
      <input type="file" accept={accept} onChange={change} className="sr-only" />
    </label>
  );
};

// URL showing a stored file, or a picked one through an object URL revoked once replaced.
const usePreviewUrl = (value: string | File | undefined): string => {
  const objectUrl: string = useMemo(
    () => (value instanceof File ? URL.createObjectURL(value) : ''),
    [value]
  );

  useEffect(
    () => () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    },
    [objectUrl]
  );

  if (value instanceof File) return objectUrl;
  return value ?? '';
};

export const ImageInput = ({
  value,
  measure,
  onChange
}: {
  value: string | File;
  measure?: boolean;
  onChange: (value: File, siblings?: Partial<Size>) => void;
}) => {
  const { t } = useI18n();
  const preview: string = usePreviewUrl(value);

  const pick = async (file: File) => {
    if (!measure) {
      onChange(file);
      return;
    }
    const size: Size | null = await readImageSize(file);
    onChange(file, size ?? {});
  };

  return (
    <div className="flex items-center gap-4">
      <span className="flex size-24 shrink-0 items-center justify-center border-2 border-line bg-white">
        {preview && <img src={preview} alt="" className="max-h-full max-w-full object-contain" />}
      </span>
      <FilePicker label={t('admin.image.choose')} accept="image/*" onPick={pick} />
    </div>
  );
};

export const FileInput = ({
  value,
  accept,
  onChange
}: {
  value: string | File;
  accept: string;
  onChange: (value: File) => void;
}) => {
  const { t } = useI18n();
  const preview: string = usePreviewUrl(value);

  return (
    <div className="flex flex-wrap items-center gap-4">
      {value instanceof File ? (
        <span className="flex items-center gap-2 font-semibold">
          <FileText className="size-5 shrink-0 text-brand" aria-hidden="true" />
          {value.name}
        </span>
      ) : (
        value && (
          <a href={preview} target="_blank" rel="noreferrer" className="link inline-flex gap-2">
            <FileText className="size-5 shrink-0" aria-hidden="true" />
            {t('admin.file.current')}
          </a>
        )
      )}
      <FilePicker label={t('admin.file.choose')} accept={accept} onPick={onChange} />
    </div>
  );
};
