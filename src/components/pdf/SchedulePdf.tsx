import type { I18nFunctionString } from '@mxreakit/i18n';
import { Document, StyleSheet, Text, View } from '@react-pdf/renderer';
import { ContentPage, CoverPage, Label, LinkButton } from '@/components/pdf/components';
import { colors, DISPLAY } from '@/components/pdf/theme';
import { Constants } from '@/core/constants';
import type { Activity, Membership, SiteContent, Slot, SlotStatus } from '@/core/content/types';
import {
  SLOT_STATUS,
  formatSlotTime,
  groupByDay,
  isCoached,
  slotKey,
  type ScheduleDay
} from '@/core/schedule';
import { slotPlace, venueDirectionsUrl, venuesWithSlots, type VenueWithSlots } from '@/core/venues';
import { localize, type Language } from '@/core/i18n/languages';
import logo from '@/assets/images/logo-rec.png';
import coverPhoto from '@/assets/images/pdf/schedule-cover.jpg';

export interface SchedulePdfProps {
  t: I18nFunctionString;
  language: Language;
  locale: string;
  content: SiteContent;
}

const STATUS_COLORS: Record<SlotStatus, { background: string; color: string }> = {
  waitlist: { background: '#fbe9bf', color: '#6e4700' },
  full: { background: colors.ink, color: colors.white }
};

const styles = StyleSheet.create({
  day: { marginBottom: 16 },
  row: {
    flexDirection: 'row',
    gap: 14,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line
  },
  time: { width: 82, fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, lineHeight: 1.1 },
  description: { fontWeight: 700, fontSize: 10.5, lineHeight: 1.3 },
  details: { fontSize: 9, color: colors.muted, marginTop: 2 },
  tags: {
    width: 170,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    alignContent: 'flex-start',
    gap: 3
  },
  venues: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  venue: { width: 245, height: 132, backgroundColor: colors.sand, padding: 14, gap: 4 },
  venueName: { fontFamily: DISPLAY, fontWeight: 800, fontSize: 16, lineHeight: 1.1 }
});

const SlotRow = ({ slot, t, language, content }: { slot: Slot } & SchedulePdfProps) => (
  <View style={styles.row} wrap={false}>
    <Text style={styles.time}>{formatSlotTime(slot, language)}</Text>
    <View style={{ flex: 1 }}>
      <Text style={styles.description}>
        {localize(
          content.schedule.activities.find((activity: Activity) => activity.id === slot.activity)
            ?.label,
          language
        )}
      </Text>
      <Text style={styles.details}>
        {slotPlace(slot, content.venues.items) || t('schedule.placeTbd')}
        {' · '}
        {isCoached(slot) ? t('schedule.with', slot.coach) : t('schedule.freePlay')}
      </Text>
    </View>
    <View style={styles.tags}>
      {slot.isNew && (
        <Label size={8.5} background={colors.brand}>
          {t('common.new')}
        </Label>
      )}
      {slot.status && (
        <Label size={8.5} {...STATUS_COLORS[slot.status]}>
          {t(SLOT_STATUS[slot.status].labelKey)}
        </Label>
      )}
      {content.memberships.items
        .filter((membership: Membership) => slot.memberships.includes(membership.id))
        .map((membership: Membership) => (
          <Label
            key={membership.id}
            size={8}
            font="sans"
            background={membership.tint}
            color={membership.ink}
          >
            {localize(membership.label, language)}
          </Label>
        ))}
    </View>
  </View>
);

const VenueCard = ({
  venue,
  index,
  t
}: { venue: VenueWithSlots; index: number } & SchedulePdfProps) => {
  const days: string = [...new Set(venue.slots.map((slot) => t(`day.${slot.day}`)))].join(' · ');
  return (
    <View style={styles.venue}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Label size={14} background={colors.brand} style={{ width: 28 }} paddingX={0}>
          {index + 1}
        </Label>
        <Text style={[styles.venueName, { flex: 1 }]}>{venue.name}</Text>
      </View>
      <Text style={styles.details}>{venue.area}</Text>
      <Text style={{ fontSize: 9.5 }}>
        {t(
          venue.slots.length > 1 ? 'pdf.schedule.slots' : 'pdf.schedule.slot',
          String(venue.slots.length)
        )}
        {` · ${days}`}
      </Text>
      <LinkButton href={venueDirectionsUrl(venue)} size={10} style={{ marginTop: 'auto' }}>
        {t('common.directions')}
      </LinkButton>
    </View>
  );
};

// Printable week schedule and venue list, rendered on demand in the browser.
const SchedulePdf = (props: SchedulePdfProps) => {
  const { t, content } = props;
  const { season } = content.settings;
  const footer: string = t('pdf.schedule.footer', season);
  const venues: VenueWithSlots[] = venuesWithSlots(
    content.venues.items,
    content.schedule.slots
  ).filter((venue: VenueWithSlots) => venue.slots.length > 0);

  return (
    <Document
      title={`${Constants.COMPANY_NAME} - ${t('pdf.schedule.title')}`}
      author={Constants.COMPANY_NAME}
    >
      <CoverPage
        photo={coverPhoto}
        logo={logo}
        eyebrow={t('pdf.schedule.eyebrow')}
        title={t('pdf.schedule.coverTitle')}
        accent={t('pdf.schedule.coverAccent')}
        season={t('pdf.schedule.season', season)}
        site={Constants.SITE_URL.replace('https://', '')}
        handle="@recbadminton"
      />

      <ContentPage
        eyebrow={t('pdf.schedule.week')}
        title={t('pdf.schedule.sessions')}
        footer={footer}
      >
        {groupByDay(content.schedule.slots)
          .filter((day: ScheduleDay) => day.slots.length > 0)
          .map((day: ScheduleDay) => (
            <View key={day.day} style={styles.day}>
              <View minPresenceAhead={60}>
                <Label
                  size={14}
                  background={colors.brand}
                  paddingX={10}
                  style={{ alignItems: 'flex-start' }}
                >
                  {t(`day.${day.day}`)}
                </Label>
              </View>
              {day.slots.map((slot: Slot) => (
                <SlotRow key={slotKey(slot)} slot={slot} {...props} />
              ))}
            </View>
          ))}
      </ContentPage>

      <ContentPage
        eyebrow={t('pdf.schedule.whereEyebrow')}
        title={t('pdf.schedule.venues')}
        footer={footer}
      >
        <View style={styles.venues}>
          {venues.map((venue: VenueWithSlots, index: number) => (
            <VenueCard key={venue.id} venue={venue} index={index} {...props} />
          ))}
        </View>
      </ContentPage>
    </Document>
  );
};

export default SchedulePdf;
