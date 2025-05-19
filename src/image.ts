import { detectMimeType } from './utils.js';

export async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch image. Status: ${res.status}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mime = detectMimeType(buffer);

  if (!mime) {
    throw new Error('Unsupported or unknown image type.');
  }

  const base64 = buffer.toString('base64');
  return `data:${mime};base64,${base64}`;
}
