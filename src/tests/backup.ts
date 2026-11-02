import type { SiteContent } from '@/core/content/types';
import backup from '../../backup/content.json';

// The content backup, as tests check its data and the site's logic against it.
export const BACKUP: SiteContent = backup as unknown as SiteContent;
