import * as dotenv from 'dotenv';
import { convertAudio, mergeVideoAndAudio, burnASSSubtitleToVideo, joinVideos, setGlobalConfig, uploadFile } from '../src';

dotenv.config({
  path: ['.env.local', '.env'],
});

setGlobalConfig('jwt', {
  appId: process.env.JWT_APP_IE,
  userId: 'coze-plugin-tools',
  keyid: process.env.JWT_KEY,
  privateKey: process.env.JWT_SECRET?.replace(/\\n/g, '\n'),
});

setGlobalConfig('workflows', {
  fileUploader: '7507641509622562835',
});

async function main(): Promise<void> {
  // 示例1: 音频转换
  // const url = 'https://bot.hupox.com/resource/ol6sc4mylf/09e99b75f61f4dfb83893560d6d7d2c8.wav';
  // const output = await convertAudio(url, 'mp3', 'wav');
  // const res = await uploadFile(output);
  // console.log(res);

  // 示例2: 合并视频和音频
  // const audio = 'https://bot.hupox.com/resource/ol6sc4mylf/09e99b75f61f4dfb83893560d6d7d2c8.wav';
  // const video = 'https://bot.hupox.com/resource/hiq0a23lb6/bdbfe596586e4c8c95894f270d6f7553.mp4';
  // const output1 = await mergeVideoAndAudio(video, audio);
  // const res1 = await uploadFile(output1);
  // console.log(res1);

  // 示例3: 添加字幕
  // const subTitles = [{
  //   'text': '六北科技',
  //   'effect': '{\\fnSource Han Sans CN\\fs120\\an5\\1c&HFFDE00&\\3c&Hffffff&\\bord2\\shad3\\pos(960,450)\\alpha&HFF&\\t(6000,8000,\\alpha&H00&)}',
  // }, {
  //   'text': '六方汇聚志如钢，北望征程意气扬。\\n科技领航谋远略，可依可信韵流芳。',
  //   'effect': '{\\fnSource Han Sans CN\\fs50\\an5\\1c&HFFDE00&\\3c&Hffffff&\\bord2\\shad3\\pos(960,580)\\alpha&HFF&\\t(6000,8000,\\alpha&H00&)}',
  // }];
  // const output2 = await burnASSSubtitleToVideo('https://bot.hupox.com/resource/hiq0a23lb6/bdbfe596586e4c8c95894f270d6f7553.mp4', subTitles);
  // const res2 = await uploadFile(output2);
  // console.log(res2);
  
  // 示例4: 合并多个视频
  // 使用本地资源文件进行测试
  const videoUrls = [
    `https://bot.hupox.com/resource/46ame3dikp/32db5a28c13a441794354dfc0ab44153.mp4`,
    `https://bot.hupox.com/resource/88rjzfot26/d594f4829a90484d80ece73faee7e764.mp4`,
    `https://bot.hupox.com/resource/vczgzcbtev/a04944fcc41a41a999680696664b6754.mp4`,
  ];
  
  console.log('开始合并视频...');
  try {
    const outputPath = await joinVideos(videoUrls);
    console.log('视频合并完成，输出路径:', outputPath);
    
    // 上传合并后的视频
    const uploadResult = await uploadFile(outputPath);
    console.log('视频上传完成，URL:', uploadResult.url);
  } catch (error) {
    console.error('视频合并失败:', error);
  }
}
 
main();