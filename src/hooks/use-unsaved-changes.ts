import { useEffect } from 'react';
import { confirmAction } from '@/hooks/use-confirm';

// at most one form is edited at a time in the back office
let unsaved: boolean = false;

export function hasUnsavedChanges(): boolean {
  return unsaved;
}

// Asks before leaving a form with unsaved changes; true when the navigation may go on.
export function confirmDiscard(): Promise<boolean> {
  if (!unsaved) return Promise.resolve(true);
  return confirmAction({
    title: 'admin.confirm.discardTitle',
    text: 'admin.form.discard',
    confirmLabel: 'admin.confirm.discard',
    danger: true
  });
}

// Click handler of a link leaving the form: holds it back until the user confirms.
export function guardNavigation(event: { preventDefault: () => void }, proceed: () => void): void {
  if (!unsaved) return;
  event.preventDefault();
  confirmDiscard().then((confirmed: boolean) => confirmed && proceed());
}

// Flags the current form as dirty, and warns before closing or reloading the tab.
const useUnsavedChanges = (dirty: boolean) => {
  useEffect(() => {
    if (!dirty) return undefined;
    unsaved = true;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => {
      unsaved = false;
      window.removeEventListener('beforeunload', warn);
    };
  }, [dirty]);
};

export { useUnsavedChanges };
