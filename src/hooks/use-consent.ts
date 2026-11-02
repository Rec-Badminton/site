import { useSyncExternalStore } from 'react';
import { hasConsent, subscribeConsent, type ConsentCategory } from '@/core/cookie-consent';

const useConsent = (category: ConsentCategory): boolean =>
  useSyncExternalStore(subscribeConsent, () => hasConsent(category));

export { useConsent };
