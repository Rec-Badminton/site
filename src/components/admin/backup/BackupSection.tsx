import { type ChangeEvent, type ReactNode } from 'react';
import { useI18n } from '@mxreakit/i18n';
import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { Download, FileArchive, LoaderCircle } from 'lucide-react';
import SectionHeader from '@/components/admin/SectionHeader';
import RevisionHistory from '@/components/admin/backup/RevisionHistory';
import { confirmAction } from '@/hooks/use-confirm';
import { useRevisionWarning } from '@/hooks/use-admin-content';
import { SITE_CONTENT_KEY } from '@/hooks/use-site-content';
import { exportBackup, restoreContent } from '@/core/admin/backup';

// what a backup .zip holds
const FORMAT: string = `content.json
images/<section>/<fichier>.webp
files/<section>/<fichier>.pdf`;

const download = (blob: Blob, name: string) => {
  const url: string = URL.createObjectURL(blob);
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  // some browsers read the blob after click() returns
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const Card = ({ title, text, children }: { title: string; text: string; children?: ReactNode }) => (
  <div className="flex flex-col items-start gap-4 bg-white p-6 md:p-8">
    <h2 className="display-title text-3xl">{title}</h2>
    <p className="text-muted">{text}</p>
    {children}
  </div>
);

const Spinner = () => (
  <LoaderCircle className="size-[1.1em] shrink-0 animate-spin" aria-hidden="true" />
);

const PICKER_CLASS: string =
  'btn cursor-pointer has-disabled:pointer-events-none has-disabled:opacity-60 has-focus-visible:outline-2 has-focus-visible:outline-brand';

const BackupSection = () => {
  const { t } = useI18n();
  const queryClient: QueryClient = useQueryClient();
  const warn = useRevisionWarning();

  const exportAll = useMutation({
    mutationFn: exportBackup,
    onSuccess: (blob: Blob) =>
      download(blob, `rec-badminton-sauvegarde-${new Date().toISOString().slice(0, 10)}.zip`)
  });

  const restore = useMutation({
    mutationFn: restoreContent,
    onSuccess: warn,
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin'] }),
        queryClient.invalidateQueries({ queryKey: SITE_CONTENT_KEY })
      ]),
    meta: { successKey: 'admin.backup.restored' }
  });

  const pick = async (event: ChangeEvent<HTMLInputElement>) => {
    const zip: File | undefined = event.target.files?.[0];
    // allow picking the same file again
    event.target.value = '';
    if (!zip) return;
    const confirmed: boolean = await confirmAction({
      title: 'admin.backup.confirmTitle',
      text: 'admin.backup.confirm',
      confirmLabel: 'admin.backup.restoreAction',
      danger: true
    });
    if (confirmed) restore.mutate(zip);
  };

  return (
    <>
      <SectionHeader
        title={t('admin.sections.backup.label')}
        description={t('admin.sections.backup.description')}
      />
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <RevisionHistory />
        </div>

        <Card title={t('admin.backup.exportTitle')} text={t('admin.backup.exportText')}>
          <button
            type="button"
            onClick={() => exportAll.mutate()}
            disabled={exportAll.isPending}
            className="btn btn-dark disabled:opacity-60"
          >
            {exportAll.isPending ? (
              <Spinner />
            ) : (
              <Download className="size-[1.1em] shrink-0" aria-hidden="true" />
            )}
            {t(exportAll.isPending ? 'admin.backup.exporting' : 'admin.backup.export')}
          </button>
        </Card>

        <Card title={t('admin.backup.restoreTitle')} text={t('admin.backup.restoreText')}>
          <label className={`${PICKER_CLASS} btn-primary`}>
            {restore.isPending ? (
              <Spinner />
            ) : (
              <FileArchive className="size-[1.1em] shrink-0" aria-hidden="true" />
            )}
            {t(restore.isPending ? 'admin.backup.restoring' : 'admin.backup.pickZip')}
            <input
              type="file"
              accept=".zip,application/zip"
              disabled={restore.isPending}
              onChange={pick}
              className="sr-only"
            />
          </label>
        </Card>

        <div className="lg:col-span-2">
          <Card title={t('admin.backup.formatTitle')} text={t('admin.backup.formatText')}>
            <pre className="w-full overflow-x-auto bg-ink p-4 text-sm text-white">{FORMAT}</pre>
            <p className="text-sm text-muted">{t('admin.backup.formatRefs')}</p>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BackupSection;
