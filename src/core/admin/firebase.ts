import { FirebaseError, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFunctions, type Functions } from 'firebase/functions';
import { getFirestore, type Firestore } from 'firebase/firestore/lite';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { DataError } from '@/core/errors';
import { FUNCTIONS_REGION } from '../../../functions/src/types.ts';

// admin-only module: reachable through the lazy AdminPage, never from the public site
const firebaseApp: FirebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
});

export const auth: Auth = getAuth(firebaseApp);
// lite build: no realtime listeners, much smaller bundle
export const db: Firestore = getFirestore(firebaseApp);
export const storage: FirebaseStorage = getStorage(firebaseApp);
export const functions: Functions = getFunctions(firebaseApp, FUNCTIONS_REGION);

const PERMISSION_ERRORS: string[] = [
  'permission-denied',
  'storage/unauthorized',
  'functions/permission-denied'
];

/** Logs the original error and converts it to a translated `DataError`. */
export function toDataError(error: unknown): DataError {
  if (error instanceof DataError) return error;
  console.error(error);
  if (error instanceof FirebaseError && PERMISSION_ERRORS.includes(error.code)) {
    return new DataError('admin.errors.permissionDenied');
  }
  return new DataError('admin.errors.server');
}

/** Runs a Firebase call and converts its failure to a `DataError`. */
export async function guard<T>(action: () => Promise<T>): Promise<T> {
  try {
    return await action();
  } catch (error) {
    throw toDataError(error);
  }
}
