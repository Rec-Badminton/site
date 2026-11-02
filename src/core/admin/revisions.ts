import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  writeBatch,
  type DocumentReference,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
  type QuerySnapshot,
  type WriteBatch
} from 'firebase/firestore/lite';
import { auth, db, guard } from '@/core/admin/firebase';
import {
  deleteStoredPaths,
  exportContent,
  getContent,
  saveContent,
  storedPaths,
  type EditableContent
} from '@/core/admin/content';
import { planPrune, type PrunePlan } from '@/core/admin/revision-prune';
import { CONTENT_IDS } from '@/core/content/empty';
import type { ContentId, SiteContent } from '@/core/content/types';
import { DataError } from '@/core/errors';

// Every save records the whole site as a revision, like a commit of a Git-based CMS.
// revisions/{id} holds what lists them, revisions/{id}/snapshot/content the site itself:
// listing the history never downloads the snapshots.
const REVISIONS: string = 'revisions';
const SNAPSHOT: string[] = ['snapshot', 'content'];

export const MAX_REVISIONS: number = 50;

// a section save, a restored revision, a backup import, or a revision asked for
export type RevisionSource = ContentId | 'restore' | 'import' | 'manual';

export interface Revision {
  id: string;
  createdAt: Date;
  // email of the admin who saved
  author: string;
  source: RevisionSource;
  // createdAt of the revision brought back, for a restore
  restoredFrom?: Date;
}

interface RevisionDocument {
  createdAt: Timestamp | null;
  author: string;
  source: RevisionSource;
  restoredFrom?: Timestamp;
  // Storage paths the snapshot points at: its files are kept while it is
  files: string[];
}

async function listRevisionDocuments(): Promise<QueryDocumentSnapshot<RevisionDocument>[]> {
  const snapshot: QuerySnapshot = await getDocs(
    query(collection(db, REVISIONS), orderBy('createdAt', 'desc'))
  );
  return snapshot.docs as QueryDocumentSnapshot<RevisionDocument>[];
}

const snapshotRef = (id: string): DocumentReference => doc(db, REVISIONS, id, ...SNAPSHOT);

// Drops the revisions past MAX_REVISIONS, then the files nothing points at anymore.
async function prune(discarded: string[]): Promise<void> {
  const revisions: QueryDocumentSnapshot<RevisionDocument>[] = await listRevisionDocuments();
  const plan: PrunePlan = planPrune(
    revisions.map((revision: QueryDocumentSnapshot<RevisionDocument>) => ({
      id: revision.id,
      files: revision.data().files ?? []
    })),
    discarded,
    MAX_REVISIONS
  );

  if (plan.pruned.length) {
    const batch: WriteBatch = writeBatch(db);
    plan.pruned.forEach((id: string) => {
      batch.delete(snapshotRef(id));
      batch.delete(doc(db, REVISIONS, id));
    });
    await batch.commit();
  }
  await deleteStoredPaths(plan.orphans);
}

/**
 * Records the current content as a revision, then prunes the history.
 * `discarded` are the Storage paths the content pointed at before the change.
 * Best effort: returns false instead of failing the save it follows.
 */
export async function recordRevision(
  source: RevisionSource,
  discarded: string[] = [],
  restoredFrom?: Date
): Promise<boolean> {
  try {
    const content: EditableContent = await exportContent();
    const revision: DocumentReference = doc(collection(db, REVISIONS));
    const batch: WriteBatch = writeBatch(db);
    batch.set(revision, {
      createdAt: serverTimestamp(),
      author: auth.currentUser?.email ?? '',
      source,
      ...(restoredFrom && { restoredFrom: Timestamp.fromDate(restoredFrom) }),
      files: storedPaths(content)
    });
    batch.set(snapshotRef(revision.id), content);
    await batch.commit();
  } catch (error) {
    console.error(error);
    return false;
  }

  try {
    await prune(discarded);
  } catch (error) {
    // the revision is recorded: leftovers are pruned on the next save
    console.warn(error);
  }
  return true;
}

// Saves a section, then records the whole site as a revision. False when the revision failed.
export async function saveSection<Id extends ContentId>(
  id: Id,
  draft: SiteContent[Id],
  previous: SiteContent[Id]
): Promise<boolean> {
  await saveContent(id, draft);
  return recordRevision(id, storedPaths(previous));
}

// Storage paths some revision still points at.
export function revisionFiles(): Promise<Set<string>> {
  return guard(
    async () =>
      new Set(
        (await listRevisionDocuments()).flatMap(
          (revision: QueryDocumentSnapshot<RevisionDocument>) => revision.data().files ?? []
        )
      )
  );
}

// Revisions, newest first; a revision still being written has no date yet and is skipped.
export function listRevisions(): Promise<Revision[]> {
  return guard(async () =>
    (await listRevisionDocuments()).flatMap((snapshot: QueryDocumentSnapshot<RevisionDocument>) => {
      const { createdAt, author, source, restoredFrom }: RevisionDocument = snapshot.data();
      if (!createdAt) return [];
      return [
        {
          id: snapshot.id,
          createdAt: createdAt.toDate(),
          author,
          source,
          ...(restoredFrom && { restoredFrom: restoredFrom.toDate() })
        }
      ];
    })
  );
}

// Writes back every section of a revision, then records the result as a new revision.
export async function restoreRevision(revision: Revision): Promise<boolean> {
  const snapshot: DocumentSnapshot = await guard(() => getDoc(snapshotRef(revision.id)));
  if (!snapshot.exists()) throw new DataError('admin.revisions.missing');
  const content: EditableContent = snapshot.data() as EditableContent;

  const discarded: string[] = [];
  // one section after the other: a failure leaves the next ones untouched
  for (const id of CONTENT_IDS) {
    const section: SiteContent[ContentId] | undefined = content[id];
    if (section === undefined) continue;
    discarded.push(...storedPaths(await getContent(id)));
    await saveContent(id, section);
  }
  return recordRevision('restore', discarded, revision.createdAt);
}
