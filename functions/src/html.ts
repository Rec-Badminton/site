// Helpers shared by the scrapers.

export type FetchText = (url: string) => Promise<string>;

const USER_AGENT: string = 'recbadminton.fr sync (+https://recbadminton.fr)';

export async function fetchText(url: string): Promise<string> {
  const response: Response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!response.ok) throw new Error(`GET ${url} -> HTTP ${response.status}`);
  return response.text();
}

const ENTITIES: Record<string, string> = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&quot;': '"',
  '&#39;': "'",
  '&#039;': "'",
  '&apos;': "'",
  '&lt;': '<',
  '&gt;': '>'
};

export function decodeEntities(text: string): string {
  return text.replace(
    /&(?:nbsp|amp|quot|#0?39|apos|lt|gt);/g,
    (entity: string) => ENTITIES[entity]
  );
}

// Text of an HTML fragment on one line.
export function stripTags(html: string): string {
  return decodeEntities(html.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
}
