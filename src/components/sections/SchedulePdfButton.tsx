import { useState } from 'react';
import { useI18n } from '@mxreakit/i18n';
import { FileDown, LoaderCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import type { SiteContent } from '@/core/content/types';
import { cn } from '@/core/utils';

type ExportState = 'idle' | 'loading' | 'error';

interface SchedulePdfButtonProps {
  className?: string;
}

// The PDF renderer is heavy: it is only fetched when the visitor asks for the file.
const SchedulePdfButton = ({ className }: SchedulePdfButtonProps) => {
  const { t } = useI18n();
  const { language, locale } = useLanguage();
  const content: SiteContent = useSiteContent();
  const [state, setState] = useState<ExportState>('idle');

  const exportPdf = async () => {
    setState('loading');
    try {
      const { downloadSchedulePdf } = await import('@/components/pdf/download-schedule');
      await downloadSchedulePdf({ t, language, locale, content });
      setState('idle');
    } catch {
      setState('error');
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={exportPdf}
        disabled={state === 'loading'}
        aria-busy={state === 'loading'}
        className={cn('disabled:cursor-progress disabled:opacity-80', className)}
      >
        {state === 'loading' ? (
          <LoaderCircle className="size-[1.1em] shrink-0 animate-spin" aria-hidden="true" />
        ) : (
          <FileDown className="size-[1.1em] shrink-0" aria-hidden="true" />
        )}
        {t(state === 'loading' ? 'schedule.exporting' : 'schedule.export')}
      </button>
      {state === 'error' && (
        <p role="alert" className="text-sm font-semibold text-brand-dark">
          {t('schedule.exportError')}
        </p>
      )}
    </div>
  );
};

export default SchedulePdfButton;
