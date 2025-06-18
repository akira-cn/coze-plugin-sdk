import * as dotenv from 'dotenv';
import { convertAudio, mergeVideoAndAudio, burnASSSubtitleToVideo, joinVideos, setGlobalConfig, uploadFile, mergeWithDelayAndStretch } from '../src';

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
  // 示例1: 音频转换
  // const url = 'https://bot.hupox.com/resource/ol6sc4mylf/09e99b75f61f4dfb83893560d6d7d2c8.wav';
  // const output = await convertAudio(url, 'mp3', 'wav');
  // const res = await uploadFile(output);
  // console.log(res);

  // 示例2: 合并视频和音频
  // const audio = 'https://bot.hupox.com/resource/ol6sc4mylf/09e99b75f61f4dfb83893560d6d7d2c8.wav';
  // const video = 'https://bot.hupox.com/resource/hiq0a23lb6/bdbfe596586e4c8c95894f270d6f7553.mp4';
  // const output1 = await mergeVideoAndAudio(video, audio);

  // const output2 = await burnASSSubtitleToVideo(output1, [{
  //   text: 'abc def',
  //   effect: '{\\an2}',
  //   start: '0:00:00.50',
  //   marginV: 100,
  // }]);
  // const res1 = await uploadFile(output2);
  // console.log(res1);

  // 示例3: 添加字幕
  // const subTitles = [
  // {
  //   'text': 'It starts where the sun meets the soil—coffee cherries ripen on sun-drenched branches.',
  //   'effect': '{\\an2}',
  //   'start': '0:00:00.50',
  //   marginV: 100,
  // }];
  // const output2 = await burnASSSubtitleToVideo('https://prod-ss-vidu.s3.cn-northwest-1.amazonaws.com.cn/infer/tasks/25/0617/12/832542276826697728/creation-01/video.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIARRHG6JR7EMNHVUWT%2F20250617%2Fcn-northwest-1%2Fs3%2Faws4_request&X-Amz-Date=20250617T125810Z&X-Amz-Expires=86400&X-Amz-SignedHeaders=host&response-cache-control=max-age%3D86400&response-content-disposition=attachment%3Bfilename%3Dvidu-general-8-2025-06-17T12%253A58%253A09Z.mp4&x-id=GetObject&X-Amz-Signature=15f850538c1faff17e8729ee29d1ff1acc0ffa79c6276569d78d135204653b54', subTitles);
  // const res2 = await uploadFile(output2);
  // console.log(res2);
  
  // 示例4: 合并多个视频
  // 使用本地资源文件进行测试
  // const videoUrls = [
  //   `https://bot.hupox.com/resource/46ame3dikp/32db5a28c13a441794354dfc0ab44153.mp4`,
  //   `https://bot.hupox.com/resource/88rjzfot26/d594f4829a90484d80ece73faee7e764.mp4`,
  //   `https://bot.hupox.com/resource/vczgzcbtev/a04944fcc41a41a999680696664b6754.mp4`,
  // ];
  
  // console.log('开始合并视频...');
  // try {
  //   const outputPath = await joinVideos(videoUrls);
  //   console.log('视频合并完成，输出路径:', outputPath);
    
  //   // 上传合并后的视频
  //   const uploadResult = await uploadFile(outputPath);
  //   console.log('视频上传完成，URL:', uploadResult.url);
  // } catch (error) {
  //   console.error('视频合并失败:', error);
  // }

  const config = {
    "audio_duration": 4.14,
    "audio_url": "https://lf9-bot-platform-tos-sign.coze.cn/bot-studio-bot-platform/bot_files/117023652459296/audio/mpeg/7517187145455632384/speech.mp3?lk3s=50ccb0c5&x-expires=1750836407&x-signature=llBVIgUgBEFqdOi86E%2BpQQqUoOE%3D",
    "video_duration": 5,
    "video_url": "https://bot.hupox.com/resource/kg6j3ksw0u/2089f81487994116a836d03021f082c0.mp4",
    "subtitle_text": "Have you ever found yourself watching a storm, waiting?"
  };

  const output1 = await mergeWithDelayAndStretch(config.video_url, config.audio_url, config.video_duration, config.audio_duration, config.subtitle_text);

  const res1 = await uploadFile(output1);
  console.log(res1);
}
 
main();