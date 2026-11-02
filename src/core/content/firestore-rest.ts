// Minimal Firestore REST reader for public content: visitors never download the Firebase SDK.
// https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents/batchGet

export interface FirestoreValue {
  nullValue?: null;
  integerValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
  [type: string]: unknown;
}

interface FirestoreDocument {
  name: string;
  fields?: Record<string, FirestoreValue>;
}

type BatchGetResponse = { found?: FirestoreDocument; missing?: string }[];

export type RestDocument = Record<string, unknown>;

const DATABASE: string = `projects/${import.meta.env.VITE_FIREBASE_PROJECT_ID}/databases/(default)`;
const BATCH_GET_URL: string = `https://firestore.googleapis.com/v1/${DATABASE}/documents:batchGet?key=${import.meta.env.VITE_FIREBASE_API_KEY}`;

export function decodeValue(value: FirestoreValue): unknown {
  if (value.arrayValue) return (value.arrayValue.values ?? []).map(decodeValue);
  if (value.mapValue) return decodeFields(value.mapValue.fields);
  // int64 is serialized as a string
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if ('nullValue' in value) return null;
  // string, double, boolean, timestamp, reference: single JSON primitive
  return Object.values(value)[0];
}

function decodeFields(fields: Record<string, FirestoreValue> = {}): RestDocument {
  return Object.fromEntries(
    Object.entries(fields).map(([key, value]: [string, FirestoreValue]) => [
      key,
      decodeValue(value)
    ])
  );
}

const DOCUMENTS: string = `${DATABASE}/documents/`;

// The given documents, keyed by their path ("content/banner"); missing ones are left out.
export async function getDocuments(
  paths: string[],
  signal?: AbortSignal
): Promise<Record<string, RestDocument>> {
  const response: Response = await fetch(BATCH_GET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      documents: paths.map((path: string) => `${DOCUMENTS}${path}`)
    }),
    signal
  });
  if (!response.ok) throw new Error(`Firestore batchGet: ${response.status}`);

  const results: BatchGetResponse = await response.json();
  return Object.fromEntries(
    results.flatMap(({ found }) =>
      found ? [[found.name.slice(DOCUMENTS.length), decodeFields(found.fields)]] : []
    )
  );
}
