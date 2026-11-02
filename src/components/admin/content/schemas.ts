import type { DraftObject, Field, FieldContext } from '@/components/admin/content/schema';
import { newId } from '@/core/admin/draft';
import type {
  Activity,
  HeroPage,
  Localized,
  Membership,
  ShopCategory,
  Venue
} from '@/core/content/types';
import { DAYS } from '@/core/schedule';

// Back office forms, one per content document. Labels and help are keys of core/i18n/admin.ts.

const EMPTY: Localized = { fr: '', en: '' };

const text = (key: string, label: string, help?: string): Field => ({
  key,
  type: 'text',
  label,
  help
});

const url = (key: string, label: string, help?: string): Field => ({
  key,
  type: 'url',
  label,
  help
});

const localized = (key: string, label: string, help?: string): Field => ({
  key,
  type: 'localized',
  label,
  help
});

const number = (key: string, label: string, help?: string): Field => ({
  key,
  type: 'number',
  label,
  help
});

const image = (key: string, label: string): Field => ({ key, type: 'image', label });

// list items keep the French copy as their name in the back office
const french = (value: unknown): string => (value as Localized | undefined)?.fr ?? '';

// Settings

export const settingsFields: Field[] = [
  { key: 'email', type: 'email', label: 'admin.field.email' },
  text('season', 'admin.field.season', 'admin.help.season'),
  {
    key: 'booklet',
    type: 'file',
    accept: 'application/pdf',
    label: 'admin.field.booklet',
    help: 'admin.help.booklet'
  },
  {
    key: 'links',
    type: 'group',
    label: 'admin.field.links',
    fields: [
      url('instagram', 'admin.field.instagram'),
      url('facebook', 'admin.field.facebook'),
      url('whatsapp', 'admin.field.whatsapp'),
      url('membership', 'admin.field.membership'),
      url('myFfbad', 'admin.field.myFfbad'),
      url('waitingList', 'admin.field.waitingList'),
      url('trialForm', 'admin.field.trialForm'),
      url('badnet', 'admin.field.badnet'),
      url('interclubs', 'admin.field.interclubs'),
      url('contactForm', 'admin.field.contactForm', 'admin.help.contactForm'),
      url('calendar', 'admin.field.calendar', 'admin.help.calendar')
    ]
  },
  {
    key: 'qrCodes',
    type: 'group',
    label: 'admin.field.qrCodes',
    fields: [image('trial', 'admin.field.qrTrial'), image('whatsapp', 'admin.field.qrWhatsapp')]
  },
  {
    key: 'curatorFeeds',
    type: 'group',
    label: 'admin.field.curatorFeeds',
    help: 'admin.help.curatorFeeds',
    fields: [text('instagram', 'admin.field.instagram'), text('facebook', 'admin.field.facebook')]
  }
];

// Banner

export const bannerFields: Field[] = [
  { key: 'enabled', type: 'boolean', label: 'admin.field.bannerEnabled' },
  text('link', 'admin.field.link', 'admin.help.bannerLink'),
  localized('label', 'admin.field.bannerLabel'),
  localized('message', 'admin.field.message')
];

// Memberships

export const membershipsFields: Field[] = [
  {
    key: 'items',
    type: 'list',
    label: 'admin.field.memberships',
    help: 'admin.help.memberships',
    summary: (item: DraftObject) => `${french(item.label)} · ${item.price} €`,
    create: () => ({
      id: newId(),
      label: EMPTY,
      description: EMPTY,
      priceNote: EMPTY,
      price: 0,
      color: '#da3124',
      tint: '#fbe5e2',
      ink: '#b3261e',
      youth: false
    }),
    fields: [
      localized('label', 'admin.field.name'),
      localized('description', 'admin.field.membershipDescription'),
      localized('priceNote', 'admin.field.priceNote'),
      number('price', 'admin.field.price'),
      { key: 'youth', type: 'boolean', label: 'admin.field.youth', help: 'admin.help.youth' },
      { key: 'color', type: 'color', label: 'admin.field.color' },
      { key: 'tint', type: 'color', label: 'admin.field.tint', help: 'admin.help.chipColors' },
      { key: 'ink', type: 'color', label: 'admin.field.ink' }
    ]
  }
];

// Schedule

const activityLabel = (context: FieldContext, id: unknown): string =>
  french(
    (context.draft.activities as Activity[] | undefined)?.find(
      (activity: Activity) => activity.id === id
    )?.label
  );

