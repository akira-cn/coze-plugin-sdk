import * as dotenv from 'dotenv';
import { oss, setGlobalConfig } from '../src';

dotenv.config({
  path: ['.env.local', '.env'],
});

setGlobalConfig('jwt', {
  appId: process.env.JWT_APP_IE,
  userId: 'coze-plugin-tools',
  keyid: process.env.JWT_KEY,
  privateKey: process.env.JWT_SECRET?.replace(/\\n/g, '\n'),
});

setGlobalConfig('aliyun', {
  oss: {
    bucket: 'liubei-ai',
    region: 'oss-cn-beijing',
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID as string,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET as string,
    cdnUrl: 'https://bot.hupox.com',
  },
});

async function main() {
  const file = 'https://lf6-bot-platform-tos-sign.coze.cn/bot-studio-bot-platform/bot_files/578803847402115/video/mp4/7514692547747938314/upload.mp4?lk3s=50ccb0c5&x-expires=1750255776&x-signature=%2Fec8%2BTvP1NaiZXg%2F6W0b%2FDWRDvg%3D';
  const res = await oss.uploadFromURL(file);
  console.log(res);
}

main();