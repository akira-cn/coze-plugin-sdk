import * as dotenv from 'dotenv';
import { azure, setGlobalConfig, uploadFile } from '../src';

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

setGlobalConfig('azure', {
  speech: {
    key: process.env.AZURE_SPEECH_KEY!,
    region: process.env.AZURE_SPEECH_REGION!,
  }
});

async function main() {
  const speech = await azure.tts({
    voiceName: 'zh-CN-XiaoxiaoMultilingualNeural',
    text: '注意看，这个女孩名叫小美。',
  });
  const res = await uploadFile(speech.audio);
  console.log({...res, duration: speech.duration});
}

main();