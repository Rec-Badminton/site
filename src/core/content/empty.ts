import type {
  ContentId,
  Localized,
  SiteContent,
  SyncedContent,
  SyncedId,
  SyncState
} from '@/core/content/types';

// Firestore collection holding one document per ContentId.
export const CONTENT_COLLECTION: string = 'content';

const NONE: Localized = { fr: '', en: '' };

// Shape of every document with no content: stands in for a document never saved, and for the
// fields a document saved before them lacks. All content lives in Firestore (backup/ to restore it).
export const EMPTY_CONTENT: SiteContent = {
  settings: {
    email: '',
    season: '',
    booklet: '',
    links: {
      instagram: '',
      facebook: '',
      whatsapp: '',
      membership: '',
      myFfbad: '',
      waitingList: '',
      trialForm: '',
      badnet: '',
      interclubs: '',
      contactForm: '',
      calendar: ''
    },
    curatorFeeds: { instagram: '', facebook: '' },
    qrCodes: { trial: '', whatsapp: '' }
  },
  banner: { enabled: false, label: NONE, message: NONE, link: '' },
  memberships: { items: [] },
  schedule: { activities: [], slots: [] },
  venues: { items: [] },
  shop: { categories: [], club: { url: '', products: [] }, stringing: { url: '', products: [] } },
  partners: {
    items: [],
    store: { website: '', mapUrl: '', address: '', phone: '', email: '', logo: '', discounts: [] }
  },
  photos: {
    carousel: [],
    tournament: { src: '', width: 0, height: 0, alt: NONE },
    heroes: {
      home: '',
      sessions: '',
      registration: '',
      competition: '',
      shop: '',
      contact: '',
      policy: '',
      notFound: ''
    }
  },
  competition: { previousSeason: '', seasonResults: [] },
  pages: {
    registrationNotice: { enabled: false, text: NONE },
    trialRules: [],
    included: [],
    discounts: [],
    levels: []
  },
  texts: { overrides: [] }
};

export const CONTENT_IDS: ContentId[] = Object.keys(EMPTY_CONTENT) as ContentId[];

// Firestore collection of the documents the Cloud Functions sync from other sites (ICBad).
export const SYNCED_COLLECTION: string = 'synced';

const NEVER_SYNCED: SyncState = { updatedAt: '', attemptedAt: '', error: '' };

export const EMPTY_SYNCED: SyncedContent = {
  interclubs: { ...NEVER_SYNCED, upcoming: [], teams: [] }
};

export const SYNCED_IDS: SyncedId[] = Object.keys(EMPTY_SYNCED) as SyncedId[];
