import type { Day, Slot, SlotStatus } from '@/core/content/types';
import type { Language } from '@/core/i18n/languages';
import { Constants } from '@/core/constants';

export interface ScheduleDay {
  day: Day;
  slots: Slot[];
}

// week order, copy under day.<id>
export const DAYS: Day[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

export const SLOT_STATUS: Record<SlotStatus, { labelKey: string; className: string }> = {
  waitlist: { labelKey: 'common.waitlist', className: 'bg-warning-tint text-warning' },
  full: { labelKey: 'common.full', className: 'bg-ink text-white' }
};

// "20:30" -> 20.5
export function hourValue(time: string): number {
  const [hours = 0, minutes = 0] = time.split(':').map(Number);
  return hours + (minutes || 0) / 60;
}

// "20:30" stays as is in English and reads "20h30" in French; whole hours drop their minutes there.
export function formatTime(time: string, language: Language): string {
  const [hours = '0', minutes] = time.split(':');
  if (language !== 'fr') return `${hours.padStart(2, '0')}:${minutes ?? '00'}`;
  return `${Number(hours)}h${minutes && minutes !== '00' ? minutes : ''}`;
}

export function formatSlotTime(slot: Pick<Slot, 'start' | 'end'>, language: Language): string {
  return `${formatTime(slot.start, language)} – ${formatTime(slot.end, language)}`;
}

export function isCoached(slot: Slot): boolean {
  return slot.coach.trim() !== '';
}

export function slotHours(slot: Pick<Slot, 'start' | 'end'>): [number, number] {
  return [hourValue(slot.start), hourValue(slot.end)];
}

// Every day of the week in order, each with its slots sorted by start time.
export function groupByDay(slots: Slot[]): ScheduleDay[] {
  return DAYS.map((day: Day) => ({
    day,
    slots: slots
      .filter((slot: Slot) => slot.day === day)
      .sort((a: Slot, b: Slot) => hourValue(a.start) - hourValue(b.start))
  }));
}

// Date.getDay() starts on Sunday, the schedule on Monday
export function todayIndex(): number {
  return (new Date().getDay() + 6) % 7;
}

// today, or the next day that has slots
export function defaultDay(days: ScheduleDay[]): Day {
  const today: number = todayIndex();
  for (let offset: number = 0; offset < days.length; offset++) {
    const day: ScheduleDay | undefined = days[(today + offset) % days.length];
    if (day && day.slots.length > 0) return day.day;
  }
  return days[today]?.day ?? 'monday';
}

export function slotKey(slot: Slot): string {
  return `${slot.start}-${slot.end}-${slot.venue || slot.place}`;
}

// search params pointing the sessions page at one slot
export const DAY_PARAM: string = 'jour';
export const SLOT_PARAM: string = 'creneau';

// The first new slot of the week, the one the header banner announces by default.
export function featuredSlotPath(slots: Slot[]): string {
  for (const day of groupByDay(slots)) {
    const slot: Slot | undefined = day.slots.find((item: Slot) => item.isNew);
    if (slot) {
      const params = new URLSearchParams({ [DAY_PARAM]: day.day, [SLOT_PARAM]: slotKey(slot) });
      return `${Constants.ROUTE_SCHEDULE}?${params}`;
    }
  }
  return Constants.ROUTE_SCHEDULE;
}
