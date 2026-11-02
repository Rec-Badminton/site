import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PRICE_OPTIONS: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0
};

// 70 -> "70 €" in French, "€70" in English
export function formatPrice(euros: number, locale: string): string {
  return euros.toLocaleString(locale, PRICE_OPTIONS);
}

// "2026-11-02T05:00:00Z" -> "02/11/2026" in French, "11/02/2026" in English
export function formatDate(iso: string, locale: string): string {
  return new Date(iso).toLocaleDateString(locale, { timeZone: 'Europe/Paris' });
}

// a fresh object per request, so asking twice for the same target replays the effect
export interface FocusRequest {
  id: string;
  at: number;
}

export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//.test(href);
}

export function mailTo(email: string): string {
  return `mailto:${email}`;
}

// "02 99 03 90 78" -> "tel:0299039078"
export function telTo(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

// "https://www.lardesports.com/" -> "lardesports.com"
export function displayHost(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return href;
  }
}

// Sets one search param, leaving any other in place; an invalid URL is returned as is.
export function withSearchParam(href: string, name: string, value: string): string {
  try {
    const url: URL = new URL(href);
    url.searchParams.set(name, value);
    return url.toString();
  } catch {
    return href;
  }
}
