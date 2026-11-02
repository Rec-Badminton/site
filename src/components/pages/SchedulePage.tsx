import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useI18n } from '@mxreakit/i18n';
import PageLayout from '@/components/custom/PageLayout';
import PageHero from '@/components/custom/PageHero';
import Section from '@/components/ui/Section';
import ConsentGate from '@/components/ui/ConsentGate';
import WeekSchedule from '@/components/sections/WeekSchedule';
import SchedulePdfButton from '@/components/sections/SchedulePdfButton';
import VenuesExplorer from '@/components/sections/venues/VenuesExplorer';
import OutboundLink from '@/components/ui/OutboundLink';
import FeatherIcon from '@/components/ui/FeatherIcon';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import { Constants } from '@/core/constants';
import type { Level, Membership, Slot } from '@/core/content/types';
import { DAY_PARAM, SLOT_PARAM, defaultDay, groupByDay, slotKey } from '@/core/schedule';
import { withSearchParam, type FocusRequest } from '@/core/utils';

const VENUES_ID: string = 'salles';

const SchedulePage = () => {
  const { t } = useI18n();
  const { localize } = useLanguage();
  const { schedule, memberships, settings, photos, pages } = useSiteContent();
  const [day, setDay] = useState<string>(() => defaultDay(groupByDay(schedule.slots)));
  const [slotFocus, setSlotFocus] = useState<FocusRequest | null>(null);
  const [venueId, setVenueId] = useState<string | null>(null);
  const [venueFocus, setVenueFocus] = useState<FocusRequest | null>(null);
  const [searchParams] = useSearchParams();
  const [handledSearch, setHandledSearch] = useState<string | null>(null);

  // links like the header banner point at one slot: open its day and flash it
  if (searchParams.toString() !== handledSearch) {
    setHandledSearch(searchParams.toString());
    const linkedDay: string | null = searchParams.get(DAY_PARAM);
    const linkedSlot: string | null = searchParams.get(SLOT_PARAM);
    if (linkedDay && linkedSlot) {
      setDay(linkedDay);
      setSlotFocus((previous: FocusRequest | null) => ({
        id: linkedSlot,
        at: (previous?.at ?? 0) + 1
      }));
    }
  }

  const changeDay = (next: string) => {
    setDay(next);
    setSlotFocus(null);
  };
  const showVenue = (slot: Slot) => {
    if (!slot.venue) {
      document.getElementById(VENUES_ID)?.scrollIntoView();
      return;
    }
    setVenueId(slot.venue);
    setVenueFocus({ id: slot.venue, at: Date.now() });
  };
  const showSlot = (slot: Slot) => {
    setDay(slot.day);
    setSlotFocus({ id: slotKey(slot), at: Date.now() });
  };

  return (
    <PageLayout meta={{ key: 'sessions', path: Constants.ROUTE_SCHEDULE }}>
      <PageHero title={t('nav.sessions')} image={photos.heroes.sessions}>
        {t('sessions.hero')}
      </PageHero>

      <Section className="bg-sand">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <h2 className="section-title">{t('sessions.week')}</h2>
          <SchedulePdfButton className="btn btn-dark" />
        </div>
        <WeekSchedule
          day={day}
          onDayChange={changeDay}
          focus={slotFocus}
          onPlaceClick={showVenue}
        />
      </Section>

      <Section id={VENUES_ID} className="bg-ink text-white">
        <h2 className="section-title mb-2">{t('sessions.venues.title')}</h2>
        <p className="mb-8 text-muted-light">{t('sessions.venues.text')}</p>
        <div className="text-ink">
          <VenuesExplorer
            selectedId={venueId}
            focus={venueFocus}
            onSelect={setVenueId}
            onSlotClick={showSlot}
          />
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap gap-12">
          <div className="min-w-0 flex-[2_1_520px]">
            <h2 className="section-title mb-7">{t('sessions.who')}</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              {memberships.items.map((membership: Membership) => (
                <li key={membership.id} className="flex items-center gap-4 bg-sand p-4">
                  <FeatherIcon color={membership.color} className="size-10 shrink-0" />
                  <div>
                    <p className="font-display text-2xl leading-tight font-extrabold">
                      {localize(membership.label)}
                    </p>
                    <p className="text-[15px] text-muted">{localize(membership.description)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0 flex-[1_1_320px]">
            <h2 className="section-title mb-7">{t('sessions.levels')}</h2>
            <p className="mb-4 text-muted">{t('sessions.levels.text')}</p>
            <dl className="flex flex-col gap-3">
              {pages.levels.map((level: Level, index: number) => (
                <div key={index} className="bg-sand px-5 py-4">
                  <dt className="font-display text-2xl font-extrabold text-brand uppercase">
                    {localize(level.title)}
                  </dt>
                  <dd>{localize(level.text)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {settings.links.calendar && (
        <Section className="bg-sand">
          <h2 className="section-title mb-7">{t('sessions.calendar')}</h2>
          <ConsentGate
            category="embeds"
            provider="Google Agenda"
            fallbackUrl={settings.links.calendar}
            className="h-[600px]"
          >
            <iframe
              title={t('sessions.calendar')}
              src={settings.links.calendar}
              className="h-[600px] w-full border-0 bg-white"
            />
          </ConsentGate>
        </Section>
      )}

      <section className="bg-brand text-white">
        <div className="container-site flex flex-wrap items-center justify-between gap-8 py-16">
          <div className="flex-[1_1_520px]">
            <h2 className="section-title mb-3">{t('sessions.full.title')}</h2>
            <p className="max-w-2xl text-[19px]">{t('sessions.full.text')}</p>
          </div>
          <OutboundLink
            href={withSearchParam(settings.links.waitingList, 'usp', 'header')}
            className="btn btn-light"
          >
            {t('common.waitlist')}
          </OutboundLink>
        </div>
      </section>
    </PageLayout>
  );
};

export default SchedulePage;
