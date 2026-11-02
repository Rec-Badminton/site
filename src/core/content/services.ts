import {
  CONTENT_COLLECTION,
  CONTENT_IDS,
  EMPTY_CONTENT,
  EMPTY_SYNCED,
  SYNCED_COLLECTION,
  SYNCED_IDS
} from '@/core/content/empty';
import { getDocuments, type RestDocument } from '@/core/content/firestore-rest';
import type { SiteData } from '@/core/content/types';

// past this delay the site shows its error screen rather than staying blank
const TIMEOUT_MS: number = 8000;

const contentPath = (id: string): string => `${CONTENT_COLLECTION}/${id}`;
const syncedPath = (id: string): string => `${SYNCED_COLLECTION}/${id}`;

// Saved documents, by path, over their empty shape: a field added since the last save starts empty.
export function mergeSiteData(documents: Record<string, RestDocument>): SiteData {
  const merge = <T extends object>(empty: T, saved: RestDocument | undefined): T => ({
    ...empty,
    ...saved
  });
  return {
    ...Object.fromEntries(
      CONTENT_IDS.map((id) => [id, merge(EMPTY_CONTENT[id], documents[contentPath(id)])])
    ),
    synced: Object.fromEntries(
      SYNCED_IDS.map((id) => [id, merge(EMPTY_SYNCED[id], documents[syncedPath(id)])])
    )
  } as unknown as SiteData;
}

// Synced data is secondary: when it cannot be read, its sections render empty and the site stays up.
async function getSyncedDocuments(signal: AbortSignal): Promise<Record<string, RestDocument>> {
  try {
    return await getDocuments(SYNCED_IDS.map(syncedPath), signal);
  } catch (error) {
    console.error(error);
    return {};
  }
}

// Two batchGets in parallel: one denied document fails its whole request.
export async function fetchSiteContent(): Promise<SiteData> {
  const signal: AbortSignal = AbortSignal.timeout(TIMEOUT_MS);
  const [content, synced] = await Promise.all([
    getDocuments(CONTENT_IDS.map(contentPath), signal),
    getSyncedDocuments(signal)
  ]);
  return mergeSiteData({ ...content, ...synced });
}
