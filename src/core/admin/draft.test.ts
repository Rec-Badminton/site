import { describe, expect, it } from 'vitest';
import {
  collectStrings,
  isEqual,
  mapStrings,
  newId,
  pickModelFields,
  replaceFiles,
  readZipEntries,
  resolveBackupRefs,
  stripUndefined
} from '@/core/admin/draft';
import { fileHash, toPublicUrl, toStoragePath, uploadPath } from '@/core/admin/storage-paths';

const file = (name: string, type: string): File => new File(['x'], name, { type });

describe('pickModelFields', () => {
  const model: { season: string; results: string[] } = { season: '', results: [] };

  it('keeps stored values and drops fields the model no longer has', () => {
    expect(pickModelFields(model, { season: '2025/2026', teams: ['N3'] })).toEqual({
      season: '2025/2026',
      results: []
    });
  });

  it('falls back to the model for a document never saved', () => {
    expect(pickModelFields(model, undefined)).toEqual(model);
  });
});

describe('collectStrings', () => {
  it('finds every nested string', () => {
    expect(collectStrings({ a: 'one', b: [{ c: 'two' }, 3, null], d: { e: true } })).toEqual([
      'one',
      'two'
    ]);
  });
});

describe('replaceFiles', () => {
  it('uploads every picked file and keeps the rest of the document', async () => {
    const photo: File = file('photo.jpg', 'image/jpeg');
    const logo: File = file('logo.png', 'image/png');
    const result: unknown = await replaceFiles(
      { title: 'Shop', cover: photo, items: [{ logo, price: 15 }] },
      async (picked: File) => `https://cdn.example/${picked.name}`
    );
    expect(result).toEqual({
      title: 'Shop',
      cover: 'https://cdn.example/photo.jpg',
      items: [{ logo: 'https://cdn.example/logo.png', price: 15 }]
    });
  });
});

describe('stripUndefined', () => {
  it('drops undefined fields at any depth, keeping null and empty values', () => {
    expect(stripUndefined({ a: undefined, b: null, c: [{ d: undefined, e: '' }] })).toEqual({
      b: null,
      c: [{ e: '' }]
    });
  });
});

describe('newId', () => {
  it('returns short distinct ids', () => {
    expect(newId()).toHaveLength(8);
    expect(newId()).not.toBe(newId());
  });
});

describe('storage paths', () => {
  it('round-trips a path through its public URL', () => {
    const url: string = toPublicUrl('images/shop/a b.webp');
    expect(url).toContain('?alt=media');
    expect(toStoragePath(url)).toBe('images/shop/a b.webp');
  });

  it('ignores URLs outside the bucket', () => {
    expect(toStoragePath('https://example.org/photo.jpg')).toBeNull();
    expect(toStoragePath('asset:photos/club-mascot.jpg')).toBeNull();
  });

  it('files images and documents apart, named after their hash', () => {
    expect(uploadPath(file('Hoodie.PNG', 'image/png'), 'shop', 'ab12')).toBe(
      'images/shop/ab12.png'
    );
    expect(uploadPath(file('livret.pdf', 'application/pdf'), 'settings', 'cd34')).toBe(
      'files/settings/cd34.pdf'
    );
  });

  it('hashes identical bytes identically', async () => {
    const hash: string = await fileHash(new Blob(['abc']));
    expect(hash).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    expect(await fileHash(new Blob(['abc']))).toBe(hash);
  });
});

describe('isEqual', () => {
  it('ignores key order but not list order', () => {
    expect(isEqual({ a: 1, b: [{ c: 'x' }] }, { b: [{ c: 'x' }], a: 1 })).toBe(true);
    expect(isEqual([1, 2], [2, 1])).toBe(false);
    expect(isEqual({ a: 1 }, { a: 1, b: undefined })).toBe(false);
  });

  it('compares files by identity', () => {
    const picked: File = file('a.png', 'image/png');
    expect(isEqual({ src: picked }, { src: picked })).toBe(true);
    expect(isEqual({ src: picked }, { src: 'a.png' })).toBe(false);
  });
});

describe('resolveBackupRefs', () => {
  it('replaces backup refs by the matching files', () => {
    const logo: File = file('logo.png', 'image/png');
    const files: Map<string, File> = new Map([['images/logo.png', logo]]);
    expect(resolveBackupRefs({ logo: 'backup:images/logo.png', url: 'https://x' }, files)).toEqual({
      logo,
      url: 'https://x'
    });
  });

  it('fails on a file missing from the folder', () => {
    expect(() => resolveBackupRefs(['backup:images/none.png'], new Map())).toThrow('none.png');
  });
});

describe('mapStrings', () => {
  it('rewrites string leaves only', () => {
    expect(
      mapStrings({ a: 'x', b: [1, 'y'], c: { d: true } }, (value: string) => `${value}!`)
    ).toEqual({
      a: 'x!',
      b: [1, 'y!'],
      c: { d: true }
    });
  });
});

describe('readZipEntries', () => {
  const bytes: Uint8Array = new Uint8Array([1]);

  it('reads an exported backup by its paths', () => {
    const entries: Map<string, Uint8Array> = readZipEntries({
      'content.json': bytes,
      'images/logo.webp': bytes
    });
    expect([...entries.keys()]).toEqual(['content.json', 'images/logo.webp']);
  });

  it('reads a zipped backup folder from the folder holding content.json', () => {
    const entries: Map<string, Uint8Array> = readZipEntries({
      'backup/': new Uint8Array(),
      'backup/content.json': bytes,
      'backup/images/logo.webp': bytes,
      '__MACOSX/backup/._content.json': bytes
    });
    expect([...entries.keys()]).toEqual(['content.json', 'images/logo.webp']);
  });
});
