import { useSyncExternalStore } from 'react';

export interface ConfirmRequest {
  // translation keys
  title: string;
  text: string;
  confirmLabel: string;
  // destructive actions get the brand color
  danger?: boolean;
  resolve: (confirmed: boolean) => void;
}

// at most one question at a time in the back office
let current: ConfirmRequest | null = null;
const listeners: Set<() => void> = new Set();

const emit = () => listeners.forEach((listener: () => void) => listener());

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Asks through the back office dialog; resolves to true when confirmed.
export function confirmAction(request: Omit<ConfirmRequest, 'resolve'>): Promise<boolean> {
  current?.resolve(false);
  return new Promise((resolve: (confirmed: boolean) => void) => {
    current = { ...request, resolve };
    emit();
  });
}

export function answerConfirm(confirmed: boolean): void {
  current?.resolve(confirmed);
  current = null;
  emit();
}

const useConfirmRequest = (): ConfirmRequest | null =>
  useSyncExternalStore(subscribe, () => current);

export { useConfirmRequest };
