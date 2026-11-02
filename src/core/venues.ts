import type { Slot, Venue } from '@/core/content/types';
import { groupByDay, type ScheduleDay } from '@/core/schedule';

export interface VenueWithSlots extends Venue {
  slots: Slot[];
}

// Group the weekly schedule by venue, in week order.
export function venuesWithSlots(venues: Venue[], slots: Slot[]): VenueWithSlots[] {
  const week: Slot[] = groupByDay(slots).flatMap((day: ScheduleDay) => day.slots);
  return venues.map((venue: Venue) => ({
    ...venue,
    slots: week.filter((slot: Slot) => slot.venue === venue.id)
  }));
}

// Hall name of a slot: its own, else its venue's; empty while the place is not confirmed.
export function slotPlace(slot: Slot, venues: Venue[]): string {
  return slot.place || venues.find((venue: Venue) => venue.id === slot.venue)?.name || '';
}

// Google Maps route from the visitor's position; destination is "lat,lng" or an address.
export function directionsUrl(destination: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function venueDirectionsUrl(venue: Venue): string {
  return directionsUrl(`${venue.lat},${venue.lng}`);
}

// Google Maps pin on a place; query is "lat,lng" or an address.
export function placeUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function venueElementId(id: string): string {
  return `salle-${id}`;
}
