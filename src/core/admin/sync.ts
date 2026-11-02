import { FirebaseError } from 'firebase/app';
import { httpsCallable } from 'firebase/functions';
import { functions, toDataError } from '@/core/admin/firebase';
import type { SyncedId } from '@/core/content/types';
import { DataError } from '@/core/errors';

// Asks the refreshSynced Cloud Function to sync a document now, instead of waiting for the morning.
export async function refreshSynced(id: SyncedId): Promise<void> {
  try {
    await httpsCallable(functions, 'refreshSynced')({ id });
  } catch (error) {
    // the source itself failed: its error is recorded on the document, shown by the section
    if (error instanceof FirebaseError && error.code === 'functions/unavailable') {
      console.error(error);
      throw new DataError('admin.sync.failed');
    }
    throw toDataError(error);
  }
}