export const scheduleFields: Field[] = [
  {
    key: 'slots',
    type: 'list',
    label: 'admin.field.slots',
    help: 'admin.help.slots',
    summary: (item: DraftObject, context: FieldContext) =>
      `${context.t(`day.${item.day}`)} ${item.start}–${item.end} · ${activityLabel(context, item.activity)}`,
    create: () => ({
      day: 'monday',
      start: '20:00',
      end: '22:00',
      venue: '',
      place: '',
      coach: '',
      memberships: [],
      activity: '',
      status: '',
      isNew: false
    }),
    fields: [
      {
        key: 'day',
        type: 'select',
        label: 'admin.field.day',
        options: ({ t }: FieldContext) =>
          DAYS.map((day: string) => ({ value: day, label: t(`day.${day}`) }))
      },
      {
        key: 'activity',
        type: 'select',
        label: 'admin.field.activity',
        options: (context: FieldContext) =>
          ((context.draft.activities as Activity[]) ?? []).map((activity: Activity) => ({
            value: activity.id,
            label: activity.label.fr
          }))
      },
      { key: 'start', type: 'time', label: 'admin.field.start' },
      { key: 'end', type: 'time', label: 'admin.field.end' },
      {
        key: 'venue',
        type: 'select',
        label: 'admin.field.venue',
        help: 'admin.help.venue',
        options: ({ content, t }: FieldContext) => [
          { value: '', label: t('schedule.placeTbd') },
          ...content.venues.items.map((venue: Venue) => ({ value: venue.id, label: venue.name }))
        ]
      },
      text('place', 'admin.field.place', 'admin.help.place'),
      text('coach', 'admin.field.coach', 'admin.help.coach'),
      {
        key: 'status',
        type: 'select',
        label: 'admin.field.status',
        options: ({ t }: FieldContext) => [
          { value: '', label: t('admin.status.open') },
          { value: 'waitlist', label: t('common.waitlist') },
          { value: 'full', label: t('common.full') }
        ]
      },
      {
        key: 'memberships',
        type: 'multiselect',
        label: 'admin.field.audience',
        help: 'admin.help.audience',
        options: ({ content }: FieldContext) =>
          content.memberships.items.map((membership: Membership) => ({
            value: membership.id,
            label: membership.label.fr
          }))
      },
      { key: 'isNew', type: 'boolean', label: 'admin.field.isNew', help: 'admin.help.isNew' }
    ]
  },
  {
    key: 'activities',
    type: 'list',
    label: 'admin.field.activities',
    help: 'admin.help.activities',
    summary: (item: DraftObject) => french(item.label),
    create: () => ({ id: newId(), label: EMPTY }),
    fields: [localized('label', 'admin.field.name')]
  }
];

// Venues

export const venuesFields: Field[] = [
  {
    key: 'items',
    type: 'list',
    label: 'admin.field.venues',
    help: 'admin.help.venues',
    summary: (item: DraftObject) => String(item.name ?? ''),
    // centre of Rennes, to adjust
    create: () => ({ id: newId(), name: '', area: '', lat: 48.1113, lng: -1.68 }),
    fields: [
      text('name', 'admin.field.name'),
      text('area', 'admin.field.area'),
      {
        key: 'lat',
        type: 'number',
        step: 0.0000001,
        label: 'admin.field.lat',
        help: 'admin.help.coordinates'
      },
      { key: 'lng', type: 'number', step: 0.0000001, label: 'admin.field.lng' }
    ]
  }
];

// Shop

const productsField: Field = {
  key: 'products',
  type: 'list',
  label: 'admin.field.products',
  summary: (item: DraftObject) => `${french(item.name)} · ${item.price} €`,
  create: () => ({
    id: newId(),
    name: EMPTY,
    details: EMPTY,
    price: 0,
    image: '',
    category: '',
    badge: EMPTY
  }),
  fields: [
    localized('name', 'admin.field.name'),
    number('price', 'admin.field.price'),
    {
      key: 'category',
      type: 'select',
      label: 'admin.field.category',
      options: (context: FieldContext) =>
        ((context.draft.categories as ShopCategory[]) ?? []).map((category: ShopCategory) => ({
          value: category.id,
          label: category.label.fr
        }))
    },
    image('image', 'admin.field.image'),
    localized('badge', 'admin.field.badge', 'admin.help.badge'),
    {
      key: 'details',
      type: 'localized',
      multiline: true,
      label: 'admin.field.details',
      help: 'admin.help.details'
    }
  ]
};

const shopFields = (key: string, label: string): Field => ({
  key,
  type: 'group',
  label,
  fields: [url('url', 'admin.field.helloAsso'), productsField]
});

export const shopContentFields: Field[] = [
  shopFields('club', 'admin.field.clubShop'),
  shopFields('stringing', 'admin.field.stringingShop'),
  {
    key: 'categories',
    type: 'list',
    label: 'admin.field.categories',
    help: 'admin.help.categories',
    summary: (item: DraftObject) => french(item.label),
    create: () => ({ id: newId(), label: EMPTY }),
    fields: [localized('label', 'admin.field.name')]
  }
];

// Partners

