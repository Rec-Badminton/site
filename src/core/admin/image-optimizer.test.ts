import { describe, expect, it } from 'vitest';
import {
  MAX_IMAGE_DIMENSION,
  fitWithin,
  optimizeImage,
  shouldKeepOriginal
} from '@/core/admin/image-optimizer';

const fileOfSize = (size: number, type: string = 'image/png'): File =>
  new File([new Uint8Array(size)], 'image.png', { type });

describe('image optimizer', () => {
  it('scales the longest side down to the max dimension, keeping the ratio', () => {
    expect(fitWithin({ width: 5120, height: 2880 }, MAX_IMAGE_DIMENSION)).toEqual({
      width: 2560,
      height: 1440
    });
    expect(fitWithin({ width: 1000, height: 4000 }, 2000)).toEqual({ width: 500, height: 2000 });
  });

  it('never upscales', () => {
    expect(fitWithin({ width: 800, height: 600 }, MAX_IMAGE_DIMENSION)).toEqual({
      width: 800,
      height: 600
    });
  });

  it('keeps the original when WebP is unsupported or not smaller', () => {
    const original: File = fileOfSize(1000);

    expect(
      shouldKeepOriginal(original, new Blob([new Uint8Array(10)], { type: 'image/png' }))
    ).toBe(true);
    expect(
      shouldKeepOriginal(original, new Blob([new Uint8Array(1000)], { type: 'image/webp' }))
    ).toBe(true);
    expect(
      shouldKeepOriginal(original, new Blob([new Uint8Array(10)], { type: 'image/webp' }))
    ).toBe(false);
  });

  it('leaves SVG and GIF files untouched', async () => {
    const svg: File = fileOfSize(10, 'image/svg+xml');
    const gif: File = fileOfSize(10, 'image/gif');

    expect(await optimizeImage(svg)).toBe(svg);
    expect(await optimizeImage(gif)).toBe(gif);
  });
});
