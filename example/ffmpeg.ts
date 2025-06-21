import * as dotenv from 'dotenv';
import path from 'path';
import { convertAudio, mergeVideoAndAudio, burnASSSubtitleToVideo, joinVideos, setGlobalConfig, uploadFile, mergeWithDelayAndStretch, createKenBurnsVideoFromImages, generateAssSubtitleForSong } from '../src';

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
  // const audio = 'https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/d697a53afe594a3f98f77d885625144b.wav';
  // const video = 'https://lf9-bot-platform-tos-sign.coze.cn/bot-studio-bot-platform/bot_files/117023652459296/video/mp4/7518402415159771170/output.mp4?lk3s=50ccb0c5&x-expires=1751119497&x-signature=otcBtG8NTW6%2BGJfVsZcDdcHAj34%3D';
  // const output1 = await mergeVideoAndAudio(video, audio);
  // const res1 = await uploadFile(output1);
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

  const config = {
    "audio_duration": 98,
    "audio_url": "https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/aecc1790804f47c9be446a9bac0beb18.wav",
    "video_duration": 97.99900000000002,
    "video_url": "https://lf6-bot-platform-tos-sign.coze.cn/bot-studio-bot-platform/bot_files/578803847402115/video/mp4/7518442500843945984/output.mp4?lk3s=50ccb0c5&x-expires=1751128851&x-signature=4zPI8vorwcdEEzfqZX%2B8oFsdalU%3D"
  };

  const output1 = await mergeWithDelayAndStretch(config.video_url, config.audio_url, config.video_duration, config.audio_duration);

  const res1 = await uploadFile(output1);
  console.log(res1);

  // 示例5: Ken Burns 效果视频生成（带字幕）
  // 使用本地测试图片生成带有 Ken Burns 效果和字幕的视频
  // console.log('开始生成 Ken Burns 效果视频（带字幕）...');
  // try {
  //   const kenBurnsOutput = await createKenBurnsVideoFromImages({
  //     scenes: [
  //       {
  //         url: `https://bot.hupox.com/resource/yc6u6d86z0/2103cbddd4514748934a6db6e7b99ad0.jpeg.jpg`,
  //         audio: 'https://bot.hupox.com/resource/l6083trqxi/de292ce5495d4519bbf30696b2e1adec.mp3.mpga',
  //         audioDelay: 0.5, // 音频延迟0.5秒播放
  //         duration: 9, // 每张图片显示3秒
  //         subtitle: '第一个场景：美丽的风景',
  //         subtitlePosition: 'bottom',
  //         subtitleDelay: 0.5, // 延迟0.5秒显示字幕
  //         subtitleFontSize: 48, // 字体大小48
  //       },
  //       {
  //         url: `https://bot.hupox.com/resource/gny5nsft0j/7044a14fa85348d192375bbad147f05f.jpeg.jpg`,
  //         audio: 'https://bot.hupox.com/resource/l6083trqxi/de292ce5495d4519bbf30696b2e1adec.mp3.mpga',
  //         audioDelay: 1.0, // 音频延迟1.0秒播放
  //         duration: 10, // 第二张图片显示4秒
  //         subtitle: '第二个场景：城市夜景',
  //         subtitlePosition: 'middle',
  //         subtitleDelay: 1.0, // 延迟1秒显示字幕
  //         subtitleFontSize: 64, // 字体大小64
  //       },
  //       {
  //         url: `https://bot.hupox.com/resource/arcxdht3wn/82fc53d1cf994db89323810749d5055e.jpeg.jpg`,
  //         audio: 'https://bot.hupox.com/resource/l6083trqxi/de292ce5495d4519bbf30696b2e1adec.mp3.mpga',
  //         audioDelay: 0.3, // 音频延迟0.3秒播放
  //         duration: 12, // 第三张图片显示3秒
  //         subtitle: '第三个场景：自然风光',
  //         subtitlePosition: 'top',
  //         subtitleDelay: 0, // 立即显示字幕
  //         subtitleFontSize: 56, // 字体大小56
  //       },
  //     ],
  //     // resolution: '1920x1080', // 高清分辨率
  //     // fadeDuration: .3, // 1.5秒的淡入淡出效果
  //     // fps: 30, // 30帧每秒
  //   });
    
  //   console.log('Ken Burns 视频生成完成，输出路径:', kenBurnsOutput);
    
  //   // 上传生成的视频
  //   const kenBurnsUploadResult = await uploadFile(kenBurnsOutput);
  //   console.log('Ken Burns 视频上传完成，URL:', kenBurnsUploadResult.url);
  // } catch (error) {
  //   console.error('Ken Burns 视频生成失败:', error);
  // }

  // const data = {
  //   "scenes": [
  //     {
  //       "duration": 4.474,
  //       "url": "https://s.coze.cn/t/L3k8YmordbY/"
  //     },
  //     {
  //       "duration": 6.711,
  //       "url": "https://s.coze.cn/t/c97nnlo6fWg/"
  //     },
  //     {
  //       "duration": 2.479,
  //       "url": "https://s.coze.cn/t/ea967kTN1_I/"
  //     },
  //     {
  //       "duration": 1.88,
  //       "url": "https://s.coze.cn/t/rNGv8X76mlc/"
  //     },
  //     {
  //       "duration": 3.12,
  //       "url": "https://s.coze.cn/t/RbO-ER1Ud6I/"
  //     },
  //     {
  //       "duration": 4.36,
  //       "url": "https://s.coze.cn/t/viebsPI4GlY/"
  //     },
  //     {
  //       "duration": 3.12,
  //       "url": "https://s.coze.cn/t/HTP0R540TpA/"
  //     },
  //     {
  //       "duration": 3.52,
  //       "url": "https://s.coze.cn/t/T-xnHtpA7qU/"
  //     },
  //     {
  //       "duration": 3.96,
  //       "url": "https://s.coze.cn/t/58R_Pxk_ds4/"
  //     },
  //     {
  //       "duration": 2.52,
  //       "url": "https://s.coze.cn/t/XpV1LDAK6FA/"
  //     },
  //     {
  //       "duration": 2.52,
  //       "url": "https://s.coze.cn/t/eWo2N2CsWKA/"
  //     },
  //     {
  //       "duration": 2.52,
  //       "url": "https://s.coze.cn/t/IqY2iJFLrOI/"
  //     },
  //     {
  //       "duration": 5,
  //       "url": "https://s.coze.cn/t/U_OT_QlGzsQ/"
  //     },
  //     {
  //       "duration": 3.84,
  //       "url": "https://s.coze.cn/t/4HZjwp-lwDY/"
  //     },
  //     {
  //       "duration": 6.11,
  //       "url": "https://s.coze.cn/t/AjZ_oHIfV5I/"
  //     },
  //     {
  //       "duration": 4.96,
  //       "url": "https://s.coze.cn/t/uaoxbF_j2Qw/"
  //     },
  //     {
  //       "duration": 5.04,
  //       "url": "https://s.coze.cn/t/RjEzuzISEvc/"
  //     },
  //     {
  //       "duration": 3.93,
  //       "url": "https://s.coze.cn/t/b7fdjGPWP2Y/"
  //     },
  //     {
  //       "duration": 3.6,
  //       "url": "https://s.coze.cn/t/9EgTXhvN1yQ/"
  //     },
  //     {
  //       "duration": 2.48,
  //       "url": "https://s.coze.cn/t/aLIs8oi7CwA/"
  //     },
  //     {
  //       "duration": 2.48,
  //       "url": "https://s.coze.cn/t/htyMlATkH0M/"
  //     },
  //     {
  //       "duration": 4.95,
  //       "url": "https://s.coze.cn/t/6VY7BfZB19Q/"
  //     },
  //     {
  //       "duration": 5.77,
  //       "url": "https://s.coze.cn/t/aU2AvpayXuc/"
  //     },
  //     {
  //       "duration": 8.655,
  //       "url": "https://s.coze.cn/t/-trDTq0xn2w/"
  //     }
  //   ],
  //   "subtitles": "{\"author\":\"白居易\",\"sentences\":[{\"text\":\"小娃撑小艇\",\"words\":[{\"attribute\":{},\"end_time\":11614,\"start_time\":11185,\"text\":\"小\"},{\"attribute\":{},\"end_time\":12214,\"start_time\":11785,\"text\":\"娃\"},{\"attribute\":{},\"end_time\":12760,\"start_time\":12385,\"text\":\"撑\"},{\"attribute\":{},\"end_time\":13100,\"start_time\":12760,\"text\":\"小\"},{\"attribute\":{},\"end_time\":13494,\"start_time\":13100,\"text\":\"艇\"},{\"attribute\":{},\"end_time\":13664,\"start_time\":13494,\"text\":\"\"}]},{\"text\":\"偷采白莲回\",\"words\":[{\"attribute\":{},\"end_time\":14020,\"start_time\":13665,\"text\":\"偷\"},{\"attribute\":{},\"end_time\":14320,\"start_time\":14020,\"text\":\"采\"},{\"attribute\":{},\"end_time\":14640,\"start_time\":14320,\"text\":\"白\"},{\"attribute\":{},\"end_time\":14960,\"start_time\":14640,\"text\":\"莲\"},{\"attribute\":{},\"end_time\":15334,\"start_time\":14960,\"text\":\"回\"},{\"attribute\":{},\"end_time\":15544,\"start_time\":15334,\"text\":\"\"}]},{\"text\":\"那可爱小娃\",\"words\":[{\"attribute\":{},\"end_time\":15974,\"start_time\":15545,\"text\":\"那\"},{\"attribute\":{},\"end_time\":16500,\"start_time\":16145,\"text\":\"可\"},{\"attribute\":{},\"end_time\":16820,\"start_time\":16500,\"text\":\"爱\"},{\"attribute\":{},\"end_time\":17214,\"start_time\":16820,\"text\":\"小\"},{\"attribute\":{},\"end_time\":17854,\"start_time\":17425,\"text\":\"娃\"},{\"attribute\":{},\"end_time\":18664,\"start_time\":17854,\"text\":\"\"}]},{\"text\":\"撑着小船儿出发\",\"words\":[{\"attribute\":{},\"end_time\":19040,\"start_time\":18665,\"text\":\"撑\"},{\"attribute\":{},\"end_time\":19340,\"start_time\":19040,\"text\":\"着\"},{\"attribute\":{},\"end_time\":19694,\"start_time\":19340,\"text\":\"小\"},{\"attribute\":{},\"end_time\":20334,\"start_time\":19905,\"text\":\"船\"},{\"attribute\":{},\"end_time\":22254,\"start_time\":21825,\"text\":\"儿\"},{\"attribute\":{},\"end_time\":22620,\"start_time\":22385,\"text\":\"出\"},{\"attribute\":{},\"end_time\":22854,\"start_time\":22620,\"text\":\"发\"},{\"attribute\":{},\"end_time\":23024,\"start_time\":22854,\"text\":\"\"}]},{\"text\":\"心中满是期待\",\"words\":[{\"attribute\":{},\"end_time\":23260,\"start_time\":23025,\"text\":\"心\"},{\"attribute\":{},\"end_time\":23494,\"start_time\":23260,\"text\":\"中\"},{\"attribute\":{},\"end_time\":24040,\"start_time\":23665,\"text\":\"满\"},{\"attribute\":{},\"end_time\":24340,\"start_time\":24040,\"text\":\"是\"},{\"attribute\":{},\"end_time\":24520,\"start_time\":24340,\"text\":\"期\"},{\"attribute\":{},\"end_time\":24774,\"start_time\":24520,\"text\":\"待\"},{\"attribute\":{},\"end_time\":26144,\"start_time\":24774,\"text\":\"\"}]},{\"text\":\"去把白莲采呀\",\"words\":[{\"attribute\":{},\"end_time\":26574,\"start_time\":26145,\"text\":\"去\"},{\"attribute\":{},\"end_time\":26880,\"start_time\":26585,\"text\":\"把\"},{\"attribute\":{},\"end_time\":27120,\"start_time\":26880,\"text\":\"白\"},{\"attribute\":{},\"end_time\":27440,\"start_time\":27120,\"text\":\"莲\"},{\"attribute\":{},\"end_time\":27814,\"start_time\":27440,\"text\":\"采\"},{\"attribute\":{},\"end_time\":29094,\"start_time\":28665,\"text\":\"呀\"},{\"attribute\":{},\"end_time\":29664,\"start_time\":29094,\"text\":\"\"}]},{\"text\":\"不解藏踪迹\",\"words\":[{\"attribute\":{},\"end_time\":31614,\"start_time\":31185,\"text\":\"不\"},{\"attribute\":{},\"end_time\":32254,\"start_time\":31825,\"text\":\"解\"},{\"attribute\":{},\"end_time\":32760,\"start_time\":32385,\"text\":\"藏\"},{\"attribute\":{},\"end_time\":32940,\"start_time\":32760,\"text\":\"踪\"},{\"attribute\":{},\"end_time\":33174,\"start_time\":32940,\"text\":\"迹\"},{\"attribute\":{},\"end_time\":33624,\"start_time\":33174,\"text\":\"\"}]},{\"text\":\"浮萍一道开\",\"words\":[{\"attribute\":{},\"end_time\":34020,\"start_time\":33625,\"text\":\"浮\"},{\"attribute\":{},\"end_time\":34360,\"start_time\":34020,\"text\":\"萍\"},{\"attribute\":{},\"end_time\":34660,\"start_time\":34360,\"text\":\"一\"},{\"attribute\":{},\"end_time\":34960,\"start_time\":34660,\"text\":\"道\"},{\"attribute\":{},\"end_time\":35334,\"start_time\":34960,\"text\":\"开\"},{\"attribute\":{},\"end_time\":36144,\"start_time\":35334,\"text\":\"\"}]},{\"text\":\"天真的他呀\",\"words\":[{\"attribute\":{},\"end_time\":36380,\"start_time\":36145,\"text\":\"天\"},{\"attribute\":{},\"end_time\":36614,\"start_time\":36380,\"text\":\"真\"},{\"attribute\":{},\"end_time\":37460,\"start_time\":37105,\"text\":\"的\"},{\"attribute\":{},\"end_time\":37760,\"start_time\":37460,\"text\":\"他\"},{\"attribute\":{},\"end_time\":38134,\"start_time\":37760,\"text\":\"呀\"},{\"attribute\":{},\"end_time\":38664,\"start_time\":38134,\"text\":\"\"}]},{\"text\":\"不知隐藏行踪啦\",\"words\":[{\"attribute\":{},\"end_time\":39040,\"start_time\":38665,\"text\":\"不\"},{\"attribute\":{},\"end_time\":39360,\"start_time\":39040,\"text\":\"知\"},{\"attribute\":{},\"end_time\":39660,\"start_time\":39360,\"text\":\"隐\"},{\"attribute\":{},\"end_time\":39960,\"start_time\":39660,\"text\":\"藏\"},{\"attribute\":{},\"end_time\":40240,\"start_time\":39960,\"text\":\"行\"},{\"attribute\":{},\"end_time\":40420,\"start_time\":40240,\"text\":\"踪\"},{\"attribute\":{},\"end_time\":40694,\"start_time\":40420,\"text\":\"啦\"},{\"attribute\":{},\"end_time\":41184,\"start_time\":40694,\"text\":\"\"}]},{\"text\":\"身后浮萍分开\",\"words\":[{\"attribute\":{},\"end_time\":41420,\"start_time\":41185,\"text\":\"身\"},{\"attribute\":{},\"end_time\":41654,\"start_time\":41420,\"text\":\"后\"},{\"attribute\":{},\"end_time\":44000,\"start_time\":43625,\"text\":\"浮\"},{\"attribute\":{},\"end_time\":44320,\"start_time\":44000,\"text\":\"萍\"},{\"attribute\":{},\"end_time\":44694,\"start_time\":44320,\"text\":\"分\"},{\"attribute\":{},\"end_time\":45334,\"start_time\":44905,\"text\":\"开\"},{\"attribute\":{},\"end_time\":46184,\"start_time\":45334,\"text\":\"\"}]},{\"text\":\"留下一道痕呀\",\"words\":[{\"attribute\":{},\"end_time\":46614,\"start_time\":46185,\"text\":\"留\"},{\"attribute\":{},\"end_time\":47480,\"start_time\":47105,\"text\":\"下\"},{\"attribute\":{},\"end_time\":47854,\"start_time\":47480,\"text\":\"一\"},{\"attribute\":{},\"end_time\":48494,\"start_time\":48065,\"text\":\"道\"},{\"attribute\":{},\"end_time\":49094,\"start_time\":48665,\"text\":\"痕\"},{\"attribute\":{},\"end_time\":49734,\"start_time\":49305,\"text\":\"呀\"},{\"attribute\":{},\"end_time\":50024,\"start_time\":49734,\"text\":\"\"}]},{\"text\":\"童梦轻舟游\",\"words\":[{\"attribute\":{},\"end_time\":51574,\"start_time\":51220,\"text\":\"童\"},{\"attribute\":{},\"end_time\":52254,\"start_time\":51825,\"text\":\"梦\"},{\"attribute\":{},\"end_time\":52854,\"start_time\":52425,\"text\":\"轻\"},{\"attribute\":{},\"end_time\":53494,\"start_time\":53065,\"text\":\"舟\"},{\"attribute\":{},\"end_time\":54134,\"start_time\":53705,\"text\":\"游\"},{\"attribute\":{},\"end_time\":56134,\"start_time\":54134,\"text\":\"\"}]},{\"text\":\"白莲香盈袖\",\"words\":[{\"attribute\":{},\"end_time\":56574,\"start_time\":56145,\"text\":\"白\"},{\"attribute\":{},\"end_time\":57214,\"start_time\":56785,\"text\":\"莲\"},{\"attribute\":{},\"end_time\":57854,\"start_time\":57425,\"text\":\"香\"},{\"attribute\":{},\"end_time\":58454,\"start_time\":58025,\"text\":\"盈\"},{\"attribute\":{},\"end_time\":59094,\"start_time\":58665,\"text\":\"袖\"},{\"attribute\":{},\"end_time\":61094,\"start_time\":59094,\"text\":\"\"}]},{\"text\":\"天真岁月悠\",\"words\":[{\"attribute\":{},\"end_time\":61420,\"start_time\":61185,\"text\":\"天\"},{\"attribute\":{},\"end_time\":61654,\"start_time\":61420,\"text\":\"真\"},{\"attribute\":{},\"end_time\":62640,\"start_time\":62385,\"text\":\"岁\"},{\"attribute\":{},\"end_time\":62894,\"start_time\":62640,\"text\":\"月\"},{\"attribute\":{},\"end_time\":64134,\"start_time\":63705,\"text\":\"悠\"},{\"attribute\":{},\"end_time\":66134,\"start_time\":64134,\"text\":\"\"}]},{\"text\":\"时光永不休\",\"words\":[{\"attribute\":{},\"end_time\":66400,\"start_time\":66145,\"text\":\"时\"},{\"attribute\":{},\"end_time\":66654,\"start_time\":66400,\"text\":\"光\"},{\"attribute\":{},\"end_time\":67854,\"start_time\":67425,\"text\":\"永\"},{\"attribute\":{},\"end_time\":68280,\"start_time\":68025,\"text\":\"不\"},{\"attribute\":{},\"end_time\":68534,\"start_time\":68280,\"text\":\"休\"},{\"attribute\":{},\"end_time\":70064,\"start_time\":68534,\"text\":\"\"}]},{\"text\":\"小娃撑小艇\",\"words\":[{\"attribute\":{},\"end_time\":71574,\"start_time\":71145,\"text\":\"小\"},{\"attribute\":{},\"end_time\":72214,\"start_time\":71785,\"text\":\"娃\"},{\"attribute\":{},\"end_time\":72760,\"start_time\":72385,\"text\":\"撑\"},{\"attribute\":{},\"end_time\":73100,\"start_time\":72760,\"text\":\"小\"},{\"attribute\":{},\"end_time\":73494,\"start_time\":73100,\"text\":\"艇\"},{\"attribute\":{},\"end_time\":73664,\"start_time\":73494,\"text\":\"\"}]},{\"text\":\"偷采白莲回\",\"words\":[{\"attribute\":{},\"end_time\":74040,\"start_time\":73665,\"text\":\"偷\"},{\"attribute\":{},\"end_time\":74360,\"start_time\":74040,\"text\":\"采\"},{\"attribute\":{},\"end_time\":74660,\"start_time\":74360,\"text\":\"白\"},{\"attribute\":{},\"end_time\":74980,\"start_time\":74660,\"text\":\"莲\"},{\"attribute\":{},\"end_time\":75374,\"start_time\":74980,\"text\":\"回\"},{\"attribute\":{},\"end_time\":76144,\"start_time\":75374,\"text\":\"\"}]},{\"text\":\"不解藏踪迹\",\"words\":[{\"attribute\":{},\"end_time\":76520,\"start_time\":76145,\"text\":\"不\"},{\"attribute\":{},\"end_time\":76840,\"start_time\":76520,\"text\":\"解\"},{\"attribute\":{},\"end_time\":77160,\"start_time\":76840,\"text\":\"藏\"},{\"attribute\":{},\"end_time\":77340,\"start_time\":77160,\"text\":\"踪\"},{\"attribute\":{},\"end_time\":77574,\"start_time\":77340,\"text\":\"迹\"},{\"attribute\":{},\"end_time\":78624,\"start_time\":77574,\"text\":\"\"}]},{\"text\":\"浮萍一道开\",\"words\":[{\"attribute\":{},\"end_time\":79054,\"start_time\":78625,\"text\":\"浮\"},{\"attribute\":{},\"end_time\":79494,\"start_time\":79065,\"text\":\"萍\"},{\"attribute\":{},\"end_time\":80600,\"start_time\":80225,\"text\":\"一\"},{\"attribute\":{},\"end_time\":80974,\"start_time\":80600,\"text\":\"道\"},{\"attribute\":{},\"end_time\":81574,\"start_time\":81145,\"text\":\"开\"},{\"attribute\":{},\"end_time\":83574,\"start_time\":81574,\"text\":\"\"}]}],\"title\":\"池上\"}"
  // }

  // const output = await createKenBurnsVideoFromImages({
  //   scenes: data.scenes,
  //   subtitles: JSON.parse(data.subtitles),
  // });

  // const res1 = await uploadFile(output);
  // console.log(res1);
}
 
main();