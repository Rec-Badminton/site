import { useEffect, useMemo, type MouseEvent } from 'react';
import { useI18n } from '@mxreakit/i18n';
import { MapPin } from 'lucide-react';
import Tabs, { type TabItem } from '@/components/ui/Tabs';
import AudienceChip from '@/components/ui/AudienceChip';
import { useActivityLabel } from '@/hooks/use-activity-label';
import { useBreakpoint } from '@/hooks/use-breakpoints';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import type { Membership, Slot } from '@/core/content/types';
import {
  SLOT_STATUS,
  formatSlotTime,
  formatTime,
  groupByDay,
  isCoached,
  slotHours,
  slotKey,
  type ScheduleDay
} from '@/core/schedule';
import { slotPlace } from '@/core/venues';
import { cn, type FocusRequest } from '@/core/utils';

interface WeekScheduleProps {
  day: string;
  onDayChange: (day: string) => void;
  // slot to scroll to and flash, by slotKey()
  focus: FocusRequest | null;
  onPlaceClick: (slot: Slot) => void;
}

// Time scale shared by every row: it spans the whole week so it stays put when switching days.
interface Axis {
  hours: number[];
  toPercent: (hour: number) => number;
}

const weekAxis = (slots: Slot[]): Axis => {
  const ranges: [number, number][] = slots.map(slotHours);
  const start: number = Math.floor(Math.min(...ranges.map(([from]) => from)));
  const end: number = Math.ceil(Math.max(...ranges.map(([, to]) => to)));
  return {
    hours: Array.from(
      { length: end - start + 1 },
      (_value: unknown, index: number) => start + index
    ),
    toPercent: (hour: number): number => ((hour - start) / (end - start)) * 100
  };
};

interface RowProps {
  slot: Slot;
  focused: boolean;
  axis: Axis;
  onPlaceClick: (slot: Slot) => void;
}

const PlaceLink = ({ slot, onPlaceClick }: Pick<RowProps, 'slot' | 'onPlaceClick'>) => {
  const { t } = useI18n();
  const { venues } = useSiteContent();
  const place: string = slotPlace(slot, venues.items);
  if (!place) return <>{t('schedule.placeTbd')}</>;

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onPlaceClick(slot);
  };
  return (
    <a href="#salles" onClick={onClick} className="hover:text-brand hover:underline">
      {place}
    </a>
  );
};

const ActivityLabel = ({ slot }: { slot: Slot }) => {
  const activityLabel = useActivityLabel();
  return <>{activityLabel(slot)}</>;
};

const AudienceChips = ({ slot }: { slot: Slot }) => {
  const { memberships } = useSiteContent();
  return (
    <>
      {memberships.items
        .filter((membership: Membership) => slot.memberships.includes(membership.id))
        .map((membership: Membership) => (
          <AudienceChip key={membership.id} membership={membership} />
        ))}
    </>
  );
};

const SlotBadges = ({ slot }: { slot: Slot }) => {
  const { t } = useI18n();
  return (
    <>
      {slot.isNew && <span className="badge bg-brand text-white">{t('common.new')}</span>}
      {slot.status && (
        <span className={cn('badge', SLOT_STATUS[slot.status].className)}>
          {t(SLOT_STATUS[slot.status].labelKey)}
        </span>
      )}
    </>
  );
};

const SlotBar = ({ slot, axis }: Pick<RowProps, 'slot' | 'axis'>) => {
  const { t } = useI18n();
  const { language } = useLanguage();
  const [from, to] = slotHours(slot);
  const coached: boolean = isCoached(slot);
  const label: string = formatSlotTime(slot, language).replace(' – ', '–');

  return (
    <div
      className={cn(
        'absolute inset-y-5 @container overflow-hidden px-2 pt-2 text-white',
        coached ? 'bg-brand' : 'bg-ink'
      )}
      style={{
        left: `${axis.toPercent(from)}%`,
        width: `${axis.toPercent(to) - axis.toPercent(from)}%`
      }}
    >
      {/* shrink with the bar so the time always fits on one line */}
      <span
        className="block font-display leading-none font-extrabold whitespace-nowrap"
        style={{ fontSize: `clamp(11px, ${150 / label.length}cqw, 22px)` }}
      >
        {label}
      </span>
      {coached && (
        <span className="absolute right-2 bottom-1.5 text-[11px] font-bold tracking-wider whitespace-nowrap uppercase">
          {t('schedule.with', slot.coach)}
        </span>
      )}
    </div>
  );
};

