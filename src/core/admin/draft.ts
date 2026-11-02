// Pure helpers over a back office draft: any JSON-like value whose leaves may be picked Files.

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !(value instanceof File);
}

// Every string leaf, e.g. to find the Storage URLs a document references.
export function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectStrings);
  if (isPlainObject(value)) return Object.values(value).flatMap(collectStrings);
  return [];
}

// Replaces every File leaf by the URL it was uploaded to, in parallel.
export async function replaceFiles(
  value: unknown,
  upload: (file: File) => Promise<string>
): Promise<unknown> {
  if (value instanceof File) return upload(value);
  if (Array.isArray(value)) {
    return Promise.all(value.map((item: unknown) => replaceFiles(item, upload)));
  }
  if (isPlainObject(value)) {
    const entries: [string, unknown][] = await Promise.all(
      Object.entries(value).map(
        async ([key, child]: [string, unknown]): Promise<[string, unknown]> => [
          key,
          await replaceFiles(child, upload)
        ]
      )
    );
    return Object.fromEntries(entries);
  }
  return value;
}

// Firestore rejects undefined fields: drop them, along with optional fields left empty.
export function stripUndefined(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripUndefined);
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, child]: [string, unknown]) => child !== undefined)
        .map(([key, child]: [string, unknown]) => [key, stripUndefined(child)])
    );
  }
  return value;
}

// Keeps only the model's fields, so a field the model dropped disappears on the next save.
export function pickModelFields<T extends object>(
  model: T,
  stored: Record<string, unknown> = {}
): T {
  return Object.fromEntries(
    Object.entries(model).map(([key, fallback]: [string, unknown]) => [
      key,
      key in stored ? stored[key] : fallback
    ])
  ) as T;
}

// Rewrites every string leaf, keeping the rest of the value.
export function mapStrings(value: unknown, map: (value: string) => string): unknown {
  if (typeof value === 'string') return map(value);
  if (Array.isArray(value)) return value.map((item: unknown) => mapStrings(item, map));
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]: [string, unknown]) => [key, mapStrings(child, map)])
    );
  }
  return value;
}

const BACKUP_PREFIX: string = 'backup:';

// Swaps every "backup:<path>" leaf for the file at that path of the backup folder.
// file at the root of a backup, holding every content document
export const BACKUP_CONTENT_FILE: string = 'content.json';

// The files of a .zip by their path inside the backup. Zipping the backup/ folder itself
// nests everything under "backup/": paths are read from the folder holding content.json.
export function readZipEntries(entries: Record<string, Uint8Array>): Map<string, Uint8Array> {
  const paths: string[] = Object.keys(entries).filter((path: string) => !path.endsWith('/'));
  const contentPath: string | undefined = paths
    .filter(
      (path: string) => path === BACKUP_CONTENT_FILE || path.endsWith(`/${BACKUP_CONTENT_FILE}`)
    )
    .sort((a: string, b: string) => a.length - b.length)[0];
  const root: string = contentPath ? contentPath.slice(0, -BACKUP_CONTENT_FILE.length) : '';
  return new Map(
    paths
      .filter((path: string) => path.startsWith(root))
      .flatMap((path: string) => {
        const entry: Uint8Array | undefined = entries[path];
        return entry ? [[path.slice(root.length), entry] as const] : [];
      })
  );
}

export function resolveBackupRefs(value: unknown, files: Map<string, File>): unknown {
  if (typeof value === 'string' && value.startsWith(BACKUP_PREFIX)) {
    const path: string = value.slice(BACKUP_PREFIX.length);
    const file: File | undefined = files.get(path);
    if (!file) throw new Error(`Missing backup file: ${path}`);
    return file;
  }
  if (Array.isArray(value)) return value.map((item: unknown) => resolveBackupRefs(item, files));
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]: [string, unknown]) => [
        key,
        resolveBackupRefs(child, files)
      ])
    );
  }
  return value;
}

// Deep equality of two drafts: key order is ignored, list order is not, files compare by identity.
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    return (
      Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((item: unknown, index: number) => isEqual(item, b[index]))
    );
  }
  if (!isPlainObject(a) || !isPlainObject(b)) return false;
  const keys: string[] = Object.keys(a);
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key: string) => key in b && isEqual(a[key], b[key]))
  );
}

// Short random id for a new list item referenced elsewhere (activity, venue, product...).
export function newId(): string {
  return crypto.randomUUID().slice(0, 8);
}
