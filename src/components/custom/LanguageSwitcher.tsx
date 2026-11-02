import { useI18n } from '@mxreakit/i18n';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { LANGUAGE_LABELS, languages, type Language } from '@/core/i18n/languages';
import { cn } from '@/core/utils';

interface LanguageSwitcherProps {
  tone?: 'light' | 'dark';
  className?: string;
}

// Compact FR / EN toggle showing the current language.
const LanguageSwitcher = ({ tone = 'dark', className }: LanguageSwitcherProps) => {
  const { t } = useI18n();
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className={cn('flex items-center gap-1', className)}
    >
      <Globe
        className={cn('mr-1 size-4', tone === 'dark' ? 'text-muted-light' : 'text-muted')}
        aria-hidden="true"
      />
      {languages.map((lang: Language) => {
        const selected: boolean = lang === language;
        return (
          <button
            key={lang}
            type="button"
            lang={lang}
            title={LANGUAGE_LABELS[lang]}
            aria-pressed={selected}
            onClick={() => setLanguage(lang)}
            className={cn(
              'min-h-8 min-w-10 border-2 px-2 font-display text-[15px] font-extrabold tracking-wider uppercase transition-colors',
              tone === 'dark' &&
                (selected
                  ? 'border-white bg-white text-ink'
                  : 'border-ink-line text-white hover:border-white'),
              tone === 'light' &&
                (selected
                  ? 'border-ink bg-ink text-white'
                  : 'border-line text-ink hover:border-ink')
            )}
          >
            {lang}
            <span className="sr-only"> ({LANGUAGE_LABELS[lang]})</span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
