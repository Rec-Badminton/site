import { useI18n } from '@mxreakit/i18n';
import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { Construction, ExternalLink, LoaderCircle, RefreshCw, TriangleAlert } from 'lucide-react';
import SectionHeader from '@/components/admin/SectionHeader';
import { SITE_CONTENT_KEY, useSiteContent } from '@/hooks/use-site-content';
import { refreshSynced } from '@/core/admin/sync';
import type { SiteData, SyncedId, SyncState } from '@/core/content/types';

const DATE_FORMAT: Intl.DateTimeFormat = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'medium',
  timeStyle: 'short'
});

const formatDate = (iso: string): string => DATE_FORMAT.format(new Date(iso));

// the last attempt failed after the last success
const hasFailed = (state: SyncState): boolean =>
  Boolean(state.error) && state.attemptedAt > state.updatedAt;

interface SyncCardProps {
  id: SyncedId;
  state: SyncState;
  // what the document holds, e.g. "12 équipes"
  summary: string;
  sources: string[];
}

const SyncCard = ({ id, state, summary, sources }: SyncCardProps) => {
  const { t } = useI18n();
  const queryClient: QueryClient = useQueryClient();
  const refresh = useMutation({
    mutationFn: () => refreshSynced(id),
    // a failure is recorded on the document too: reload it either way
    onSettled: () => queryClient.invalidateQueries({ queryKey: SITE_CONTENT_KEY }),
    meta: { successKey: 'admin.sync.done' }
  });

  return (
    <div className="flex flex-col items-start gap-4 bg-white p-6 md:p-8">
      <h2 className="display-title text-3xl">{t(`admin.sync.${id}.title`)}</h2>
      <p className="text-muted">{t(`admin.sync.${id}.text`)}</p>
      <ul className="flex flex-col gap-1">
        {sources.filter(Boolean).map((source: string) => (
          <li key={source}>
            <a
              href={source}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm break-all text-brand-dark hover:underline"
            >
              {source}
              <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <p className="font-semibold">
        {state.updatedAt
          ? t('admin.sync.updated', formatDate(state.updatedAt))
          : t('admin.sync.never')}
        {state.updatedAt && <span className="font-normal text-muted"> · {summary}</span>}
      </p>
      {hasFailed(state) && (
        <div className="flex w-full gap-3 bg-warning-tint p-4 text-warning">
          <TriangleAlert className="mt-0.5 shrink-0" aria-hidden="true" />
          <p>
            <strong>{t('admin.sync.failedAt', formatDate(state.attemptedAt))}</strong>
            <span className="block text-sm break-words">{state.error}</span>
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={() => refresh.mutate()}
        disabled={refresh.isPending}
        className="btn btn-dark mt-auto disabled:opacity-60"
      >
        {refresh.isPending ? (
          <LoaderCircle className="size-[1.1em] shrink-0 animate-spin" aria-hidden="true" />
        ) : (
          <RefreshCw className="size-[1.1em] shrink-0" aria-hidden="true" />
        )}
        {t(refresh.isPending ? 'admin.sync.running' : 'admin.sync.refresh')}
      </button>
    </div>
  );
};

// Planned sync, waiting for HelloAsso API credentials: the shop stays a manual catalog until then.
const ShopUnderConstruction = () => {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-start gap-4 bg-white p-6 md:p-8">
      <h2 className="display-title text-3xl">{t('admin.sync.shop.title')}</h2>
      <span className="badge inline-flex items-center gap-1.5 bg-warning-tint text-warning">
        <Construction className="size-4 shrink-0" aria-hidden="true" />
        {t('admin.sync.shop.badge')}
      </span>
      <p className="text-muted">{t('admin.sync.shop.text')}</p>
    </div>
  );
};

// Documents the Cloud Functions sync every morning, with a manual refresh.
const SyncSection = () => {
  const { t } = useI18n();
  const { synced, settings }: SiteData = useSiteContent();

  return (
    <>
      <SectionHeader
        title={t('admin.sections.sync.label')}
        description={t('admin.sections.sync.description')}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <SyncCard
          id="interclubs"
          state={synced.interclubs}
          summary={t('admin.sync.interclubs.summary', String(synced.interclubs.teams.length))}
          sources={[settings.links.interclubs]}
        />
        <ShopUnderConstruction />
      </div>
    </>
  );
};

export default SyncSection;
