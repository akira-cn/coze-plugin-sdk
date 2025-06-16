import path from 'node:path';
import fs from 'node:fs/promises';
import { createTempDir, getGlobalConfig } from '../core';
import type { IGenerateVoiceOptions, EVoiceEmotion } from '../types/config';

export async function tts({
  model,
  voiceName,
  text,
  speed = 1.0,
  pitch = 0,
  volumn = 1.0,
  emotion = 'neutral' as EVoiceEmotion,
}: IGenerateVoiceOptions & { model: string }): Promise<any> {
  const config = getGlobalConfig('minimax');

  if (!config) {
    throw new Error('请先配置minimax');
  }

  const api = `https://api.minimaxi.com/v1/t2a_v2?GroupId=${config.groupId}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`,
  };

  const payload = {
    model,
    text,
    stream: false,
    voice_setting: {
      voice_id: voiceName,
      speed,
      pitch,
      vol: volumn,
      emotion,
    },
    pronunciation_dict:{
      tone: ['处理/(chu3)(li3)', '危险/dangerous'],
    },
    audio_setting: {
      sample_rate: 32000,
      bitrate: 128000,
      format: 'mp3',
      channel: 1,
    },
  };

  // console.log(api, payload);

  const res = await fetch(api, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if(!res.ok) {
    throw new Error(`请求失败: ${res.status}`);
  }

  const { data, extra_info } = await res.json();
  const tmpDir = await createTempDir();
  const audioPath = path.join(tmpDir, 'speech.mp3');
  await fs.writeFile(audioPath, Buffer.from(data.audio, 'hex'));
  return { audio: audioPath, duration: extra_info.audio_length / 1000 };
}