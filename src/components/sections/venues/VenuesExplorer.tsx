import { lazy, Suspense, useEffect, useMemo, useRef } from 'react';
import { useI18n } from '@mxreakit/i18n';
import { ChevronDown } from 'lucide-react';
import OutboundLink from '@/components/ui/OutboundLink';
import { useActivityLabel } from '@/hooks/use-activity-label';
import { useBreakpoint } from '@/hooks/use-breakpoints';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import type { Slot } from '@/core/content/types';
import {
  venueDirectionsUrl,
  venueElementId,
  venuesWithSlots,
  type VenueWithSlots
} from '@/core/venues';
import { SLOT_STATUS, formatSlotTime } from '@/core/schedule';
import { cn, type FocusRequest } from '@/core/utils';

// Leaflet is heavy: only load it where the map is shown
const VenueMap = lazy(() => import('@/components/sections/venues/VenueMap'));

interface VenuesExplorerProps {
  selectedId: string | null;
  // venue to scroll to and flash, by id
  focus: FocusRequest | null;
  onSelect: (id: string | null) => void;
  onSlotClick: (slot: Slot) => void;
}

interface VenuesProps extends VenuesExplorerProps {
  venues: VenueWithSlots[];
}

const SlotLine = ({ slot, onClick }: { slot: Slot; onClick: () => void }) => {
  const { t } = useI18n();
  const { language } = useLanguage();
  const activityLabel = useActivityLabel();

  return (
    <li className="border-t border-line first:border-t-0">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full gap-4 px-3 py-3 text-left hover:bg-brand-tint"
      >
        <span className="w-12 shrink-0 font-display text-lg font-extrabold uppercase">
          {t(`day.${slot.day}`).slice(0, 3)}
        </span>
        <div className="min-w-0">
          <p className="font-display text-xl leading-tight font-bold whitespace-nowrap">
            {formatSlotTime(slot, language)}
          </p>
          <p className="text-[15px] text-muted">{activityLabel(slot)}</p>
          {slot.status && (
            <span className={cn('badge mt-1', SLOT_STATUS[slot.status].className)}>
              {t(SLOT_STATUS[slot.status].labelKey)}
            </span>
          )}
        </div>
      </button>
    </li>
  );
};

const VenueSummary = ({ venue, open }: { venue: VenueWithSlots; open: boolean }) => {
  const { t } = useI18n();
  const days: string = [
    ...new Set(venue.slots.map((slot: Slot) => t(`day.${slot.day}`).slice(0, 3)))
  ].join(' · ');

  return (
    <>
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center font-display text-xl font-extrabold text-white',
          open ? 'bg-ink' : 'bg-brand'
        )}
      >
        {venue.slots.length}
      </span>
      <span className="min-w-0 grow">
        <span className="block font-display text-xl leading-tight font-extrabold">
          {venue.name}
        </span>
        <span className="block text-sm text-muted">
          {venue.area} · {days}
        </span>
      </span>
    </>
  );
};

const VenueDetails = ({
  venue,
  onSlotClick
}: {
  venue: VenueWithSlots;
  onSlotClick: (slot: Slot) => void;
}) => {
  const { t } = useI18n();
  return (
    <div className="px-5 pb-4">
      <ul className="-mx-3">
        {venue.slots.map((slot: Slot) => (
          <SlotLine
            key={`${slot.day}-${slot.start}-${slot.end}`}
            slot={slot}
            onClick={() => onSlotClick(slot)}
          />
        ))}
      </ul>
      <OutboundLink
        href={venueDirectionsUrl(venue)}
        className="btn btn-dark mt-3 min-h-10 w-full px-4 py-2 text-lg"
      >
        {t('common.directions')}
      </OutboundLink>
    </div>
  );
};

const VenueList = ({ venues, selectedId, focus, onSelect, onSlotClick }: VenuesProps) => {
  const toggle = (id: string) => onSelect(selectedId === id ? null : id);

  return (
    <ul className="flex flex-col gap-1">
      {venues.map((venue: VenueWithSlots) => {
        const open: boolean = venue.id === selectedId;
        const flashing: boolean = venue.id === focus?.id;
        return (
          <li
            // remount on each request so the flash replays
            key={flashing ? `${venue.id}-${focus?.at}` : venue.id}
            id={venueElementId(venue.id)}
            className={cn(
              'bg-white',
              open && 'shadow-[inset_4px_0_0_var(--color-brand)]',
              flashing && 'animate-flash [--flash-rest:#fff]'
            )}
          >
            <button
              type="button"
              onClick={() => toggle(venue.id)}
              aria-expanded={open}
              className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-brand-tint"
            >
              <VenueSummary venue={venue} open={open} />
              <ChevronDown
                className={cn('shrink-0 transition-transform', open && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
            {open && <VenueDetails venue={venue} onSlotClick={onSlotClick} />}
          </li>
        );
      })}
    </ul>
  );
};

// Phones get the map alone: the venue picked on it unfolds right below.
const SelectedVenue = ({ venues, selectedId, focus, onSlotClick }: VenuesProps) => {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  const venue: VenueWithSlots | undefined = venues.find(
    (item: VenueWithSlots) => item.id === selectedId
  );

  // a pin tapped on the map: bring its details into view
  useEffect(() => {
    if (selectedId) panelRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedId]);

  if (!venue) {
    return <p className="py-3 text-center text-muted-light">{t('sessions.venues.pick')}</p>;
  }
  const flashing: boolean = venue.id === focus?.id;
  return (
    <div
      ref={panelRef}
      key={flashing ? `${venue.id}-${focus?.at}` : venue.id}
      id={venueElementId(venue.id)}
      className={cn(
        'scroll-mt-[calc(var(--header-height)+1.5rem)] scroll-mb-4 bg-white shadow-[inset_4px_0_0_var(--color-brand)]',
        flashing && 'animate-flash [--flash-rest:#fff]'
      )}
    >
      <div className="flex items-center gap-4 px-5 py-4">
        <VenueSummary venue={venue} open={true} />
      </div>
      <VenueDetails venue={venue} onSlotClick={onSlotClick} />
    </div>
  );
};

const VenuesExplorer = (props: VenuesExplorerProps) => {
  const { t } = useI18n();
  const { focus, selectedId, onSelect } = props;
  const { isLg } = useBreakpoint();
  const { venues, schedule } = useSiteContent();
  const withSlots: VenueWithSlots[] = useMemo(
    () => venuesWithSlots(venues.items, schedule.slots),
    [venues.items, schedule.slots]
  );

  useEffect(() => {
    if (!focus) return;
    document.getElementById(venueElementId(focus.id))?.scrollIntoView();
  }, [focus]);

  // Leaflet cannot frame an empty map
  if (!withSlots.length) return <p className="text-muted-light">{t('sessions.venues.none')}</p>;

  return (
    <div className="grid gap-1 lg:grid-cols-[420px_1fr]">
      {isLg && <VenueList {...props} venues={withSlots} />}
      <div className="isolate h-[420px] bg-line lg:sticky lg:top-28 lg:h-[640px] lg:self-start">
        <Suspense fallback={<div className="size-full animate-pulse bg-line" />}>
          <VenueMap venues={withSlots} selectedId={selectedId} onSelect={onSelect} />
        </Suspense>
      </div>
      {!isLg && <SelectedVenue {...props} venues={withSlots} />}
    </div>
  );
};

export default VenuesExplorer;
