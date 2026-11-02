import { doc, getDoc, setDoc, type DocumentSnapshot } from 'firebase/firestore/lite';
import { FirebaseError } from 'firebase/app';
import {
  deleteObject,
  getMetadata,
  ref,
  uploadBytes,
  type StorageReference
} from 'firebase/storage';
import { db, guard, storage, toDataError } from '@/core/admin/firebase';
import { optimizeImage } from '@/core/admin/image-optimizer';
import { collectStrings, pickModelFields, replaceFiles, stripUndefined } from '@/core/admin/draft';
import { fileHash, toPublicUrl, toStoragePath, uploadPath } from '@/core/admin/storage-paths';
import { CONTENT_COLLECTION, CONTENT_IDS, EMPTY_CONTENT } from '@/core/content/empty';
import type { ContentId, SiteContent } from '@/core/content/types';

// Every section the back office edits, keyed by id.
export type EditableContent = Partial<SiteContent>;

// Read through the SDK: the back office must surface errors, and sees saves immediately.
export function getContent<Id extends ContentId>(id: Id): Promise<SiteContent[Id]> {
  return guard(async () => {
    const snapshot: DocumentSnapshot = await getDoc(doc(db, CONTENT_COLLECTION, id));
    return pickModelFields(EMPTY_CONTENT[id], snapshot.data());
  });
}

export async function exportContent(): Promise<EditableContent> {
  const documents: SiteContent[ContentId][] = await Promise.all(CONTENT_IDS.map(getContent));
  return Object.fromEntries(
    CONTENT_IDS.map((id: ContentId, index: number) => [id, documents[index]])
  );
}

// Storage paths of the files a value points at, each once.
export function storedPaths(value: unknown): string[] {
  return [
    ...new Set(
      collectStrings(value)
        .map(toStoragePath)
        .filter((path: string | null) => path !== null)
    )
  ];
}

async function exists(target: StorageReference): Promise<boolean> {
  try {
    await getMetadata(target);
    return true;
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'storage/object-not-found') return false;
    throw error;
  }
}

interface Upload {
  url: string;
  // false when the very same file was already stored
  created: boolean;
}

// Stores a picked file once: the same source file always lands on the same path.
async function uploadFile(source: File, folder: string): Promise<Upload> {
  const hash: string = await fileHash(source);
  const file: File = source.type.startsWith('image/') ? await optimizeImage(source) : source;
  const path: string = uploadPath(file, folder, hash);
  const target: StorageReference = ref(storage, path);
  if (await exists(target)) return { url: toPublicUrl(path), created: false };

  // the download attribute is ignored cross-origin: documents ask for a download themselves
  const disposition: string = file.type.startsWith('image/') ? 'inline' : 'attachment';
  await uploadBytes(target, file, {
    contentType: file.type,
    cacheControl: 'public, max-age=31536000, immutable',
    // keeps the original name when a visitor saves the file
    contentDisposition: `${disposition}; filename*=UTF-8''${encodeURIComponent(source.name)}`
  });
  return { url: toPublicUrl(path), created: true };
}

// Best effort: a leftover file must never fail the user action.
export async function deleteStoredPaths(paths: string[]): Promise<void> {
  const results: PromiseSettledResult<void>[] = await Promise.allSettled(
    paths.map((path: string) => deleteObject(ref(storage, path)))
  );
  results
    .filter((result: PromiseSettledResult<void>) => result.status === 'rejected')
    .forEach((result: PromiseRejectedResult) => console.warn(result.reason));
}

// Uploads the picked files and writes the document. Files it stops referencing stay:
// revisions may still need them, they are deleted once no revision does (see revisions.ts).
export async function saveContent<Id extends ContentId>(
  id: Id,
  draft: SiteContent[Id]
): Promise<void> {
  const uploaded: string[] = [];

  try {
    const data: unknown = stripUndefined(
      await replaceFiles(draft, async (file: File) => {
        const { url, created }: Upload = await uploadFile(file, id);
        // a failed save only removes the files it added
        if (created) uploaded.push(url);
        return url;
      })
    );
    await setDoc(doc(db, CONTENT_COLLECTION, id), data as Record<string, unknown>);
  } catch (error) {
    await deleteStoredPaths(storedPaths(uploaded));
    throw toDataError(error);
  }
}
