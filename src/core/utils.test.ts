import { describe, expect, it } from 'vitest';
import {
  cn,
  displayHost,
  formatPrice,
  isExternalUrl,
  mailTo,
  telTo,
  withSearchParam
} from '@/core/utils';

// Intl separates with narrow no-break spaces
function normalizeSpaces(value: string): string {
  return value.replace(/\s/g, ' ');
}

describe('formatPrice', () => {
  it('formats whole euros per locale', () => {
    expect(normalizeSpaces(formatPrice(70, 'fr-FR'))).toBe('70 €');
    expect(formatPrice(70, 'en-GB')).toBe('€70');
  });

  it('rounds to whole euros and groups thousands', () => {
    expect(normalizeSpaces(formatPrice(1234.6, 'fr-FR'))).toBe('1 235 €');
    expect(formatPrice(1234.6, 'en-GB')).toBe('€1,235');
  });
});

describe('cn', () => {
  it('lets later Tailwind classes win', () => {
    expect(cn('p-2 text-sm', { hidden: false }, 'p-4')).toBe('text-sm p-4');
  });
});

describe('link helpers', () => {
  it('tells external URLs from site paths', () => {
    expect(isExternalUrl('https://recbadminton.fr')).toBe(true);
    expect(isExternalUrl('/creneaux?jour=monday')).toBe(false);
  });

  it('builds mail and phone links', () => {
    expect(mailTo('club@example.org')).toBe('mailto:club@example.org');
    expect(telTo('02 99 03 90 78')).toBe('tel:0299039078');
    expect(telTo('+33 2 99 03 90 78')).toBe('tel:+33299039078');
  });

  it('shows the bare host of a URL', () => {
    expect(displayHost('https://www.lardesports.com/')).toBe('lardesports.com');
    expect(displayHost('not a url')).toBe('not a url');
  });

  it('sets a search param without dropping the others', () => {
    expect(withSearchParam('https://forms.example.org/viewform', 'usp', 'header')).toBe(
      'https://forms.example.org/viewform?usp=header'
    );
    expect(withSearchParam('https://example.org/?a=1&usp=x', 'usp', 'dialog')).toBe(
      'https://example.org/?a=1&usp=dialog'
    );
  });
});
