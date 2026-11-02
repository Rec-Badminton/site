import { useI18n } from '@mxreakit/i18n';
import { CircleAlert, CircleCheck, X } from 'lucide-react';
import { dismissToast, useToasts, type ToastItem } from '@/hooks/use-toast';
import { cn } from '@/core/utils';

const Toaster = () => {
  const { t } = useI18n();
  const toasts: ToastItem[] = useToasts();

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 bottom-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2"
    >
      {toasts.map((item: ToastItem) => {
        const Icon = item.variant === 'error' ? CircleAlert : CircleCheck;
        return (
          <div
            key={item.id}
            className={cn(
              'flex animate-slide-up items-start gap-3 bg-ink p-4 text-white shadow-[0_10px_30px_rgba(20,24,22,0.3)]',
              item.variant === 'error' ? 'border-l-4 border-brand' : 'border-l-4 border-[#339900]'
            )}
          >
            <Icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p className="grow font-semibold">{item.title}</p>
            <button
              type="button"
              onClick={() => dismissToast(item.id)}
              aria-label={t('admin.close')}
              className="shrink-0 text-muted-light hover:text-white"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toaster;