export const partnersFields: Field[] = [
  {
    key: 'items',
    type: 'list',
    label: 'admin.field.partners',
    help: 'admin.help.partners',
    summary: (item: DraftObject) => String(item.name ?? ''),
    create: () => ({ name: '', url: '', logo: '' }),
    fields: [
      text('name', 'admin.field.name'),
      url('url', 'admin.field.website'),
      image('logo', 'admin.field.logo')
    ]
  },
  {
    key: 'store',
    type: 'group',
    label: 'admin.field.store',
    help: 'admin.help.store',
    fields: [
      url('website', 'admin.field.website'),
      url('mapUrl', 'admin.field.mapUrl'),
      text('address', 'admin.field.address'),
      text('phone', 'admin.field.phone'),
      { key: 'email', type: 'email', label: 'admin.field.email' },
      image('logo', 'admin.field.logo'),
      {
        key: 'discounts',
        type: 'list',
        label: 'admin.field.discounts',
        summary: (item: DraftObject) => `${french(item.value)} · ${french(item.title)}`,
        create: () => ({ value: EMPTY, title: EMPTY, text: EMPTY }),
        fields: [
          localized('value', 'admin.field.discountValue'),
          localized('title', 'admin.field.title'),
          localized('text', 'admin.field.text')
        ]
      }
    ]
  }
];

// Photos

const photoFields: Field[] = [
  { key: 'src', type: 'image', measure: true, label: 'admin.field.photo' },
  localized('alt', 'admin.field.alt', 'admin.help.alt')
];

const HERO_PAGES: { page: HeroPage; label: string }[] = [
  { page: 'home', label: 'nav.home' },
  { page: 'sessions', label: 'nav.sessions' },
  { page: 'registration', label: 'nav.registration' },
  { page: 'competition', label: 'nav.competition' },
  { page: 'shop', label: 'nav.shop' },
  { page: 'contact', label: 'nav.contact' },
  { page: 'policy', label: 'footer.dataPolicy' },
  { page: 'notFound', label: 'notFound.title' }
];

export const photosFields: Field[] = [
  {
    key: 'carousel',
    type: 'list',
    label: 'admin.field.carousel',
    help: 'admin.help.carousel',
    summary: (item: DraftObject) => french(item.alt),
    create: () => ({ src: '', width: 0, height: 0, alt: EMPTY }),
    fields: photoFields
  },
  { key: 'tournament', type: 'group', label: 'admin.field.tournamentPhoto', fields: photoFields },
  {
    key: 'heroes',
    type: 'group',
    label: 'admin.field.heroes',
    help: 'admin.help.heroes',
    fields: HERO_PAGES.map(({ page, label }) => image(page, label))
  }
];

// Competition

export const competitionFields: Field[] = [
  text('previousSeason', 'admin.field.previousSeason', 'admin.help.previousSeason'),
  {
    key: 'seasonResults',
    type: 'list',
    layout: 'table',
    label: 'admin.field.seasonResults',
    help: 'admin.help.seasonResults',
    create: () => ({ previousTeam: '', groupRank: 1, playoffRank: 0, trend: 'same', nextTeam: '' }),
    fields: [
      text('previousTeam', 'competition.season.previous'),
      number('groupRank', 'admin.field.groupRank'),
      number('playoffRank', 'admin.field.playoffRank'),
      {
        key: 'trend',
        type: 'select',
        label: 'competition.season.result',
        options: ({ t }: FieldContext) =>
          ['up', 'same', 'down'].map((trend: string) => ({
            value: trend,
            label: t(`competition.trend.${trend}`)
          }))
      },
      text('nextTeam', 'competition.season.next')
    ]
  }
];

// Pages

const richList = (key: string, label: string): Field => ({
  key,
  type: 'list',
  label,
  help: 'admin.help.richText',
  summary: (item: DraftObject) => french(item.text).replace(/<\/?\d>/g, ''),
  create: () => ({ text: EMPTY }),
  fields: [{ key: 'text', type: 'localized', multiline: true, label: 'admin.field.text' }]
});

export const pagesFields: Field[] = [
  {
    key: 'registrationNotice',
    type: 'group',
    label: 'admin.field.registrationNotice',
    fields: [
      { key: 'enabled', type: 'boolean', label: 'admin.field.noticeEnabled' },
      {
        key: 'text',
        type: 'localized',
        multiline: true,
        label: 'admin.field.text',
        help: 'admin.help.registrationNotice'
      }
    ]
  },
  richList('trialRules', 'admin.field.trialRules'),
  richList('included', 'admin.field.included'),
  richList('discounts', 'admin.field.discounts'),
  {
    key: 'levels',
    type: 'list',
    label: 'admin.field.levels',
    summary: (item: DraftObject) => french(item.title),
    create: () => ({ title: EMPTY, text: EMPTY }),
    fields: [localized('title', 'admin.field.title'), localized('text', 'admin.field.text')]
  }
];
