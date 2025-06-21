import * as dotenv from 'dotenv';
import path from 'path';
import { convertAudio, mergeVideoAndAudio, burnASSSubtitleToVideo, joinVideos, setGlobalConfig, uploadFile, mergeWithDelayAndStretch, createKenBurnsVideoFromImages } from '../src';

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
  // const videoUrls = [
  //     "https://lf6-bot-platform-tos-sign.coze.cn/bot-studio-bot-platform/bot_files/578803847402115/video/mp4/7517292809146073100/output.mp4?lk3s=50ccb0c5&x-expires=1750861073&x-signature=gXDnFCLhWmeQnt4bSEk6xyr2YMU%3D",
  //     "https://lf6-bot-platform-tos-sign.coze.cn/bot-studio-bot-platform/bot_files/578803847402115/video/mp4/7517292809146073100/output.mp4?lk3s=50ccb0c5&x-expires=1750861073&x-signature=gXDnFCLhWmeQnt4bSEk6xyr2YMU%3D",
  //   ];
  
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

  // 示例5: Ken Burns 效果视频生成（带字幕）
  // 使用本地测试图片生成带有 Ken Burns 效果和字幕的视频
  console.log('开始生成 Ken Burns 效果视频（带字幕）...');
  try {
    const kenBurnsOutput = await createKenBurnsVideoFromImages({
      scenes: [
        {
          url: `https://bot.hupox.com/resource/yc6u6d86z0/2103cbddd4514748934a6db6e7b99ad0.jpeg.jpg`,
          audio: 'https://bot.hupox.com/resource/l6083trqxi/de292ce5495d4519bbf30696b2e1adec.mp3.mpga',
          audioDelay: 0.5, // 音频延迟0.5秒播放
          duration: 9, // 每张图片显示3秒
          subtitle: '第一个场景：美丽的风景',
          subtitlePosition: 'bottom',
          subtitleDelay: 0.5, // 延迟0.5秒显示字幕
          subtitleFontSize: 48, // 字体大小48
        },
        {
          url: `https://bot.hupox.com/resource/gny5nsft0j/7044a14fa85348d192375bbad147f05f.jpeg.jpg`,
          audio: 'https://bot.hupox.com/resource/l6083trqxi/de292ce5495d4519bbf30696b2e1adec.mp3.mpga',
          audioDelay: 1.0, // 音频延迟1.0秒播放
          duration: 10, // 第二张图片显示4秒
          subtitle: '第二个场景：城市夜景',
          subtitlePosition: 'middle',
          subtitleDelay: 1.0, // 延迟1秒显示字幕
          subtitleFontSize: 64, // 字体大小64
        },
        {
          url: `https://bot.hupox.com/resource/arcxdht3wn/82fc53d1cf994db89323810749d5055e.jpeg.jpg`,
          audio: 'https://bot.hupox.com/resource/l6083trqxi/de292ce5495d4519bbf30696b2e1adec.mp3.mpga',
          audioDelay: 0.3, // 音频延迟0.3秒播放
          duration: 12, // 第三张图片显示3秒
          subtitle: '第三个场景：自然风光',
          subtitlePosition: 'top',
          subtitleDelay: 0, // 立即显示字幕
          subtitleFontSize: 56, // 字体大小56
        },
      ],
      resolution: '1920x1080', // 高清分辨率
      fadeDuration: .3, // 1.5秒的淡入淡出效果
      fps: 30, // 30帧每秒
    });
    
    console.log('Ken Burns 视频生成完成，输出路径:', kenBurnsOutput);
    
    // 上传生成的视频
    const kenBurnsUploadResult = await uploadFile(kenBurnsOutput);
    console.log('Ken Burns 视频上传完成，URL:', kenBurnsUploadResult.url);
  } catch (error) {
    console.error('Ken Burns 视频生成失败:', error);
  }
}
 
main();