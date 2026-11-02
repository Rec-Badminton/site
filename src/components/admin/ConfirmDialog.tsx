import { useEffect, useRef } from 'react';
import { useI18n } from '@mxreakit/i18n';
import { answerConfirm, useConfirmRequest, type ConfirmRequest } from '@/hooks/use-confirm';
import { cn } from '@/core/utils';

// Modal answering confirmAction(); mounted once by the back office.
const ConfirmDialog = () => {
  const { t } = useI18n();
  const request: ConfirmRequest | null = useConfirmRequest();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog: HTMLDialogElement | null = dialogRef.current;
    if (!dialog) return;
    if (request && !dialog.open) dialog.showModal?.();
    if (!request && dialog.open) dialog.close();
  }, [request]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirm-title"
      // Escape closes the dialog: that is a cancel
      onClose={() => answerConfirm(false)}
      // a click that lands on the dialog itself is a click on the backdrop
      onClick={(event) => event.target === dialogRef.current && answerConfirm(false)}
      className="m-auto w-[min(100%-1.5rem,30rem)] bg-white p-0 text-ink backdrop:bg-ink-deep/70 open:motion-safe:animate-dialog-in"
    >
      {request && (
        <div className="flex flex-col gap-4 border-t-6 border-brand p-6 md:p-8">
          <h2 id="confirm-title" className="display-title text-3xl">
            {t(request.title)}
          </h2>
          <p className="text-muted">{t(request.text)}</p>
          <div className="mt-2 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => answerConfirm(false)}
              className="btn btn-outline-dark min-h-10 px-4 py-1.5 text-lg"
            >
              {t('admin.confirm.cancel')}
            </button>
            <button
              type="button"
              autoFocus
              onClick={() => answerConfirm(true)}
              className={cn(
                'btn min-h-10 px-4 py-1.5 text-lg',
                request.danger ? 'btn-primary' : 'btn-dark'
              )}
            >
              {t(request.confirmLabel)}
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
};

export default ConfirmDialog;
