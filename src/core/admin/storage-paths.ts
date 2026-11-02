const STORAGE_BASE_URL: string = `https://firebasestorage.googleapis.com/v0/b/${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}/o/`;

// Tokenless download URL; relies on public read access in storage.rules.
export function toPublicUrl(path: string): string {
  return `${STORAGE_BASE_URL}${encodeURIComponent(path)}?alt=media`;
}

// Storage path of a URL built by toPublicUrl, or null for any other URL.
export function toStoragePath(url: string): string | null {
  if (!url.startsWith(STORAGE_BASE_URL)) return null;
  return decodeURIComponent(url.slice(STORAGE_BASE_URL.length).split('?', 1)[0] ?? '');
}

// "images/<folder>/<hash>.webp" for an image, "files/<folder>/<hash>.pdf" otherwise.
// Named after the content: the same file is stored once, and can be cached forever.
export function uploadPath(file: File, folder: string, hash: string): string {
  const dotIndex: number = file.name.lastIndexOf('.');
  const extension: string = dotIndex > 0 ? file.name.slice(dotIndex).toLowerCase() : '';
  const root: string = file.type.startsWith('image/') ? 'images' : 'files';
  return `${root}/${folder}/${hash}${extension}`;
}

// Hex SHA-256 of a file's bytes.
export async function fileHash(file: Blob): Promise<string> {
  const digest: ArrayBuffer = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
  return Array.from(new Uint8Array(digest), (byte: number) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
}
