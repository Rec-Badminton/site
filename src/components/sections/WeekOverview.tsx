import { useI18n } from '@mxreakit/i18n';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import type { Membership, Slot } from '@/core/content/types';
import {
  formatSlotTime,
  groupByDay,
  isCoached,
  slotKey,
  todayIndex,
  type ScheduleDay
} from '@/core/schedule';
import { cn } from '@/core/utils';

const SlotCard = ({ slot }: { slot: Slot }) => {
  const { t } = useI18n();
  const { language } = useLanguage();
  const { memberships } = useSiteContent();
  const coached: boolean = isCoached(slot);
  const forYouth: boolean = memberships.items.some(
    (membership: Membership) => membership.youth && slot.memberships.includes(membership.id)
  );

  return (
    <div className="bg-white px-3 py-2.5 lg:px-3.5 lg:py-3">
      <p className="font-display text-lg leading-none font-extrabold whitespace-nowrap tabular-nums sm:text-xl lg:text-2xl">
        {formatSlotTime(slot, language)}
      </p>
      <p
        className={cn(
          'mt-1.5 text-xs font-bold tracking-wider uppercase',
          coached ? 'text-brand-dark' : 'text-muted'
        )}
      >
        {t(coached ? 'schedule.training' : 'schedule.openPlay')}
      </p>
      <p className="text-sm text-muted">{t(forYouth ? 'schedule.everyone' : 'schedule.adults')}</p>
    </div>
  );
};

// Whole week at a glance for the home page; details live on the sessions page.
const WeekOverview = () => {
  const { t } = useI18n();
  const { schedule } = useSiteContent();
  const today: number = todayIndex();

  return (
    <div className="grid gap-1.5 lg:grid-cols-7 lg:items-start lg:gap-2">
      {groupByDay(schedule.slots).map((day: ScheduleDay, index: number) => (
        <div key={day.day} className="flex gap-1.5 lg:flex-col">
          <h3
            className={cn(
              'flex w-18 shrink-0 flex-col justify-center px-3 py-2.5 lg:flex-row lg:items-baseline lg:justify-between font-display text-2xl leading-none font-extrabold text-white uppercase lg:w-auto lg:text-[28px]',
              index === today ? 'bg-brand' : 'bg-ink'
            )}
          >
            {t(`day.${day.day}`).slice(0, 3)}
            {index === today && (
              <span className="sr-only font-sans lg:not-sr-only text-xs font-semibold tracking-normal normal-case">
                {t('schedule.today')}
              </span>
            )}
          </h3>
          {day.slots.length === 0 ? (
            <p className="flex grow items-center justify-center border-2 border-dashed border-[#d6d1c9] px-3 py-3 font-display text-lg font-bold text-muted">
              {t('schedule.none')}
            </p>
          ) : (
            <div className="grid grow grid-cols-2 gap-1.5 sm:grid-cols-4 lg:flex lg:flex-col">
              {day.slots.map((slot: Slot) => (
                <SlotCard key={slotKey(slot)} slot={slot} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WeekOverview;
