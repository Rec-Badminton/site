import type { ComponentType } from 'react';
import {
  CalendarDays,
  DatabaseBackup,
  FileText,
  Feather,
  Handshake,
  HardDrive,
  Images,
  Languages,
  MapPin,
  RefreshCw,
  Megaphone,
  Settings,
  ShoppingBag,
  Trophy,
  type LucideIcon
} from 'lucide-react';
import { contentSection } from '@/components/admin/content/content-section';
import {
  bannerFields,
  competitionFields,
  membershipsFields,
  pagesFields,
  partnersFields,
  photosFields,
  scheduleFields,
  settingsFields,
  shopContentFields,
  venuesFields
} from '@/components/admin/content/schemas';
import TextsEditor from '@/components/admin/texts/TextsEditor';
import BackupSection from '@/components/admin/backup/BackupSection';
import FilesSection from '@/components/admin/files/FilesSection';
import SyncSection from '@/components/admin/sync/SyncSection';
import { Constants } from '@/core/constants';

// A back office page: adding one here adds its route, its navigation entry and its overview card.
// Copy lives under admin.sections.<path>.label and .description.
export interface AdminSection {
  path: string;
  // tools sit next to the overview, above the content sections
  group: 'tools' | 'content';
  icon: LucideIcon;
  component: ComponentType;
}

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    path: 'settings',
    group: 'content',
    icon: Settings,
    component: contentSection('settings', settingsFields)
  },
  {
    path: 'banner',
    group: 'content',
    icon: Megaphone,
    component: contentSection('banner', bannerFields)
  },
  {
    path: 'schedule',
    group: 'content',
    icon: CalendarDays,
    component: contentSection('schedule', scheduleFields)
  },
  {
    path: 'venues',
    group: 'content',
    icon: MapPin,
    component: contentSection('venues', venuesFields)
  },
  {
    path: 'memberships',
    group: 'content',
    icon: Feather,
    component: contentSection('memberships', membershipsFields)
  },
  {
    path: 'shop',
    group: 'content',
    icon: ShoppingBag,
    component: contentSection('shop', shopContentFields)
  },
  {
    path: 'competition',
    group: 'content',
    icon: Trophy,
    component: contentSection('competition', competitionFields)
  },
  {
    path: 'photos',
    group: 'content',
    icon: Images,
    component: contentSection('photos', photosFields)
  },
  {
    path: 'partners',
    group: 'content',
    icon: Handshake,
    component: contentSection('partners', partnersFields)
  },
  {
    path: 'pages',
    group: 'content',
    icon: FileText,
    component: contentSection('pages', pagesFields)
  },
  { path: 'sync', group: 'tools', icon: RefreshCw, component: SyncSection },
  { path: 'files', group: 'tools', icon: HardDrive, component: FilesSection },
  { path: 'texts', group: 'tools', icon: Languages, component: TextsEditor },
  { path: 'backup', group: 'tools', icon: DatabaseBackup, component: BackupSection }
];

export function adminPath(...segments: string[]): string {
  return [Constants.ROUTE_ADMIN, ...segments].join('/');
}
