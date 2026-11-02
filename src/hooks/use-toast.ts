import { useSyncExternalStore } from 'react';

export type ToastVariant = 'success' | 'error';

export interface ToastItem {
  // same id replaces the previous toast instead of stacking
  id: string;
  title: string;
  variant: ToastVariant;
}

const DURATION_MS: number = 4000;

let toasts: ToastItem[] = [];
const listeners: Set<() => void> = new Set();
const timers: Map<string, number> = new Map();

const emit = () => listeners.forEach((listener: () => void) => listener());

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export function dismissToast(id: string): void {
  window.clearTimeout(timers.get(id));
  timers.delete(id);
  toasts = toasts.filter((item: ToastItem) => item.id !== id);
  emit();
}

export function toast(item: ToastItem): void {
  window.clearTimeout(timers.get(item.id));
  toasts = [...toasts.filter((current: ToastItem) => current.id !== item.id), item];
  timers.set(
    item.id,
    window.setTimeout(() => dismissToast(item.id), DURATION_MS)
  );
  emit();
}

const useToasts = (): ToastItem[] => useSyncExternalStore(subscribe, () => toasts);

export { useToasts };
