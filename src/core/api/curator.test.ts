import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchFeed, type NewsPost } from '@/core/api/curator';

const basePost = {
  id: 1,
  network_name: 'Instagram',
  source_created_at: '2026-10-20T18:00:00Z',
  text: '  Big win tonight!\nREC 1 beat Betton 5-3.\n\nWell played.  ',
  image: 'small.jpg',
  image_large: 'large.jpg',
  has_video: 0,
  url: 'https://www.instagram.com/p/abc',
  likes: 12,
  comments: 3
};

function mockFetch(response: Partial<Response>): ReturnType<typeof vi.fn> {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('fetchFeed', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests the feed with a limit', async () => {
    const fetchMock = mockFetch({ ok: true, json: async () => ({ posts: [] }) });
    await fetchFeed('feed-id', 8);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.curator.io/restricted/feeds/feed-id/posts?limit=8'
    );
  });

  it('maps Curator posts to news posts', async () => {
    mockFetch({ ok: true, json: async () => ({ posts: [basePost] }) });
    const [post]: NewsPost[] = await fetchFeed('feed-id', 8);
    expect(post).toEqual({
      id: 1,
      network: 'Instagram',
      date: new Date('2026-10-20T18:00:00Z'),
      title: 'Big win tonight!',
      body: 'REC 1 beat Betton 5-3.\n\nWell played.',
      image: 'large.jpg',
      isVideo: false,
      url: 'https://www.instagram.com/p/abc',
      likes: 12,
      comments: 3
    });
  });

  it('falls back on the small image, then none', async () => {
    mockFetch({
      ok: true,
      json: async () => ({
        posts: [
          { ...basePost, id: 1, image_large: '' },
          { ...basePost, id: 2, image_large: '', image: '' }
        ]
      })
    });
    const posts: NewsPost[] = await fetchFeed('feed-id', 8);
    expect(posts.map((post: NewsPost) => post.image)).toEqual(['small.jpg', null]);
  });

  it('flags Facebook videos and drops Curator-hosted posts', async () => {
    mockFetch({
      ok: true,
      json: async () => ({
        posts: [
          { ...basePost, id: 1, network_name: 'Facebook', has_video: 1 },
          { ...basePost, id: 2, url: 'https://curator.io/promo' }
        ]
      })
    });
    const posts: NewsPost[] = await fetchFeed('feed-id', 8);
    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({ network: 'Facebook', isVideo: true });
  });

  it('throws on HTTP errors', async () => {
    mockFetch({ ok: false, status: 503 });
    await expect(fetchFeed('feed-id', 8)).rejects.toThrow('Curator feed feed-id failed: 503');
  });
});
