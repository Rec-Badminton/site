import { strFromU8, strToU8, unzipSync, zipSync, type Unzipped, type Zippable } from 'fflate';
import {
  exportContent,
  getContent,
  saveContent,
  storedPaths,
  type EditableContent
} from '@/core/admin/content';
import {
  BACKUP_CONTENT_FILE,
  mapStrings,
  readZipEntries,
  resolveBackupRefs
} from '@/core/admin/draft';
import { recordRevision } from '@/core/admin/revisions';
import { toStoragePath } from '@/core/admin/storage-paths';
import { CONTENT_IDS } from '@/core/content/empty';
import type { ContentId, SiteContent } from '@/core/content/types';
import { DataError } from '@/core/errors';

const BACKUP_PREFIX: string = 'backup:';

const MIME_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  pdf: 'application/pdf'
};

// Zip of content.json and the files it uses, which it points at with "backup:<path>".
export async function exportBackup(): Promise<Blob> {
  const content: EditableContent = await exportContent();
  const files: Map<string, string> = new Map();
  const portable: unknown = mapStrings(content, (value: string) => {
    const path: string | null = toStoragePath(value);
    if (!path) return value;
    files.set(path, value);
    return `${BACKUP_PREFIX}${path}`;
  });

  const zip: Zippable = {
    [BACKUP_CONTENT_FILE]: strToU8(`${JSON.stringify(portable, null, 2)}\n`)
  };
  try {
    await Promise.all(
      [...files].map(async ([path, url]: [string, string]) => {
        const response: Response = await fetch(url);
        if (!response.ok) throw new Error(`${path}: ${response.status}`);
        zip[path] = new Uint8Array(await response.arrayBuffer());
      })
    );
  } catch (error) {
    console.error(error);
    throw new DataError('admin.backup.downloadFailed');
  }
  return new Blob([zipSync(zip, { level: 0 }) as Uint8Array<ArrayBuffer>], {
    type: 'application/zip'
  });
}

const toFile = (path: string, bytes: Uint8Array): File => {
  const extension: string = path.slice(path.lastIndexOf('.') + 1).toLowerCase();
  return new File([bytes as Uint8Array<ArrayBuffer>], path.slice(path.lastIndexOf('/') + 1), {
    type: MIME_TYPES[extension] ?? 'application/octet-stream'
  });
};

async function readBackup(zip: File): Promise<Map<string, File>> {
  const entries: Unzipped = unzipSync(new Uint8Array(await zip.arrayBuffer()));
  return new Map(
    [...readZipEntries(entries)].map(([path, bytes]: [string, Uint8Array]) => [
      path,
      toFile(path, bytes)
    ])
  );
}

// Restores a backup: its content.json, and the files its "backup:" refs point to.
// Recorded as one revision; false when that revision failed.
export async function restoreContent(zip: File): Promise<boolean> {
  const files: Map<string, File> = await readBackup(zip);
  const contentFile: File | undefined = files.get(BACKUP_CONTENT_FILE);
  if (!contentFile) throw new DataError('admin.backup.noContent');

  let resolved: Partial<Record<ContentId, unknown>>;
  try {
    const backup: unknown = JSON.parse(strFromU8(new Uint8Array(await contentFile.arrayBuffer())));
    resolved = resolveBackupRefs(backup, files) as Partial<Record<ContentId, unknown>>;
  } catch (error) {
    console.error(error);
    throw new DataError('admin.backup.invalid');
  }

  const discarded: string[] = [];
  // one document after the other: a failure leaves the next ones untouched
  for (const id of CONTENT_IDS.filter((key: ContentId) => key in resolved)) {
    discarded.push(...storedPaths(await getContent(id)));
    await saveContent(id, resolved[id] as SiteContent[ContentId]);
  }
  return recordRevision('import', discarded);
}
