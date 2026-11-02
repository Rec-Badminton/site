import { FirebaseError } from 'firebase/app';
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore/lite';
import { auth, db, guard } from '@/core/admin/firebase';
import { DataError } from '@/core/errors';

const ADMINS_COLLECTION: string = 'admins';

const IGNORED_SIGN_IN_ERRORS: string[] = [
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request'
];

export async function signIn(): Promise<void> {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (error) {
    if (error instanceof FirebaseError && IGNORED_SIGN_IN_ERRORS.includes(error.code)) return;
    console.error(error);
    throw new DataError('admin.errors.signIn');
  }
}

export function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}

/** Admins are listed in `admins/{uid}`; a user can only read their own entry. */
export function isAdmin(uid: string): Promise<boolean> {
  return guard(async () => (await getDoc(doc(db, ADMINS_COLLECTION, uid))).exists());
}
