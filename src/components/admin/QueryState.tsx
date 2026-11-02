import type { ReactNode } from 'react';
import { useI18n } from '@mxreakit/i18n';
import type { UseQueryResult } from '@tanstack/react-query';

interface QueryStateProps<T> {
  query: UseQueryResult<T>;
  children: (data: T) => ReactNode;
}

// Loading text, then a retry on failure, then the loaded data.
const QueryState = <T,>({ query, children }: QueryStateProps<T>) => {
  const { t } = useI18n();

  if (query.isPending) return <p className="text-muted">{t('admin.loading')}</p>;
  if (query.isError) {
    return (
      <div className="flex flex-col items-start gap-4 bg-white p-8">
        <p className="font-semibold">{t('admin.form.loadError')}</p>
        <button type="button" onClick={() => query.refetch()} className="btn btn-dark">
          {t('admin.form.retry')}
        </button>
      </div>
    );
  }
  return <>{children(query.data)}</>;
};

export default QueryState;
