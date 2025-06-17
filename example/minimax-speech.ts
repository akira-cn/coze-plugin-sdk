import * as dotenv from 'dotenv';
import { minimax, setGlobalConfig, uploadFile } from '../src';

dotenv.config({
  path: ['.env.local', '.env'],
});

setGlobalConfig('jwt', {
  appId: process.env.JWT_APP_IE,
  userId: 'coze-plugin-utils',
  keyid: process.env.JWT_KEY,
  privateKey: process.env.JWT_SECRET?.replace(/\\n/g, '\n'),
});

setGlobalConfig('workflows', {
  fileUploader: '7507641509622562835',
});

setGlobalConfig('minimax', {
  apiKey: process.env.MINIMAX_API_KEY,
  groupId: process.env.MINIMAX_GROUP_ID,
});

async function main() {
  const speech = await minimax.tts({
    model: 'speech-02-hd',
    voiceName: 'English_Graceful_Lady',
    text: 'The sky was still holding onto its last dream.',
    speed: undefined,
    pitch: undefined,
    volumn: undefined,
  });
  const res = await uploadFile(speech.audio);
  console.log({...res, duration: speech.duration});
}

main();