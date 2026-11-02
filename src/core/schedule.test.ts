import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  DAYS,
  DAY_PARAM,
  SLOT_PARAM,
  defaultDay,
  featuredSlotPath,
  formatSlotTime,
  formatTime,
  groupByDay,
  isCoached,
  slotHours,
  slotKey,
  todayIndex,
  type ScheduleDay
} from '@/core/schedule';
import { BACKUP } from '@/tests/backup';
import type { Slot } from '@/core/content/types';
import { Constants } from '@/core/constants';

const slot: Slot = {
  day: 'monday',
  start: '20:30',
  end: '22:00',
  venue: 'harpe',
  place: '',
  coach: '',
  memberships: [],
  activity: 'openPlayAll',
  status: '',
  isNew: false
};

// 2026-10-26 is a Monday
function setWeekday(offsetFromMonday: number): void {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 9, 26 + offsetFromMonday, 12));
}

describe('formatTime and formatSlotTime', () => {
  it('uses the French notation, without minutes on the hour', () => {
    expect(formatTime('20:30', 'fr')).toBe('20h30');
    expect(formatTime('09:00', 'fr')).toBe('9h');
    expect(formatSlotTime(slot, 'fr')).toBe('20h30 – 22h');
  });

  it('uses a 24-hour clock in English', () => {
    expect(formatTime('9:00', 'en')).toBe('09:00');
    expect(formatSlotTime(slot, 'en')).toBe('20:30 – 22:00');
  });
});

describe('slotHours', () => {
  it('turns a range into decimal hours', () => {
    expect(slotHours(slot)).toEqual([20.5, 22]);
    expect(slotHours({ start: '09:15', end: '10:45' })).toEqual([9.25, 10.75]);
  });

  it('parses every backup slot into an increasing range', () => {
    for (const item of BACKUP.schedule.slots) {
      const [from, to] = slotHours(item);
      expect(to, `${item.day} ${item.start}`).toBeGreaterThan(from);
    }
  });
});

describe('isCoached', () => {
  it('treats an empty coach as open play', () => {
    expect(isCoached(slot)).toBe(false);
    expect(isCoached({ ...slot, coach: ' ' })).toBe(false);
    expect(isCoached({ ...slot, coach: 'Alex' })).toBe(true);
  });
});

describe('groupByDay', () => {
  it('lists the seven days in week order with slots sorted by start time', () => {
    const days: ScheduleDay[] = groupByDay([
      { ...slot, day: 'sunday' },
      { ...slot, start: '18:00' },
      { ...slot, start: '08:00' }
    ]);
    expect(days.map((day: ScheduleDay) => day.day)).toEqual(DAYS);
    expect(days[0]!.slots.map((item: Slot) => item.start)).toEqual(['08:00', '18:00']);
    expect(days[6]!.slots).toHaveLength(1);
  });
});

describe('slotKey', () => {
  it('is unique within each backup day', () => {
    for (const day of groupByDay(BACKUP.schedule.slots)) {
      const keys: string[] = day.slots.map(slotKey);
      expect(new Set(keys).size, day.day).toBe(keys.length);
    }
  });
});

describe('todayIndex and defaultDay', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts the week on Monday', () => {
    setWeekday(0);
    expect(todayIndex()).toBe(0);
    setWeekday(6);
    expect(todayIndex()).toBe(6);
  });

  it('picks today when it has slots, otherwise the next day with slots', () => {
    const days: ScheduleDay[] = groupByDay(BACKUP.schedule.slots);
    days.forEach((_day: ScheduleDay, index: number) => {
      setWeekday(index);
      const expected: ScheduleDay | undefined = [
        ...days.slice(index),
        ...days.slice(0, index)
      ].find((day: ScheduleDay) => day.slots.length > 0);
      expect(defaultDay(days)).toBe(expected?.day ?? days[index]!.day);
    });
  });
});

describe('featuredSlotPath', () => {
  it('points the sessions page at the first new slot of the week', () => {
    const slots: Slot[] = [
      { ...slot, day: 'friday', isNew: true },
      { ...slot, day: 'tuesday', start: '18:00', isNew: true }
    ];
    const url: URL = new URL(featuredSlotPath(slots), Constants.SITE_URL);
    expect(url.pathname).toBe(Constants.ROUTE_SCHEDULE);
    expect(url.searchParams.get(DAY_PARAM)).toBe('tuesday');
    expect(url.searchParams.get(SLOT_PARAM)).toBe(slotKey(slots[1]!));
  });

  it('falls back to the sessions page without a new slot', () => {
    expect(featuredSlotPath([slot])).toBe(Constants.ROUTE_SCHEDULE);
  });
});
