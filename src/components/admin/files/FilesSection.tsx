import { useState, type ChangeEvent } from 'react';
import { useI18n } from '@mxreakit/i18n';
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
  type UseQueryResult
} from '@tanstack/react-query';
import { FileText, Trash2 } from 'lucide-react';
import QueryState from '@/components/admin/QueryState';
import SectionHeader from '@/components/admin/SectionHeader';
import { confirmAction } from '@/hooks/use-confirm';
import { deleteStoredFiles, listStoredFiles, type StoredFile } from '@/core/admin/storage';
import { cn } from '@/core/utils';

const FILES_KEY: string[] = ['admin', 'storage'];

// 1234567 -> "1,2 Mo"
const formatSize = (bytes: number): string =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} Ko`
    : `${(bytes / 1024 / 1024).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Mo`;

const totalSize = (files: StoredFile[]): number =>
  files.reduce((total: number, file: StoredFile) => total + file.size, 0);

const FileCard = ({ file, onDelete }: { file: StoredFile; onDelete: () => void }) => {
  const { t } = useI18n();
  return (
    <li className={cn('flex flex-col bg-white', !file.used && 'outline-2 outline-brand')}>
      <a
        href={file.url}
        target="_blank"
        rel="noreferrer"
        className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-sand"
      >
        {file.contentType.startsWith('image/') ? (
          <img src={file.url} alt="" loading="lazy" className="size-full object-contain" />
        ) : (
          <FileText className="size-12 text-muted" aria-hidden="true" />
        )}
      </a>
      <div className="flex items-center gap-2 p-3">
        <div className="min-w-0 grow">
          <p className="truncate text-sm font-semibold" title={file.path}>
            {file.path}
          </p>
          <p className="text-sm text-muted">
            {formatSize(file.size)} ·{' '}
            <span className={cn(!file.used && 'font-bold text-brand-dark')}>
              {t(file.used ? 'admin.files.used' : 'admin.files.unused')}
            </span>
          </p>
        </div>
        {!file.used && (
          <button
            type="button"
            onClick={onDelete}
            aria-label={t('admin.list.remove')}
            title={t('admin.list.remove')}
            className="flex size-9 shrink-0 items-center justify-center hover:bg-brand hover:text-white"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </li>
  );
};

const FilesList = ({ files }: { files: StoredFile[] }) => {
  const { t } = useI18n();
  const queryClient: QueryClient = useQueryClient();
  const [onlyUnused, setOnlyUnused] = useState<boolean>(false);
  const unused: StoredFile[] = files.filter((file: StoredFile) => !file.used);
  const shown: StoredFile[] = onlyUnused ? unused : files;

  const remove = useMutation({
    mutationFn: deleteStoredFiles,
    onSettled: () => queryClient.invalidateQueries({ queryKey: FILES_KEY }),
    meta: { successKey: 'admin.files.deleted' }
  });

  const confirmRemove = async (paths: string[]) => {
    const confirmed: boolean = await confirmAction({
      title: 'admin.files.confirmTitle',
      text: 'admin.files.confirmText',
      confirmLabel: 'admin.list.remove',
      danger: true
    });
    if (confirmed) remove.mutate(paths);
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 bg-white p-5">
        <p className="grow font-semibold">
          {t('admin.files.summary', String(files.length))} · {formatSize(totalSize(files))}
          {' · '}
          <span className={cn(unused.length > 0 && 'text-brand-dark')}>
            {t('admin.files.unusedCount', String(unused.length))}
          </span>
        </p>
        <label className="flex cursor-pointer items-center gap-3 font-semibold">
          <input
            type="checkbox"
            checked={onlyUnused}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setOnlyUnused(event.target.checked)}
            className="size-5 accent-brand"
          />
          {t('admin.files.onlyUnused')}
        </label>
        <button
          type="button"
          disabled={!unused.length || remove.isPending}
          onClick={() => confirmRemove(unused.map((file: StoredFile) => file.path))}
          className="btn btn-primary min-h-10 px-4 py-1.5 text-lg disabled:opacity-40"
        >
          <Trash2 className="size-[1.1em] shrink-0" aria-hidden="true" />
          {t('admin.files.deleteUnused')}
        </button>
      </div>
      {shown.length === 0 ? (
        <p className="text-muted">{t('admin.files.none')}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {shown.map((file: StoredFile) => (
            <FileCard key={file.path} file={file} onDelete={() => confirmRemove([file.path])} />
          ))}
        </ul>
      )}
    </>
  );
};

// Explorer of Firebase Storage: spots the uploads no content uses anymore.
const FilesSection = () => {
  const { t } = useI18n();
  const query: UseQueryResult<StoredFile[]> = useQuery({
    queryKey: FILES_KEY,
    queryFn: listStoredFiles
  });

  return (
    <>
      <SectionHeader
        title={t('admin.sections.files.label')}
        description={t('admin.sections.files.description')}
      />
      <QueryState query={query}>{(files: StoredFile[]) => <FilesList files={files} />}</QueryState>
    </>
  );
};

export default FilesSection;