const TimelineRow = ({ slot, focused, axis, onPlaceClick }: RowProps) => (
  <div
    data-slot={slotKey(slot)}
    className={cn('flex border-b border-line', focused && 'animate-flash')}
  >
    <div className="flex w-72 shrink-0 flex-col gap-1.5 px-6 py-4 xl:w-80">
      <p className="leading-snug font-bold">
        <ActivityLabel slot={slot} />
      </p>
      <p className="flex items-center gap-1.5 text-[15px] text-muted">
        <MapPin className="size-4 shrink-0" aria-hidden="true" />
        <PlaceLink slot={slot} onPlaceClick={onPlaceClick} />
      </p>
      <div className="flex flex-wrap gap-1">
        <AudienceChips slot={slot} />
        <SlotBadges slot={slot} />
      </div>
    </div>
    <div className="relative mr-8 min-h-24 grow">
      {axis.hours.map((hour: number) => (
        <span
          key={hour}
          aria-hidden="true"
          className="absolute inset-y-0 w-px bg-line"
          style={{ left: `${axis.toPercent(hour)}%` }}
        />
      ))}
      <SlotBar slot={slot} axis={axis} />
    </div>
  </div>
);

const ListRow = ({ slot, focused, onPlaceClick }: RowProps) => {
  const { t } = useI18n();
  const { language } = useLanguage();

  return (
    <div
      data-slot={slotKey(slot)}
      className={cn(
        'flex flex-col gap-3 border-t border-line px-5 py-6 first:border-t-0',
        focused && 'animate-flash'
      )}
    >
      <p className="font-display text-4xl leading-none font-extrabold whitespace-nowrap tabular-nums">
        {formatSlotTime(slot, language)}
      </p>
      <div>
        <p className="text-xl leading-snug font-bold">
          <ActivityLabel slot={slot} />
        </p>
        <p className="mt-1 text-muted">
          <PlaceLink slot={slot} onPlaceClick={onPlaceClick} />
          {' · '}
          {isCoached(slot) ? t('schedule.with', slot.coach) : t('schedule.freePlay')}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <SlotBadges slot={slot} />
        <AudienceChips slot={slot} />
      </div>
    </div>
  );
};

const Legend = () => {
  const { t } = useI18n();
  return (
    <div className="flex gap-6 px-6 py-4 text-sm font-semibold text-muted">
      <span className="flex items-center gap-2">
        <span className="h-3 w-6 bg-brand" />
        {t('schedule.legend.coached')}
      </span>
      <span className="flex items-center gap-2">
        <span className="h-3 w-6 bg-ink" />
        {t('schedule.legend.openPlay')}
      </span>
    </div>
  );
};

// Day tabs over a time axis on desktop, a plain list on smaller screens.
const WeekSchedule = ({ day, onDayChange, focus, onPlaceClick }: WeekScheduleProps) => {
  const { t } = useI18n();
  const { language } = useLanguage();
  const { isLg } = useBreakpoint();
  const { schedule } = useSiteContent();
  const days: ScheduleDay[] = useMemo(
    () => groupByDay(schedule.slots).filter((item: ScheduleDay) => item.slots.length > 0),
    [schedule.slots]
  );
  const axis: Axis = useMemo(() => weekAxis(schedule.slots), [schedule.slots]);
  const current: ScheduleDay | undefined =
    days.find((item: ScheduleDay) => item.day === day) ?? days[0];
  const Row = isLg ? TimelineRow : ListRow;

  useEffect(() => {
    if (!focus) return;
    document
      .querySelector(`[data-slot="${CSS.escape(focus.id)}"]`)
      ?.scrollIntoView({ block: 'center' });
  }, [focus]);

  if (!current) return <p className="bg-white p-8 text-lg text-muted">{t('schedule.none')}</p>;

  const tabs: TabItem[] = days.map((item: ScheduleDay) => ({
    id: item.day,
    label: t(`day.${item.day}`).slice(0, 3).toUpperCase(),
    badge: String(item.slots.length)
  }));

  return (
    <Tabs label={t('schedule.days')} items={tabs} value={current.day} onChange={onDayChange}>
      <div className="bg-white">
        {isLg && (
          <div className="flex border-b border-line">
            <h3 className="w-72 shrink-0 px-6 py-3 font-display text-[26px] font-extrabold uppercase xl:w-80">
              {t(`day.${current.day}`)}
            </h3>
            <div className="relative mr-8 h-12 grow">
              {axis.hours.map((hour: number) => (
                <span
                  key={hour}
                  className="absolute bottom-2.5 -translate-x-1/2 font-display font-bold text-muted"
                  style={{ left: `${axis.toPercent(hour)}%` }}
                >
                  {formatTime(`${hour}:00`, language)}
                </span>
              ))}
            </div>
          </div>
        )}
        {current.slots.map((slot: Slot) => (
          <Row
            // remount on each request so the flash replays
            key={slotKey(slot) === focus?.id ? `${focus.id}-${focus.at}` : slotKey(slot)}
            slot={slot}
            focused={slotKey(slot) === focus?.id}
            axis={axis}
            onPlaceClick={onPlaceClick}
          />
        ))}
        {isLg && <Legend />}
      </div>
    </Tabs>
  );
};

export default WeekSchedule;
