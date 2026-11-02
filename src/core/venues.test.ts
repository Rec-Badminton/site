import { describe, expect, it } from 'vitest';
import {
  directionsUrl,
  placeUrl,
  slotPlace,
  venueDirectionsUrl,
  venueElementId,
  venuesWithSlots,
  type VenueWithSlots
} from '@/core/venues';
import { BACKUP } from '@/tests/backup';
import type { Slot, Venue } from '@/core/content/types';

const venues: Venue[] = BACKUP.venues.items;
const slots: Slot[] = BACKUP.schedule.slots;

describe('backup venue data', () => {
  it('has unique ids', () => {
    const ids: string[] = venues.map((venue: Venue) => venue.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('places every slot in a known venue', () => {
    const orphans: Slot[] = slots.filter(
      (slot: Slot) => !venues.some((venue: Venue) => venue.id === slot.venue)
    );
    expect(orphans).toEqual([]);
  });
});

describe('venuesWithSlots', () => {
  it('gives every placed slot to its venue, in week order', () => {
    const grouped: VenueWithSlots[] = venuesWithSlots(venues, slots);

    expect(grouped.flatMap((venue: VenueWithSlots) => venue.slots)).toHaveLength(slots.length);
    for (const venue of grouped) {
      expect(venue.slots.every((slot: Slot) => slot.venue === venue.id)).toBe(true);
    }
    const harpe: VenueWithSlots = grouped.find((venue: VenueWithSlots) => venue.id === 'harpe')!;
    expect(harpe.slots.map((slot: Slot) => slot.day)).toEqual(['monday', 'tuesday', 'tuesday']);
  });
});

describe('slotPlace', () => {
  const slot: Slot = slots.find((item: Slot) => item.venue === 'harpe')!;

  it("prefers the slot's own hall name, then the venue name", () => {
    expect(slotPlace({ ...slot, place: 'Gymnase C' }, venues)).toBe('Gymnase C');
    expect(slotPlace({ ...slot, place: '' }, venues)).toBe('Complexe sportif de la Harpe');
  });

  it('is empty for a slot without place', () => {
    expect(slotPlace({ ...slot, venue: '', place: '' }, venues)).toBe('');
  });
});

describe('Google Maps links', () => {
  it('encodes the destination', () => {
    expect(directionsUrl('8 av. des Gayeulles, Rennes')).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=8%20av.%20des%20Gayeulles%2C%20Rennes'
    );
    expect(placeUrl('48.1,-1.6')).toBe(
      'https://www.google.com/maps/search/?api=1&query=48.1%2C-1.6'
    );
  });

  it('routes to the venue coordinates', () => {
    const venue: Venue = venues[0]!;
    expect(venueDirectionsUrl(venue)).toBe(directionsUrl(`${venue.lat},${venue.lng}`));
  });
});

describe('venueElementId', () => {
  it('prefixes the anchor id', () => {
    expect(venueElementId('harpe')).toBe('salle-harpe');
  });
});
