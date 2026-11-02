// Curator.io serves the club's Instagram and Facebook feeds through the same public endpoint as its embed widget.
const API_URL: string = 'https://api.curator.io/restricted/feeds';
const CURATOR_HOST: string = 'curator.io';

export type Network = 'Instagram' | 'Facebook';

export interface NewsPost {
  id: number;
  network: Network;
  date: Date;
  title: string;
  body: string;
  image: string | null;
  isVideo: boolean;
  url: string;
  likes: number;
  comments: number;
}

interface CuratorPost {
  id: number;
  network_name: string;
  source_created_at: string;
  text: string;
  image: string;
  image_large: string;
  has_video: number;
  url: string;
  likes: number;
  comments: number;
}

interface CuratorResponse {
  posts: CuratorPost[];
}

// First non-empty line becomes the title, the rest the body.
function splitText(text: string): { title: string; body: string } {
  const lines: string[] = text.trim().split('\n');
  const title: string = lines.shift()?.trim() ?? '';
  return { title, body: lines.join('\n').trim() };
}

function toNewsPost(post: CuratorPost): NewsPost {
  return {
    id: post.id,
    network: post.network_name === 'Facebook' ? 'Facebook' : 'Instagram',
    date: new Date(post.source_created_at),
    ...splitText(post.text),
    image: post.image_large || post.image || null,
    isVideo: post.has_video === 1,
    url: post.url,
    likes: post.likes,
    comments: post.comments
  };
}

export async function fetchFeed(feedId: string, limit: number): Promise<NewsPost[]> {
  const response: Response = await fetch(`${API_URL}/${feedId}/posts?limit=${limit}`);
  if (!response.ok) throw new Error(`Curator feed ${feedId} failed: ${response.status}`);
  const data: CuratorResponse = await response.json();
  return data.posts.filter((post: CuratorPost) => !post.url.includes(CURATOR_HOST)).map(toNewsPost);
}
