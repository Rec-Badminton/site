import { useEffect } from 'react';
import { useQueryClient, type QueryClient } from '@tanstack/react-query';
import { useI18n } from '@mxreakit/i18n';
import { toast } from '@/hooks/use-toast';
import { DataError } from '@/core/errors';

const toErrorKey = (error: unknown): string =>
  error instanceof DataError ? error.message : 'admin.errors.unexpected';

// Toasts every failed query and mutation, plus the meta.successKey of successful mutations.
const useDataToast = () => {
  const queryClient: QueryClient = useQueryClient();
  const { t } = useI18n();

  useEffect(() => {
    const showError = (error: unknown) => {
      const key: string = toErrorKey(error);
      toast({ id: key, title: t(key), variant: 'error' });
    };

    const unsubscribeQueries = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'error') showError(event.action.error);
    });

    const unsubscribeMutations = queryClient.getMutationCache().subscribe((event) => {
      if (event.type !== 'updated') return;
      const { action, mutation } = event;
      if (action.type === 'error') showError(action.error);
      const successKey: string | undefined = mutation.meta?.successKey;
      if (action.type === 'success' && successKey) {
        toast({ id: successKey, title: t(successKey), variant: 'success' });
      }
    });

    return () => {
      unsubscribeQueries();
      unsubscribeMutations();
    };
  }, [queryClient, t]);
};

export { useDataToast };
