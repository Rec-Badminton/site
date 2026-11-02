import type { Language } from '@/core/i18n/languages';
import type { SyncedContent } from '../../../functions/src/types.ts';
export { NOT_PLAYED } from '../../../functions/src/types.ts';

// One string per site language.
export type Localized = Record<Language, string>;

// A Storage download URL ("backup:<path>" only in backup/content.json, before a restore).
export type ImageRef = string;

export interface Picture {
  src: ImageRef;
  width: number;
  height: number;
}

// Settings

export interface SettingsLinks {
  instagram: string;
  facebook: string;
  whatsapp: string;
  membership: string;
  myFfbad: string;
  waitingList: string;
  trialForm: string;
  badnet: string;
  interclubs: string;
  contactForm: string;
  calendar: string;
}

export interface Settings {
  email: string;
  // e.g. "2026-2027"
  season: string;
  // welcome booklet PDF
  booklet: string;
  links: SettingsLinks;
  curatorFeeds: { instagram: string; facebook: string };
  qrCodes: { trial: ImageRef; whatsapp: ImageRef };
}

export interface Banner {
  enabled: boolean;
  label: Localized;
  message: Localized;
  // site path or URL; empty points at the first new slot
  link: string;
}

// Memberships

export interface Membership {
  id: string;
  label: Localized;
  description: Localized;
  priceNote: Localized;
  // yearly price, in euros
  price: number;
  // icon fill on the site
  color: string;
  // chip colors, shared by the site and the PDF export
  tint: string;
  ink: string;
  // open to young players: their slots read "everyone" rather than "adults"
  youth: boolean;
}

export interface MembershipsContent {
  items: Membership[];
}

// Schedule

// copy under day.<id>
export type Day =
  'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type SlotStatus = 'waitlist' | 'full';

export interface Activity {
  id: string;
  label: Localized;
}

export interface Slot {
  day: Day;
  // "HH:MM"
  start: string;
  end: string;
  // venue id, empty while the place is not confirmed
  venue: string;
  // hall name shown to visitors, defaults to the venue name
  place: string;
  // empty for open play
  coach: string;
  // membership ids
  memberships: string[];
  // activity id
  activity: string;
  status: SlotStatus | '';
  isNew: boolean;
}

export interface ScheduleContent {
  activities: Activity[];
  slots: Slot[];
}

export interface Venue {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
}

export interface VenuesContent {
  items: Venue[];
}

// Shop

export interface ShopCategory {
  id: string;
  label: Localized;
}

export interface Product {
  id: string;
  name: Localized;
  // one bullet per line
  details: Localized;
  price: number;
  image: ImageRef;
  // category id
  category: string;
  // empty for none
  badge: Localized;
}

export interface Shop {
  url: string;
  products: Product[];
}

export interface ShopContent {
  categories: ShopCategory[];
  club: Shop;
  stringing: Shop;
}

// Partners

export interface Partner {
  name: string;
  url: string;
  logo: ImageRef;
}

export interface StoreDiscount {
  value: Localized;
  title: Localized;
  text: Localized;
}

export interface StorePartner {
  website: string;
  mapUrl: string;
  address: string;
  phone: string;
  email: string;
  logo: ImageRef;
  discounts: StoreDiscount[];
}

export interface PartnersContent {
  items: Partner[];
  store: StorePartner;
}

// Photos

export interface Photo extends Picture {
  alt: Localized;
}

export type HeroPage =
  'home' | 'sessions' | 'registration' | 'competition' | 'shop' | 'contact' | 'policy' | 'notFound';

export interface PhotosContent {
  // endless strip of the home page
  carousel: Photo[];
  tournament: Photo;
  heroes: Record<HeroPage, ImageRef>;
}

// Competition

// Interclubs are synced from ICBad by the Cloud Functions.
export type {
  Fixture,
  HomeAway,
  InterclubsDocument,
  Standing,
  SyncedContent,
  SyncedId,
  SyncState,
  Team,
  UpcomingMatch
} from '../../../functions/src/types.ts';

export type Trend = 'up' | 'down' | 'same';

export interface SeasonResult {
  previousTeam: string;
  // final rank in the group, then in the play-offs when the team played them
  groupRank: number;
  playoffRank?: number;
  trend: Trend;
  nextTeam: string;
}

export interface CompetitionContent {
  // e.g. "2025/2026"
  previousSeason: string;
  seasonResults: SeasonResult[];
}

// Pages

// Copy may wrap words in <0>…</0> for bold, as the dictionaries do.
export interface RichItem {
  text: Localized;
}

export interface Level {
  title: Localized;
  text: Localized;
}

export interface PagesContent {
  // registration page alert; <1>…</1> links to the waiting list
  registrationNotice: { enabled: boolean; text: Localized };
  trialRules: RichItem[];
  included: RichItem[];
  discounts: RichItem[];
  // sessions page
  levels: Level[];
}

// Texts

// Replaces the dictionary copy of one key; an empty language keeps the default.
export interface TextOverride {
  key: string;
  fr: string;
  en: string;
}

export interface TextsContent {
  overrides: TextOverride[];
}

// Each entry is one Firestore document, content/<id>.
export interface SiteContent {
  settings: Settings;
  banner: Banner;
  memberships: MembershipsContent;
  schedule: ScheduleContent;
  venues: VenuesContent;
  shop: ShopContent;
  partners: PartnersContent;
  photos: PhotosContent;
  competition: CompetitionContent;
  pages: PagesContent;
  texts: TextsContent;
}

export type ContentId = keyof SiteContent;

// What the site renders: the edited content and the synced documents.
export interface SiteData extends SiteContent {
  synced: SyncedContent;
}
