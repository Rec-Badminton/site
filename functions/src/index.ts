import { initializeApp } from 'firebase-admin/app';
import { getFirestore, type DocumentSnapshot, type Firestore } from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions/v2';
import { HttpsError, onCall, type CallableRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { SYNCED_IDS, sync } from './sync.js';
import { FUNCTIONS_REGION, type SyncedId, type SyncState } from './types.js';

initializeApp();
const db: Firestore = getFirestore();

// one instance at a time: syncs are rare and must not run twice in parallel
setGlobalOptions({ region: FUNCTIONS_REGION, maxInstances: 1 });

const SCHEDULE = { timeZone: 'Europe/Paris', retryCount: 1 };

// every morning, after the evening matches are entered on ICBad
export const syncInterclubs = onSchedule({ ...SCHEDULE, schedule: '0 5 * * *' }, async () => {
  await sync(db, 'interclubs');
});

// "Mettre à jour maintenant" in the back office: admins only, like content writes.
export const refreshSynced = onCall(
  async (request: CallableRequest<{ id?: string }>): Promise<SyncState> => {
    if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
    const admin: DocumentSnapshot = await db.doc(`admins/${request.auth.uid}`).get();
    if (!admin.exists) throw new HttpsError('permission-denied', 'Admins only.');

    const id: SyncedId | undefined = SYNCED_IDS.find((item: SyncedId) => item === request.data.id);
    if (!id) throw new HttpsError('invalid-argument', 'Unknown synced document.');

    try {
      return await sync(db, id);
    } catch (error) {
      throw new HttpsError('unavailable', error instanceof Error ? error.message : String(error));
    }
  }
);
