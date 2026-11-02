import { useState } from 'react';
import { useI18n } from '@mxreakit/i18n';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
  type UseQueryResult
} from '@tanstack/react-query';
import { History, LoaderCircle, RotateCcw, Save } from 'lucide-react';
import QueryState from '@/components/admin/QueryState';
import { confirmAction } from '@/hooks/use-confirm';
import { REVISIONS_KEY, useRevisionWarning } from '@/hooks/use-admin-content';
import { SITE_CONTENT_KEY } from '@/hooks/use-site-content';
import {
  MAX_REVISIONS,
  listRevisions,
  recordRevision,
  restoreRevision,
  type Revision
} from '@/core/admin/revisions';
import { CONTENT_IDS } from '@/core/content/empty';
import type { ContentId } from '@/core/content/types';

const PAGE_SIZE: number = 10;

const DATE_FORMAT: Intl.DateTimeFormat = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short'
});

const Spinner = () => (
  <LoaderCircle className="size-[1.1em] shrink-0 animate-spin" aria-hidden="true" />
);

const useSourceLabel = () => {
  const { t } = useI18n();
  return (revision: Revision): string => {
    if (CONTENT_IDS.includes(revision.source as ContentId)) {
      return t('admin.revisions.section', t(`admin.sections.${revision.source}.label`));
    }
    if (revision.source === 'restore' && revision.restoredFrom) {
      return t('admin.revisions.restore', DATE_FORMAT.format(revision.restoredFrom));
    }
    return t(`admin.revisions.${revision.source}`);
  };
};

interface RevisionListProps {
  revisions: Revision[];
  restoring: string | null;
  onRestore: (revision: Revision) => void;
}

const RevisionList = ({ revisions, restoring, onRestore }: RevisionListProps) => {
  const { t } = useI18n();
  const sourceLabel = useSourceLabel();
  const [shown, setShown] = useState<number>(PAGE_SIZE);

  if (!revisions.length) return <p className="text-muted">{t('admin.revisions.none')}</p>;

  return (
    <>
      <ol className="flex w-full flex-col divide-y divide-line border border-line">
        {revisions.slice(0, shown).map((revision: Revision, index: number) => (
          <li key={revision.id} className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3">
            <div className="min-w-0 grow">
              <p className="font-semibold">{sourceLabel(revision)}</p>
              <p className="text-sm text-muted">
                <time dateTime={revision.createdAt.toISOString()}>
                  {DATE_FORMAT.format(revision.createdAt)}
                </time>
                {revision.author && ` · ${revision.author}`}
              </p>
            </div>
            {index === 0 ? (
              <span className="badge bg-ink text-white">{t('admin.revisions.current')}</span>
            ) : (
              <button
                type="button"
                disabled={restoring !== null}
                onClick={() => onRestore(revision)}
                className="btn btn-outline-dark min-h-10 px-4 py-1.5 text-lg disabled:opacity-40"
              >
                {restoring === revision.id ? (
                  <Spinner />
                ) : (
                  <RotateCcw className="size-[1.1em] shrink-0" aria-hidden="true" />
                )}
                {t('admin.revisions.restoreAction')}
              </button>
            )}
          </li>
        ))}
      </ol>
      {shown < revisions.length && (
        <button
          type="button"
          onClick={() => setShown(shown + PAGE_SIZE)}
          className="font-bold text-brand-dark hover:underline"
        >
          {t('admin.revisions.more', String(revisions.length - shown))}
        </button>
      )}
    </>
  );
};

// Automatic history of the whole site: one revision per save, restorable in one click.
const RevisionHistory = () => {
  const { t } = useI18n();
  const queryClient: QueryClient = useQueryClient();
  const warn = useRevisionWarning();
  const query: UseQueryResult<Revision[]> = useQuery({
    queryKey: REVISIONS_KEY,
    queryFn: listRevisions
  });

  const refresh = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin'] }),
      queryClient.invalidateQueries({ queryKey: SITE_CONTENT_KEY })
    ]);

  const restore = useMutation({
    mutationFn: restoreRevision,
    onSuccess: warn,
    onSettled: refresh,
    meta: { successKey: 'admin.revisions.restored' }
  });

  const checkpoint = useMutation({
    mutationFn: () => recordRevision('manual'),
    onSuccess: warn,
    onSettled: () => queryClient.invalidateQueries({ queryKey: REVISIONS_KEY })
  });

  const confirmRestore = async (revision: Revision) => {
    const confirmed: boolean = await confirmAction({
      title: 'admin.revisions.confirmTitle',
      text: 'admin.revisions.confirm',
      confirmLabel: 'admin.revisions.restoreAction',
      danger: true
    });
    if (confirmed) restore.mutate(revision);
  };

  return (
    <div className="flex flex-col items-start gap-4 bg-white p-6 md:p-8">
      <div className="flex w-full flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-[1_1_420px]">
          <h2 className="display-title flex items-center gap-3 text-3xl">
            <History className="size-[0.9em] shrink-0 text-brand" aria-hidden="true" />
            {t('admin.revisions.title')}
          </h2>
          <p className="mt-2 text-muted">{t('admin.revisions.text', String(MAX_REVISIONS))}</p>
        </div>
        <button
          type="button"
          onClick={() => checkpoint.mutate()}
          disabled={checkpoint.isPending || restore.isPending}
          className="btn btn-dark disabled:opacity-60"
        >
          {checkpoint.isPending ? (
            <Spinner />
          ) : (
            <Save className="size-[1.1em] shrink-0" aria-hidden="true" />
          )}
          {t('admin.revisions.checkpoint')}
        </button>
      </div>
      <QueryState query={query}>
        {(revisions: Revision[]) => (
          <RevisionList
            revisions={revisions}
            restoring={restore.isPending ? (restore.variables?.id ?? null) : null}
            onRestore={confirmRestore}
          />
        )}
      </QueryState>
    </div>
  );
};

export default RevisionHistory;
