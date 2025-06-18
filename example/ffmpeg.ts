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
  
  // 示例4: 合并多个视频
  // 使用本地资源文件进行测试
  const videoUrls = [
      "https://lf3-bot-platform-tos-sign.coze.cn/bot-studio-bot-platform/bot_files/578803847402115/video/mp4/7517284513933230134/output.mp4?lk3s=50ccb0c5&x-expires=1750859176&x-signature=8en%2FnOvASFSmSMaTPKWNhPO9nuc%3D",
      "https://lf3-bot-platform-tos-sign.coze.cn/bot-studio-bot-platform/bot_files/578803847402115/video/mp4/7517284513933230134/output.mp4?lk3s=50ccb0c5&x-expires=1750859176&x-signature=8en%2FnOvASFSmSMaTPKWNhPO9nuc%3D",
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

  // const config = {
  //   "audio_duration": 8.1,
  //   "audio_url": "https://lf3-bot-platform-tos-sign.coze.cn/bot-studio-bot-platform/bot_files/117023652459296/audio/mpeg/7517187105270300672/speech.mp3?lk3s=50ccb0c5&x-expires=1750836406&x-signature=tMqkhnbW67xnciTu%2F%2F5aAP4pRHo%3D",
  //   "subtitle_text": "Light’s journey to your eyes is practically instantaneous. Sound’s journey… is a very different story.",
  //   "video_duration": 10,
  //   "video_url": ""
  // };

  // const output1 = await mergeWithDelayAndStretch(config.video_url, config.audio_url, config.video_duration, config.audio_duration, config.subtitle_text);

  // const res1 = await uploadFile(output1);
  // console.log(res1);
}
 
main();