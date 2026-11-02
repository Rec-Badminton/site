import { useEffect, useRef, type ComponentType } from 'react';
import {
  AttributionControl,
  MapContainer,
  Marker,
  TileLayer,
  Tooltip,
  useMap
} from 'react-leaflet';
import { DomEvent, divIcon, latLngBounds, type DivIcon, type LatLngBounds } from 'leaflet';
import { useI18n } from '@mxreakit/i18n';
import { Maximize2, Minus, Plus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import type { VenueWithSlots } from '@/core/venues';

interface VenueMapProps {
  venues: VenueWithSlots[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const SELECTED_ZOOM: number = 15;
const FLY_DURATION: number = 0.6;

const pinIcon = (count: number, selected: boolean): DivIcon =>
  divIcon({
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    html: `<span class="flex size-11 items-center justify-center font-display text-2xl font-extrabold text-white shadow-[0_4px_12px_rgba(20,24,22,0.35)] [clip-path:polygon(0_0,100%_0,100%_78%,50%_100%,0_78%)] ${selected ? 'bg-ink' : 'bg-brand'}">${count}</span>`
  });

const boundsOf = (venues: VenueWithSlots[]): LatLngBounds =>
  latLngBounds(venues.map((venue: VenueWithSlots) => [venue.lat, venue.lng]));

// Fly to the selected venue, or back to the whole area.
const FocusController = ({ venues, selectedId }: Omit<VenueMapProps, 'onSelect'>) => {
  const map = useMap();

  useEffect(() => {
    const selected: VenueWithSlots | undefined = venues.find(
      (venue: VenueWithSlots) => venue.id === selectedId
    );
    if (selected) {
      map.flyTo([selected.lat, selected.lng], SELECTED_ZOOM, { duration: FLY_DURATION });
    } else {
      map.flyToBounds(boundsOf(venues), { padding: [40, 40], duration: FLY_DURATION });
    }
  }, [map, venues, selectedId]);

  return null;
};

interface ControlButton {
  labelKey: string;
  Icon: ComponentType<{ className?: string }>;
  onClick: () => void;
}

// Zoom and overview buttons in the site style, replacing Leaflet's default control.
const MapControls = ({ venues, onSelect }: Omit<VenueMapProps, 'selectedId'>) => {
  const { t } = useI18n();
  const map = useMap();
  const ref = useRef<HTMLDivElement>(null);

  // keep clicks and scrolls on the buttons from reaching the map
  useEffect(() => {
    if (!ref.current) return;
    DomEvent.disableClickPropagation(ref.current);
    DomEvent.disableScrollPropagation(ref.current);
  }, []);

  const buttons: ControlButton[] = [
    { labelKey: 'map.zoomIn', Icon: Plus, onClick: () => map.zoomIn() },
    { labelKey: 'map.zoomOut', Icon: Minus, onClick: () => map.zoomOut() },
    {
      labelKey: 'map.reset',
      Icon: Maximize2,
      onClick: () => {
        onSelect(null);
        map.flyToBounds(boundsOf(venues), { padding: [40, 40], duration: FLY_DURATION });
      }
    }
  ];

  return (
    <div
      ref={ref}
      className="absolute top-3 right-3 z-[1000] flex flex-col gap-px bg-ink-line shadow-[0_4px_12px_rgba(20,24,22,0.3)]"
    >
      {buttons.map(({ labelKey, Icon, onClick }) => (
        <button
          key={labelKey}
          type="button"
          onClick={onClick}
          title={t(labelKey)}
          aria-label={t(labelKey)}
          className="flex size-11 items-center justify-center bg-ink text-white transition-colors hover:bg-brand focus-visible:bg-brand focus-visible:outline-none"
        >
          <Icon className="size-5" aria-hidden="true" />
        </button>
      ))}
    </div>
  );
};

const VenueMap = ({ venues, selectedId, onSelect }: VenueMapProps) => (
  <MapContainer
    bounds={boundsOf(venues)}
    boundsOptions={{ padding: [40, 40] }}
    scrollWheelZoom={false}
    zoomControl={false}
    attributionControl={false}
    className="size-full"
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      className="grayscale-90 contrast-90"
    />
    <AttributionControl prefix={false} />
    {venues.map((venue: VenueWithSlots) => (
      <Marker
        key={venue.id}
        position={[venue.lat, venue.lng]}
        icon={pinIcon(venue.slots.length, venue.id === selectedId)}
        title={venue.name}
        eventHandlers={{ click: () => onSelect(venue.id) }}
      >
        <Tooltip direction="top" offset={[0, -44]}>
          {venue.name}
        </Tooltip>
      </Marker>
    ))}
    <FocusController venues={venues} selectedId={selectedId} />
    <MapControls venues={venues} onSelect={onSelect} />
  </MapContainer>
);

export default VenueMap;
