// Documents of the synced collection, written by these functions and read by the site
// (re-exported by src/core/content/types.ts): types and the constants both sides share.

// score of a fixture not played yet
export const NOT_PLAYED: string = '—';

// region of the Cloud Functions, which the back office calls
export const FUNCTIONS_REGION: string = 'europe-west1';

// Every synced document keeps the outcome of its last sync.
export interface SyncState {
  // ISO date-time of the last successful sync, empty before the first one
  updatedAt: string;
  // ISO date-time of the last attempt, successful or not
  attemptedAt: string;
  // why the last attempt failed, empty when it succeeded
  error: string;
}

// Interclubs, scraped from ICBad

export type HomeAway = 'home' | 'away';

export interface UpcomingMatch {
  // "07/11"
  date: string;
  // "16:00", missing until ICBad sets it
  time?: string;
  url: string;
  team: string;
  division: string;
  opponent: string;
  venue: HomeAway;
  address?: string;
}

export interface Standing {
  rank: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  isRec: boolean;
}

export interface Fixture {
  // "J1", "J2"... (journée)
  round: string;
  date: string;
  time?: string;
  url: string;
  opponent: string;
  venue: HomeAway;
  address?: string;
  // "—" until played
  score: string;
}

export interface Team {
  // "REC 1"
  name: string;
  division: { name: string; url: string };
  rank: number;
  points: number;
  standings: Standing[];
  calendar: Fixture[];
}

export interface InterclubsData {
  // next match of each team, soonest first
  upcoming: UpcomingMatch[];
  teams: Team[];
}

export type InterclubsDocument = InterclubsData & SyncState;

export interface SyncedContent {
  interclubs: InterclubsDocument;
}

export type SyncedId = keyof SyncedContent;
