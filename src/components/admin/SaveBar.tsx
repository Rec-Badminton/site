import { useI18n } from '@mxreakit/i18n';
import { LoaderCircle, RotateCcw, Save } from 'lucide-react';

interface SaveBarProps {
  dirty: boolean;
  isPending: boolean;
  onReset: () => void;
}

// Sticks to the bottom of a back office form; the save button submits it.
const SaveBar = ({ dirty, isPending, onReset }: SaveBarProps) => {
  const { t } = useI18n();

  return (
    <div className="sticky bottom-0 z-10 mt-8 flex flex-wrap items-center justify-end gap-3 border-t-3 border-brand bg-white px-5 py-3 shadow-[0_-8px_24px_rgba(20,24,22,0.08)]">
      <p className="mr-auto font-semibold text-muted" aria-live="polite">
        {t(dirty ? 'admin.form.unsaved' : 'admin.form.saved')}
      </p>
      <button
        type="button"
        onClick={onReset}
        disabled={!dirty || isPending}
        className="btn btn-outline-dark min-h-10 px-4 py-1.5 text-lg disabled:opacity-40"
      >
        <RotateCcw className="size-[1.1em] shrink-0" aria-hidden="true" />
        {t('admin.form.reset')}
      </button>
      <button
        type="submit"
        disabled={!dirty || isPending}
        aria-busy={isPending}
        className="btn btn-primary min-h-10 px-4 py-1.5 text-lg disabled:opacity-40"
      >
        {isPending ? (
          <LoaderCircle className="size-[1.1em] shrink-0 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="size-[1.1em] shrink-0" aria-hidden="true" />
        )}
        {t(isPending ? 'admin.form.saving' : 'admin.form.save')}
      </button>
    </div>
  );
};

export default SaveBar;
