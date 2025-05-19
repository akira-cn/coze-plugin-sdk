export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function detectMimeType(buffer: Buffer): string | null {
  const hex = buffer.subarray(0, 16).toString('hex').toUpperCase();

  // 图片
  if (hex.startsWith('FFD8FF')) return 'image/jpeg';
  if (hex.startsWith('89504E470D0A1A0A')) return 'image/png';
  if (hex.startsWith('47494638')) return 'image/gif';
  if (hex.startsWith('424D')) return 'image/bmp';
  if (hex.startsWith('52494646') && hex.includes('57454250')) return 'image/webp';

  // 音频
  if (hex.startsWith('494433')) return 'audio/mpeg'; // MP3 with ID3 tag
  if (hex.startsWith('FFF')) return 'audio/mpeg'; // MP3 without ID3 tag (frame sync)
  if (hex.startsWith('4F676753')) return 'audio/ogg'; // OGG
  if (hex.startsWith('664C6143')) return 'audio/flac'; // FLAC
  if (hex.startsWith('52494646') && hex.includes('41564845')) return 'audio/wav'; // WAV (RIFF....WAVE)
  if (hex.startsWith('664C6143')) return 'audio/flac'; // FLAC

  // 视频
  if (hex.startsWith('000000186674797069736F6D')) return 'video/mp4'; // MP4 (ISO Base Media)
  if (hex.startsWith('1A45DFA3')) return 'video/webm'; // WEBM/MKV (Matroska)
  if (hex.startsWith('000001BA')) return 'video/mpeg'; // MPEG-PS
  if (hex.startsWith('000001B3')) return 'video/mpeg'; // MPEG-1
  if (hex.startsWith('52494646') && hex.includes('41564920')) return 'video/avi'; // AVI (RIFF....AVI )

  return null;
}