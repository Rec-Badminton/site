import type { DocumentReference, Firestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { fetchText } from './html.js';
import { scrapeInterclubs } from './interclubs.js';
import type { InterclubsData, SyncedId, SyncState } from './types.js';

export const SYNCED_COLLECTION: string = 'synced';
export const SYNCED_IDS: SyncedId[] = ['interclubs'];

type Source = (now: Date) => Promise<InterclubsData>;

const SOURCES: Record<SyncedId, Source> = {
  interclubs: (now: Date) => scrapeInterclubs(fetchText, now)
};

/**
 * Fetches one synced document and writes it with its new state. A failure only records
 * the attempt and its error, so the site keeps showing the last good data; it is rethrown.
 */
export async function sync(db: Firestore, id: SyncedId): Promise<SyncState> {
  const at: string = new Date().toISOString();
  const target: DocumentReference = db.collection(SYNCED_COLLECTION).doc(id);

  try {
    const data: InterclubsData = await SOURCES[id](new Date(at));
    const state: SyncState = { updatedAt: at, attemptedAt: at, error: '' };
    await target.set({ ...data, ...state });
    logger.info(`synced/${id} updated`);
    return state;
  } catch (error) {
    const message: string = error instanceof Error ? error.message : String(error);
    await target.set({ attemptedAt: at, error: message }, { merge: true });
    logger.error(`synced/${id} failed: ${message}`);
    throw error;
  }
}
