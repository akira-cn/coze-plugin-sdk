import * as dotenv from 'dotenv';
import { setGlobalConfig, vidu } from '../src';

dotenv.config({
  path: ['.env.local', '.env'],
});

setGlobalConfig({
  vidu: {
    apiKey: process.env.VIDU_API_KEY as string,
  },
});

async function main(): Promise<void> {
  const res = await vidu.textToVideo({
    model: 'vidu1.5',
    prompt: '一朵花开在山崖上',
    bgm: true,
  });
  console.log(res);
}

main();