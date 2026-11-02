export const MAX_IMAGE_DIMENSION: number = 2560;
export const WEBP_QUALITY: number = 0.85;

// vector or possibly animated: re-encoding would lose information
const PRESERVED_TYPES: string[] = ['image/svg+xml', 'image/gif'];

export interface Size {
  width: number;
  height: number;
}

// Scales a size down (never up) so its longest side fits max, keeping the aspect ratio.
export function fitWithin({ width, height }: Size, max: number): Size {
  const scale: number = Math.min(1, max / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

// True when the WebP encoding is unusable (unsupported browser) or not smaller.
export function shouldKeepOriginal(original: File, encoded: Blob): boolean {
  return encoded.type !== 'image/webp' || encoded.size >= original.size;
}

function toWebpName(name: string): string {
  const dotIndex: number = name.lastIndexOf('.');
  return `${dotIndex > 0 ? name.slice(0, dotIndex) : name}.webp`;
}

// Downscales and re-encodes an image to WebP before upload; any failure keeps the original.
export async function optimizeImage(file: File): Promise<File> {
  if (PRESERVED_TYPES.includes(file.type)) return file;

  try {
    // applies EXIF orientation
    const bitmap: ImageBitmap = await createImageBitmap(file);
    const size: Size = fitWithin(bitmap, MAX_IMAGE_DIMENSION);
    const canvas: OffscreenCanvas = new OffscreenCanvas(size.width, size.height);
    const context: OffscreenCanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D context unavailable');
    context.drawImage(bitmap, 0, 0, size.width, size.height);
    bitmap.close();

    const encoded: Blob = await canvas.convertToBlob({ type: 'image/webp', quality: WEBP_QUALITY });
    if (shouldKeepOriginal(file, encoded)) return file;
    return new File([encoded], toWebpName(file.name), { type: 'image/webp' });
  } catch (error) {
    console.warn(error);
    return file;
  }
}

// Natural size of an image file, null when the browser cannot decode it.
export async function readImageSize(file: File): Promise<Size | null> {
  try {
    const bitmap: ImageBitmap = await createImageBitmap(file);
    const size: Size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return null;
  }
}
