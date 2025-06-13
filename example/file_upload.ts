import path from 'node:path';
import * as dotenv from 'dotenv';
import { setGlobalConfig, uploadFile } from '../src';

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

async function main(): Promise<void> {
  const result = await uploadFile(path.resolve(__dirname, './resources/liubei_logo.png'), false);
  console.log(result);
}

main();