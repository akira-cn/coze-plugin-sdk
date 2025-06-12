export function detectMimeType(buffer: Buffer): string | null {
  const header = new Uint8Array(buffer.slice(0, 20));

  function isJpeg(): boolean {
    return header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF;
  }

  function isPng(): boolean {
    return header.slice(0, 8).toString() === '\x89PNG\r\n\x1A\n';
  }

  function isGif(): boolean {
    return String.fromCharCode(...header.slice(0, 3)) === 'GIF';
  }

  function isBmp(): boolean {
    return header[0] === 0x42 && header[1] === 0x4D; // 'BM'
  }

  function isWebp(): boolean {
    const riff = String.fromCharCode(...header.slice(0, 4));
    const webp = String.fromCharCode(...header.slice(8, 12));
    return riff === 'RIFF' && webp === 'WEBP';
  }

  function isWav(): boolean {
    const riff = String.fromCharCode(...header.slice(0, 4));
    const wave = String.fromCharCode(...header.slice(8, 12));
    return riff === 'RIFF' && wave === 'WAVE';
  }

  function isMp3(): boolean {
    return header[0] === 0x49 && header[1] === 0x44 && header[2] === 0x33 // ID3 tag
        || (header[0] === 0xFF && (header[1] & 0xE0) === 0xE0); // Frame sync
  }

  function isOgg(): boolean {
    return String.fromCharCode(...header.slice(0, 4)) === 'OggS';
  }

  function isFlac(): boolean {
    return String.fromCharCode(...header.slice(0, 4)) === 'fLaC';
  }

  function isMp4(): boolean {
    return header.slice(4, 8).toString() === 'ftyp';
  }

  function isWebm(): boolean {
    return header[0] === 0x1A && header[1] === 0x45 && header[2] === 0xDF && header[3] === 0xA3;
  }

  function isMpeg(): boolean {
    return header[0] === 0x00 && header[1] === 0x00 && header[2] === 0x01
        && (header[3] === 0xBA || header[3] === 0xB3);
  }

  function isAvi(): boolean {
    const riff = String.fromCharCode(...header.slice(0, 4));
    const avi = String.fromCharCode(...header.slice(8, 11));
    return riff === 'RIFF' && avi === 'AVI';
  }

  if (isJpeg()) return 'image/jpeg';
  if (isPng()) return 'image/png';
  if (isGif()) return 'image/gif';
  if (isBmp()) return 'image/bmp';
  if (isWebp()) return 'image/webp';

  if (isMp3()) return 'audio/mpeg';
  if (isOgg()) return 'audio/ogg';
  if (isFlac()) return 'audio/flac';
  if (isWav()) return 'audio/wav';

  if (isMp4()) return 'video/mp4';
  if (isWebm()) return 'video/webm';
  if (isMpeg()) return 'video/mpeg';
  if (isAvi()) return 'video/avi';

  return null;
}