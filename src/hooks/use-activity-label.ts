import { useCallback } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { useSiteContent } from '@/hooks/use-site-content';
import type { Activity, Slot } from '@/core/content/types';

// Localized name of a slot's activity; empty when the activity was deleted.
const useActivityLabel = (): ((slot: Slot) => string) => {
  const { localize } = useLanguage();
  const { activities } = useSiteContent().schedule;

  return useCallback(
    (slot: Slot): string =>
      localize(activities.find((activity: Activity) => activity.id === slot.activity)?.label),
    [localize, activities]
  );
};

export { useActivityLabel };
