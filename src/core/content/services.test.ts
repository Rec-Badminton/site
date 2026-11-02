import { afterEach, describe, expect, it, vi } from 'vitest';
import { EMPTY_CONTENT, EMPTY_SYNCED } from '@/core/content/empty';
import { getDocuments } from '@/core/content/firestore-rest';
import { fetchSiteContent, mergeSiteData } from '@/core/content/services';
import type { SiteData } from '@/core/content/types';

const mockFetch = (response: Partial<Response>) =>
  vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValue({ ok: true, status: 200, ...response } as Response);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getDocuments', () => {
  it('decodes found documents by path and skips missing ones', async () => {
    mockFetch({
      json: () =>
        Promise.resolve([
          {
            found: {
              name: 'projects/test/databases/(default)/documents/content/banner',
              fields: {
                enabled: { booleanValue: false },
                order: { integerValue: '3' },
                label: { mapValue: { fields: { fr: { stringValue: 'Info' } } } },
                tags: { arrayValue: { values: [{ stringValue: 'a' }, { nullValue: null }] } },
                empty: { arrayValue: {} }
              }
            }
          },
          { missing: 'projects/test/databases/(default)/documents/content/shop' }
        ])
    });

    expect(await getDocuments(['content/banner', 'content/shop'])).toEqual({
      'content/banner': {
        enabled: false,
        order: 3,
        label: { fr: 'Info' },
        tags: ['a', null],
        empty: []
      }
    });
  });

  it('fails on an HTTP error', async () => {
    mockFetch({ ok: false, status: 403 });
    await expect(getDocuments(['content/banner'])).rejects.toThrow('403');
  });
});

describe('mergeSiteData', () => {
  it('fills missing documents and fields with their empty shape', () => {
    const data: SiteData = mergeSiteData({
      'content/banner': { enabled: true },
      'synced/interclubs': { updatedAt: '2026-11-02T05:00:00.000Z' }
    });
    expect(data.banner).toEqual({ ...EMPTY_CONTENT.banner, enabled: true });
    expect(data.shop).toEqual(EMPTY_CONTENT.shop);
    expect(data.synced.interclubs).toEqual({
      ...EMPTY_SYNCED.interclubs,
      updatedAt: '2026-11-02T05:00:00.000Z'
    });
  });
});

describe('fetchSiteContent', () => {
  it('renders without synced data when it cannot be read', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (_url, init) =>
      String(init?.body).includes('/synced/')
        ? ({ ok: false, status: 403 } as Response)
        : ({ ok: true, status: 200, json: () => Promise.resolve([]) } as unknown as Response)
    );
    const data: SiteData = await fetchSiteContent();
    expect(data.banner).toEqual(EMPTY_CONTENT.banner);
    expect(data.synced).toEqual(EMPTY_SYNCED);
  });

  it('fails when Firestore cannot be reached, rather than showing stale content', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('offline'));
    await expect(fetchSiteContent()).rejects.toThrow('offline');
  });
});
