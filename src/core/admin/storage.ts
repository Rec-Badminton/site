import {
  deleteObject,
  getMetadata,
  listAll,
  ref,
  type FullMetadata,
  type ListResult,
  type StorageReference
} from 'firebase/storage';
import { exportContent, storedPaths } from '@/core/admin/content';
import { guard, storage } from '@/core/admin/firebase';
import { revisionFiles } from '@/core/admin/revisions';
import { toPublicUrl } from '@/core/admin/storage-paths';

// folders the back office uploads to
const ROOTS: string[] = ['images', 'files'];

export interface StoredFile {
  path: string;
  url: string;
  size: number;
  contentType: string;
  // referenced by a saved content document, or kept for a revision
  used: boolean;
}

async function listRecursively(folder: StorageReference): Promise<StorageReference[]> {
  const { items, prefixes }: ListResult = await listAll(folder);
  const nested: StorageReference[][] = await Promise.all(prefixes.map(listRecursively));
  return [...items, ...nested.flat()];
}

// Every uploaded file, flagged as used when the saved content or a revision still points at it.
export function listStoredFiles(): Promise<StoredFile[]> {
  return guard(async () => {
    const [content, history, references] = await Promise.all([
      exportContent(),
      revisionFiles(),
      Promise.all(ROOTS.map((root: string) => listRecursively(ref(storage, root))))
    ]);
    const used: Set<string> = new Set([...storedPaths(content), ...history]);
    const files: StoredFile[] = await Promise.all(
      references.flat().map(async (item: StorageReference) => {
        const metadata: FullMetadata = await getMetadata(item);
        return {
          path: item.fullPath,
          url: toPublicUrl(item.fullPath),
          size: metadata.size,
          contentType: metadata.contentType ?? '',
          used: used.has(item.fullPath)
        };
      })
    );
    return files.sort((a: StoredFile, b: StoredFile) => a.path.localeCompare(b.path));
  });
}

export function deleteStoredFiles(paths: string[]): Promise<void> {
  return guard(async () => {
    await Promise.all(paths.map((path: string) => deleteObject(ref(storage, path))));
  });
}
