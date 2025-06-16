import { getGlobalConfig, createTempDir } from '../core';
import type { IGenerateVoiceOptions } from '../types/config';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import path from 'node:path';
import fs from 'node:fs/promises';

export async function tts({
  voiceName,
  text,
  withFrontend = false,
  speed = 1.0,
  pitch = 1.0,
  volumn = 1.0,
}: IGenerateVoiceOptions): Promise<{ audio:string; duration:number; frontend?: any; }> {
  const azureConfig = getGlobalConfig('azure');
  if (!azureConfig || !azureConfig.speech) {
    throw new Error('Azure Speech Service is not configured');
  }
  const { key, region } = azureConfig.speech;

  const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
  const matches = /^\w+-\w+/.exec(voiceName);
  const lang = matches ? matches[0] : 'en-US';

  speechConfig.speechSynthesisVoiceName = voiceName;
  speechConfig.speechRecognitionLanguage = lang;
  speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio48Khz192KBitRateMonoMp3;

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  function formatProsody(speed: number, volumn: number, pitch: number): string {
    const format = (v: number): string => {
      let ret = `${Math.round((v - 1) * 100)}%`;
      if(!ret.startsWith('-')) ret = `+${ret}`;
      return ret;
    };

    return `speed="${format(speed)}" pitch="${format(pitch)}" volumn="${format(volumn)}"`;
  }

  let xml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${lang}">
  <voice name="${voiceName}"><lang xml:lang="${lang}">
    <prosody ${formatProsody(speed, volumn, pitch)}>${text}</prosody>
  </lang></voice></speak>
`;

  if (lang !== 'zh-CN') {
    const chineseCharactersReg = /[\u4e00-\u9fa5]+/;
    xml = xml.replace(chineseCharactersReg, '<lang xml:lang="zh-CN">“$&”</lang>');
  }

  let frontend: any;
  if (withFrontend) {
    frontend = {
      words: [],
    };

    let index = 0;
    synthesizer.wordBoundary = (sender, event): void => {
      let _text = event.text;
      _text = _text.replace(/<[^>]*?>/g, '').trim();

      // 忽略可能多余的标点符号
      const _index = text.slice(index).indexOf(_text);
      if (_index === -1) return;

      const textOffset = _index + index;
      index = textOffset + _text.length;

      frontend.words.push({
        audioOffset: event.audioOffset / 10000,
        text: event.text,
        textOffset,
        duration: event.duration / 10000,
        boundaryType: event.boundaryType,
      });
    };
  }
  const audioData: { data: ArrayBuffer, duration:number } = await new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      xml,
      (result: any) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          // console.log('synthesis finished.');

          // console.log(result);

          resolve({ data: result.audioData, duration: result.privAudioDuration / 1e7 });
        } else {
          // console.error(result);
          reject(new Error('SynthesizingAudioFailed'));
        }
      },
      (_error: unknown) => {
        // console.error('Error:', error);
        reject(new Error('SynthesizingAudioFailed'));
      },
    );
  });

  const tmpDir = await createTempDir();
  const audioPath = path.join(tmpDir, 'speech.mp3');
  await fs.writeFile(audioPath, Buffer.from(audioData.data));

  return { audio: audioPath, duration: audioData.duration, frontend };
}
