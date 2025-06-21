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

  const data = {
    "scenes": [
      {
        "duration": 6.854,
        "url": "https://s.coze.cn/t/9nAeZVanlyk/"
      },
      {
        "duration": 6.854,
        "url": "https://s.coze.cn/t/b26b2CEf4AU/"
      },
      {
        "duration": 3.427,
        "url": "https://s.coze.cn/t/or_ObN4BhkI/"
      },
      {
        "duration": 3.679,
        "url": "https://s.coze.cn/t/SFTQoh86Gjc/"
      },
      {
        "duration": 3.64,
        "url": "https://s.coze.cn/t/lqZO2dIMTp8/"
      },
      {
        "duration": 4.44,
        "url": "https://s.coze.cn/t/djz26qK6CPo/"
      },
      {
        "duration": 1.406,
        "url": "https://s.coze.cn/t/4WPDy-Qc5rY/"
      },
      {
        "duration": 6.634,
        "url": "https://s.coze.cn/t/PImUTZw28f8/"
      },
      {
        "duration": 2.28,
        "url": "https://s.coze.cn/t/zerM1Ex5s6A/"
      },
      {
        "duration": 4.44,
        "url": "https://s.coze.cn/t/wj9TBFRq50w/"
      },
      {
        "duration": 1.72,
        "url": "https://s.coze.cn/t/zg3jh4zin84/"
      },
      {
        "duration": 6.36,
        "url": "https://s.coze.cn/t/nufYy0CQzA4/"
      },
      {
        "duration": 5.04,
        "url": "https://s.coze.cn/t/6huhgtoXHjI/"
      },
      {
        "duration": 4.2,
        "url": "https://s.coze.cn/t/e2NT3Ik2L4A/"
      },
      {
        "duration": 3.64,
        "url": "https://s.coze.cn/t/rAzyIgGO6so/"
      },
      {
        "duration": 5.56,
        "url": "https://s.coze.cn/t/vCJpDmGaPeQ/"
      },
      {
        "duration": 3.28,
        "url": "https://s.coze.cn/t/mT_lK1gHKrs/"
      },
      {
        "duration": 11.545,
        "url": "https://s.coze.cn/t/oiniHE8yXZA/"
      }
    ],
    "subtitles": {
      "author": "白居易",
      "sentences": [
        {
          "text": "小娃撑小艇",
          "words": [
            {
              "attribute": {},
              "end_time": 17460,
              "start_time": 17136,
              "text": "小"
            },
            {
              "attribute": {},
              "end_time": 17783,
              "start_time": 17460,
              "text": "娃"
            },
            {
              "attribute": {},
              "end_time": 18663,
              "start_time": 18296,
              "text": "撑"
            },
            {
              "attribute": {},
              "end_time": 19260,
              "start_time": 18936,
              "text": "小"
            },
            {
              "attribute": {},
              "end_time": 19583,
              "start_time": 19260,
              "text": "艇"
            },
            {
              "attribute": {},
              "end_time": 20815,
              "start_time": 19583,
              "text": ""
            }
          ]
        },
        {
          "text": "偷采白莲回",
          "words": [
            {
              "attribute": {},
              "end_time": 21120,
              "start_time": 20816,
              "text": "偷"
            },
            {
              "attribute": {},
              "end_time": 21360,
              "start_time": 21120,
              "text": "采"
            },
            {
              "attribute": {},
              "end_time": 21663,
              "start_time": 21360,
              "text": "白"
            },
            {
              "attribute": {},
              "end_time": 22103,
              "start_time": 21736,
              "text": "莲"
            },
            {
              "attribute": {},
              "end_time": 22583,
              "start_time": 22216,
              "text": "回"
            },
            {
              "attribute": {},
              "end_time": 24455,
              "start_time": 22583,
              "text": ""
            }
          ]
        },
        {
          "text": "天真无邪的神态",
          "words": [
            {
              "attribute": {},
              "end_time": 24680,
              "start_time": 24456,
              "text": "天"
            },
            {
              "attribute": {},
              "end_time": 24903,
              "start_time": 24680,
              "text": "真"
            },
            {
              "attribute": {},
              "end_time": 25860,
              "start_time": 25656,
              "text": "无"
            },
            {
              "attribute": {},
              "end_time": 26063,
              "start_time": 25860,
              "text": "邪"
            },
            {
              "attribute": {},
              "end_time": 26983,
              "start_time": 26616,
              "text": "的"
            },
            {
              "attribute": {},
              "end_time": 27220,
              "start_time": 27016,
              "text": "神"
            },
            {
              "attribute": {},
              "end_time": 27423,
              "start_time": 27220,
              "text": "态"
            },
            {
              "attribute": {},
              "end_time": 28895,
              "start_time": 27423,
              "text": ""
            }
          ]
        },
        {
          "text": "欢乐时光难再",
          "words": [
            {
              "attribute": {},
              "end_time": 29100,
              "start_time": 28896,
              "text": "欢"
            },
            {
              "attribute": {},
              "end_time": 29300,
              "start_time": 29100,
              "text": "乐"
            },
            {
              "attribute": {},
              "end_time": 29500,
              "start_time": 29300,
              "text": "时"
            },
            {
              "attribute": {},
              "end_time": 29703,
              "start_time": 29500,
              "text": "光"
            },
            {
              "attribute": {},
              "end_time": 30100,
              "start_time": 29896,
              "text": "难"
            },
            {
              "attribute": {},
              "end_time": 30301,
              "start_time": 30100,
              "text": "再"
            },
            {
              "attribute": {},
              "end_time": 30301,
              "start_time": 30301,
              "text": ""
            }
          ]
        },
        {
          "text": "穿梭在那莲塘间",
          "words": [
            {
              "attribute": {},
              "end_time": 33260,
              "start_time": 33056,
              "text": "穿"
            },
            {
              "attribute": {},
              "end_time": 33463,
              "start_time": 33260,
              "text": "梭"
            },
            {
              "attribute": {},
              "end_time": 34343,
              "start_time": 33976,
              "text": "在"
            },
            {
              "attribute": {},
              "end_time": 35880,
              "start_time": 35576,
              "text": "那"
            },
            {
              "attribute": {},
              "end_time": 36120,
              "start_time": 35880,
              "text": "莲"
            },
            {
              "attribute": {},
              "end_time": 36260,
              "start_time": 36120,
              "text": "塘"
            },
            {
              "attribute": {},
              "end_time": 36463,
              "start_time": 36260,
              "text": "间"
            },
            {
              "attribute": {},
              "end_time": 36935,
              "start_time": 36463,
              "text": ""
            }
          ]
        },
        {
          "text": "笑容多灿烂",
          "words": [
            {
              "attribute": {},
              "end_time": 37140,
              "start_time": 36936,
              "text": "笑"
            },
            {
              "attribute": {},
              "end_time": 37343,
              "start_time": 37140,
              "text": "容"
            },
            {
              "attribute": {},
              "end_time": 37700,
              "start_time": 37416,
              "text": "多"
            },
            {
              "attribute": {},
              "end_time": 37820,
              "start_time": 37700,
              "text": "灿"
            },
            {
              "attribute": {},
              "end_time": 38023,
              "start_time": 37820,
              "text": "烂"
            },
            {
              "attribute": {},
              "end_time": 39215,
              "start_time": 38023,
              "text": ""
            }
          ]
        },
        {
          "text": "心中只有这欢乐",
          "words": [
            {
              "attribute": {},
              "end_time": 39420,
              "start_time": 39216,
              "text": "心"
            },
            {
              "attribute": {},
              "end_time": 39623,
              "start_time": 39420,
              "text": "中"
            },
            {
              "attribute": {},
              "end_time": 40783,
              "start_time": 40416,
              "text": "只"
            },
            {
              "attribute": {},
              "end_time": 41420,
              "start_time": 41096,
              "text": "有"
            },
            {
              "attribute": {},
              "end_time": 41743,
              "start_time": 41420,
              "text": "这"
            },
            {
              "attribute": {},
              "end_time": 42020,
              "start_time": 41816,
              "text": "欢"
            },
            {
              "attribute": {},
              "end_time": 42223,
              "start_time": 42020,
              "text": "乐"
            },
            {
              "attribute": {},
              "end_time": 43655,
              "start_time": 42223,
              "text": ""
            }
          ]
        },
        {
          "text": "不管未来怎样",
          "words": [
            {
              "attribute": {},
              "end_time": 43960,
              "start_time": 43656,
              "text": "不"
            },
            {
              "attribute": {},
              "end_time": 44180,
              "start_time": 43960,
              "text": "管"
            },
            {
              "attribute": {},
              "end_time": 44400,
              "start_time": 44180,
              "text": "未"
            },
            {
              "attribute": {},
              "end_time": 44703,
              "start_time": 44400,
              "text": "来"
            },
            {
              "attribute": {},
              "end_time": 44980,
              "start_time": 44776,
              "text": "怎"
            },
            {
              "attribute": {},
              "end_time": 45183,
              "start_time": 44980,
              "text": "样"
            },
            {
              "attribute": {},
              "end_time": 45375,
              "start_time": 45183,
              "text": ""
            }
          ]
        },
        {
          "text": "岁月悠悠情长",
          "words": [
            {
              "attribute": {},
              "end_time": 46380,
              "start_time": 46176,
              "text": "岁"
            },
            {
              "attribute": {},
              "end_time": 46583,
              "start_time": 46380,
              "text": "月"
            },
            {
              "attribute": {},
              "end_time": 47840,
              "start_time": 47576,
              "text": "悠"
            },
            {
              "attribute": {},
              "end_time": 48103,
              "start_time": 47840,
              "text": "悠"
            },
            {
              "attribute": {},
              "end_time": 49783,
              "start_time": 49416,
              "text": "情"
            },
            {
              "attribute": {},
              "end_time": 50263,
              "start_time": 49896,
              "text": "长"
            },
            {
              "attribute": {},
              "end_time": 51735,
              "start_time": 50263,
              "text": ""
            }
          ]
        },
        {
          "text": "童真如梦难忘",
          "words": [
            {
              "attribute": {},
              "end_time": 52103,
              "start_time": 51736,
              "text": "童"
            },
            {
              "attribute": {},
              "end_time": 52823,
              "start_time": 52456,
              "text": "真"
            },
            {
              "attribute": {},
              "end_time": 53983,
              "start_time": 53616,
              "text": "如"
            },
            {
              "attribute": {},
              "end_time": 54623,
              "start_time": 54256,
              "text": "梦"
            },
            {
              "attribute": {},
              "end_time": 55343,
              "start_time": 54976,
              "text": "难"
            },
            {
              "attribute": {},
              "end_time": 55783,
              "start_time": 55416,
              "text": "忘"
            },
            {
              "attribute": {},
              "end_time": 56775,
              "start_time": 55783,
              "text": ""
            }
          ]
        },
        {
          "text": "时光流转不停",
          "words": [
            {
              "attribute": {},
              "end_time": 56980,
              "start_time": 56776,
              "text": "时"
            },
            {
              "attribute": {},
              "end_time": 57183,
              "start_time": 56980,
              "text": "光"
            },
            {
              "attribute": {},
              "end_time": 58020,
              "start_time": 57696,
              "text": "流"
            },
            {
              "attribute": {},
              "end_time": 58343,
              "start_time": 58020,
              "text": "转"
            },
            {
              "attribute": {},
              "end_time": 58783,
              "start_time": 58416,
              "text": "不"
            },
            {
              "attribute": {},
              "end_time": 59463,
              "start_time": 59096,
              "text": "停"
            },
            {
              "attribute": {},
              "end_time": 60975,
              "start_time": 59463,
              "text": ""
            }
          ]
        },
        {
          "text": "此景心中深藏",
          "words": [
            {
              "attribute": {},
              "end_time": 61180,
              "start_time": 60976,
              "text": "此"
            },
            {
              "attribute": {},
              "end_time": 61383,
              "start_time": 61180,
              "text": "景"
            },
            {
              "attribute": {},
              "end_time": 62540,
              "start_time": 62336,
              "text": "心"
            },
            {
              "attribute": {},
              "end_time": 62743,
              "start_time": 62540,
              "text": "中"
            },
            {
              "attribute": {},
              "end_time": 63700,
              "start_time": 63496,
              "text": "深"
            },
            {
              "attribute": {},
              "end_time": 63903,
              "start_time": 63700,
              "text": "藏"
            },
            {
              "attribute": {},
              "end_time": 64615,
              "start_time": 63903,
              "text": ""
            }
          ]
        },
        {
          "text": "不解藏踪迹",
          "words": [
            {
              "attribute": {},
              "end_time": 66903,
              "start_time": 66536,
              "text": "不"
            },
            {
              "attribute": {},
              "end_time": 67583,
              "start_time": 67216,
              "text": "解"
            },
            {
              "attribute": {},
              "end_time": 68703,
              "start_time": 68336,
              "text": "藏"
            },
            {
              "attribute": {},
              "end_time": 69280,
              "start_time": 69056,
              "text": "踪"
            },
            {
              "attribute": {},
              "end_time": 69503,
              "start_time": 69280,
              "text": "迹"
            },
            {
              "attribute": {},
              "end_time": 70175,
              "start_time": 69503,
              "text": ""
            }
          ]
        },
        {
          "text": "浮萍一道开",
          "words": [
            {
              "attribute": {},
              "end_time": 70543,
              "start_time": 70176,
              "text": "浮"
            },
            {
              "attribute": {},
              "end_time": 71263,
              "start_time": 70896,
              "text": "萍"
            },
            {
              "attribute": {},
              "end_time": 71943,
              "start_time": 71576,
              "text": "一"
            },
            {
              "attribute": {},
              "end_time": 72423,
              "start_time": 72056,
              "text": "道"
            },
            {
              "attribute": {},
              "end_time": 72823,
              "start_time": 72456,
              "text": "开"
            },
            {
              "attribute": {},
              "end_time": 73455,
              "start_time": 72823,
              "text": ""
            }
          ]
        },
        {
          "text": "留下独特印记",
          "words": [
            {
              "attribute": {},
              "end_time": 73823,
              "start_time": 73456,
              "text": "留"
            },
            {
              "attribute": {},
              "end_time": 74263,
              "start_time": 73896,
              "text": "下"
            },
            {
              "attribute": {},
              "end_time": 74540,
              "start_time": 74336,
              "text": "独"
            },
            {
              "attribute": {},
              "end_time": 74743,
              "start_time": 74540,
              "text": "特"
            },
            {
              "attribute": {},
              "end_time": 75240,
              "start_time": 75016,
              "text": "印"
            },
            {
              "attribute": {},
              "end_time": 75463,
              "start_time": 75240,
              "text": "记"
            },
            {
              "attribute": {},
              "end_time": 77095,
              "start_time": 75463,
              "text": ""
            }
          ]
        },
        {
          "text": "美好永在心怀",
          "words": [
            {
              "attribute": {},
              "end_time": 77463,
              "start_time": 77096,
              "text": "美"
            },
            {
              "attribute": {},
              "end_time": 77943,
              "start_time": 77576,
              "text": "好"
            },
            {
              "attribute": {},
              "end_time": 78360,
              "start_time": 78056,
              "text": "永"
            },
            {
              "attribute": {},
              "end_time": 78663,
              "start_time": 78360,
              "text": "在"
            },
            {
              "attribute": {},
              "end_time": 79063,
              "start_time": 78696,
              "text": "心"
            },
            {
              "attribute": {},
              "end_time": 79783,
              "start_time": 79416,
              "text": "怀"
            },
            {
              "attribute": {},
              "end_time": 81783,
              "start_time": 79783,
              "text": ""
            }
          ]
        }
      ],
      "title": "池上"
    }
  }

  const output = await createKenBurnsVideoFromImages(data);

  const res1 = await uploadFile(output);
  console.log(res1);
}
 
main();