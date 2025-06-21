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

  const sentences = [
    {
      "words": [
        {
          "end_time": 9789,
          "start_time": 9330,
          "text": "小"
        },
        {
          "end_time": 10269,
          "start_time": 9810,
          "text": "娃"
        },
        {
          "end_time": 10829,
          "start_time": 10370,
          "text": "撑"
        },
        {
          "end_time": 11349,
          "start_time": 10890,
          "text": "小"
        },
        {
          "end_time": 11869,
          "start_time": 11410,
          "text": "艇"
        },
        {
          "end_time": 13449,
          "start_time": 11869,
          "text": ""
        }
      ],
      "text": "小娃撑小艇"
    },
    {
      "words": [
        {
          "end_time": 13909,
          "start_time": 13450,
          "text": "偷"
        },
        {
          "end_time": 14429,
          "start_time": 13970,
          "text": "采"
        },
        {
          "end_time": 14909,
          "start_time": 14450,
          "text": "白"
        },
        {
          "end_time": 15389,
          "start_time": 14930,
          "text": "莲"
        },
        {
          "end_time": 15909,
          "start_time": 15450,
          "text": "回"
        },
        {
          "end_time": 17529,
          "start_time": 15909,
          "text": ""
        }
      ],
      "text": "偷采白莲回"
    },
    {
      "words": [
        {
          "end_time": 17780,
          "start_time": 17530,
          "text": "天"
        },
        {
          "end_time": 18029,
          "start_time": 17780,
          "text": "真"
        },
        {
          "end_time": 18800,
          "start_time": 18530,
          "text": "无"
        },
        {
          "end_time": 19069,
          "start_time": 18800,
          "text": "邪"
        },
        {
          "end_time": 19640,
          "start_time": 19290,
          "text": "的"
        },
        {
          "end_time": 19800,
          "start_time": 19640,
          "text": "小"
        },
        {
          "end_time": 20069,
          "start_time": 19800,
          "text": "孩"
        },
        {
          "end_time": 21609,
          "start_time": 20069,
          "text": ""
        }
      ],
      "text": "天真无邪的小孩"
    },
    {
      "words": [
        {
          "end_time": 21960,
          "start_time": 21610,
          "text": "划"
        },
        {
          "end_time": 22200,
          "start_time": 21960,
          "text": "着"
        },
        {
          "end_time": 22549,
          "start_time": 22200,
          "text": "小"
        },
        {
          "end_time": 23069,
          "start_time": 22610,
          "text": "船"
        },
        {
          "end_time": 23549,
          "start_time": 23090,
          "text": "儿"
        },
        {
          "end_time": 23649,
          "start_time": 23549,
          "text": ""
        }
      ],
      "text": "划着小船儿"
    },
    {
      "words": [
        {
          "end_time": 24109,
          "start_time": 23650,
          "text": "去"
        },
        {
          "end_time": 24500,
          "start_time": 24130,
          "text": "把"
        },
        {
          "end_time": 24780,
          "start_time": 24500,
          "text": "那"
        },
        {
          "end_time": 25149,
          "start_time": 24780,
          "text": "白"
        },
        {
          "end_time": 25629,
          "start_time": 25170,
          "text": "莲"
        },
        {
          "end_time": 26149,
          "start_time": 25690,
          "text": "采"
        },
        {
          "end_time": 27229,
          "start_time": 26770,
          "text": "撷"
        },
        {
          "end_time": 27689,
          "start_time": 27229,
          "text": ""
        }
      ],
      "text": "去把那白莲采撷"
    },
    {
      "words": [
        {
          "end_time": 27940,
          "start_time": 27690,
          "text": "快"
        },
        {
          "end_time": 28189,
          "start_time": 27940,
          "text": "乐"
        },
        {
          "end_time": 28840,
          "start_time": 28450,
          "text": "在"
        },
        {
          "end_time": 29229,
          "start_time": 28840,
          "text": "心"
        },
        {
          "end_time": 30184,
          "start_time": 29770,
          "text": "怀"
        },
        {
          "end_time": 30184,
          "start_time": 30184,
          "text": ""
        }
      ],
      "text": "快乐在心怀"
    },
    {
      "words": [
        {
          "end_time": 34389,
          "start_time": 33930,
          "text": "不"
        },
        {
          "end_time": 34909,
          "start_time": 34450,
          "text": "解"
        },
        {
          "end_time": 35429,
          "start_time": 34970,
          "text": "藏"
        },
        {
          "end_time": 35740,
          "start_time": 35490,
          "text": "踪"
        },
        {
          "end_time": 35989,
          "start_time": 35740,
          "text": "迹"
        },
        {
          "end_time": 37989,
          "start_time": 35989,
          "text": ""
        }
      ],
      "text": "不解藏踪迹"
    },
    {
      "words": [
        {
          "end_time": 38509,
          "start_time": 38050,
          "text": "浮"
        },
        {
          "end_time": 39029,
          "start_time": 38570,
          "text": "萍"
        },
        {
          "end_time": 39549,
          "start_time": 39090,
          "text": "一"
        },
        {
          "end_time": 40029,
          "start_time": 39570,
          "text": "道"
        },
        {
          "end_time": 40549,
          "start_time": 40090,
          "text": "开"
        },
        {
          "end_time": 42169,
          "start_time": 40549,
          "text": ""
        }
      ],
      "text": "浮萍一道开"
    },
    {
      "words": [
        {
          "end_time": 42629,
          "start_time": 42170,
          "text": "他"
        },
        {
          "end_time": 43109,
          "start_time": 42650,
          "text": "不"
        },
        {
          "end_time": 43629,
          "start_time": 43170,
          "text": "知"
        },
        {
          "end_time": 44040,
          "start_time": 43690,
          "text": "隐"
        },
        {
          "end_time": 44320,
          "start_time": 44040,
          "text": "藏"
        },
        {
          "end_time": 44520,
          "start_time": 44320,
          "text": "行"
        },
        {
          "end_time": 44789,
          "start_time": 44520,
          "text": "踪"
        },
        {
          "end_time": 46249,
          "start_time": 44789,
          "text": ""
        }
      ],
      "text": "他不知隐藏行踪"
    },
    {
      "words": [
        {
          "end_time": 46709,
          "start_time": 46250,
          "text": "留"
        },
        {
          "end_time": 47229,
          "start_time": 46770,
          "text": "下"
        },
        {
          "end_time": 47520,
          "start_time": 47250,
          "text": "痕"
        },
        {
          "end_time": 47789,
          "start_time": 47520,
          "text": "迹"
        },
        {
          "end_time": 48749,
          "start_time": 48290,
          "text": "在"
        },
        {
          "end_time": 50089,
          "start_time": 48749,
          "text": ""
        }
      ],
      "text": "留下痕迹在"
    },
    {
      "words": [
        {
          "end_time": 50460,
          "start_time": 50090,
          "text": "那"
        },
        {
          "end_time": 50829,
          "start_time": 50460,
          "text": "浮"
        },
        {
          "end_time": 51309,
          "start_time": 50850,
          "text": "萍"
        },
        {
          "end_time": 51829,
          "start_time": 51370,
          "text": "被"
        },
        {
          "end_time": 52309,
          "start_time": 51850,
          "text": "分"
        },
        {
          "end_time": 52829,
          "start_time": 52370,
          "text": "开"
        },
        {
          "end_time": 54449,
          "start_time": 52829,
          "text": ""
        }
      ],
      "text": "那浮萍被分开"
    },
    {
      "words": [
        {
          "end_time": 54700,
          "start_time": 54450,
          "text": "见"
        },
        {
          "end_time": 54949,
          "start_time": 54700,
          "text": "证"
        },
        {
          "end_time": 55909,
          "start_time": 55450,
          "text": "这"
        },
        {
          "end_time": 56180,
          "start_time": 55930,
          "text": "欢"
        },
        {
          "end_time": 56429,
          "start_time": 56180,
          "text": "快"
        },
        {
          "end_time": 57089,
          "start_time": 56429,
          "text": ""
        }
      ],
      "text": "见证这欢快"
    },
    {
      "words": [
        {
          "end_time": 58989,
          "start_time": 58530,
          "text": "童"
        },
        {
          "end_time": 59509,
          "start_time": 59050,
          "text": "梦"
        },
        {
          "end_time": 59989,
          "start_time": 59530,
          "text": "逸"
        },
        {
          "end_time": 60549,
          "start_time": 60090,
          "text": "采"
        },
        {
          "end_time": 61069,
          "start_time": 60610,
          "text": "莲"
        },
        {
          "end_time": 62649,
          "start_time": 61069,
          "text": ""
        }
      ],
      "text": "童梦逸采莲"
    },
    {
      "words": [
        {
          "end_time": 63109,
          "start_time": 62650,
          "text": "欢"
        },
        {
          "end_time": 63629,
          "start_time": 63170,
          "text": "趣"
        },
        {
          "end_time": 64149,
          "start_time": 63690,
          "text": "满"
        },
        {
          "end_time": 64420,
          "start_time": 64170,
          "text": "人"
        },
        {
          "end_time": 64669,
          "start_time": 64420,
          "text": "间"
        },
        {
          "end_time": 66669,
          "start_time": 64669,
          "text": ""
        }
      ],
      "text": "欢趣满人间"
    },
    {
      "words": [
        {
          "end_time": 67020,
          "start_time": 66770,
          "text": "岁"
        },
        {
          "end_time": 67269,
          "start_time": 67020,
          "text": "月"
        },
        {
          "end_time": 68269,
          "start_time": 67810,
          "text": "多"
        },
        {
          "end_time": 68580,
          "start_time": 68330,
          "text": "美"
        },
        {
          "end_time": 68829,
          "start_time": 68580,
          "text": "妙"
        },
        {
          "end_time": 70829,
          "start_time": 68829,
          "text": ""
        }
      ],
      "text": "岁月多美妙"
    },
    {
      "words": [
        {
          "end_time": 71140,
          "start_time": 70890,
          "text": "纯"
        },
        {
          "end_time": 71389,
          "start_time": 71140,
          "text": "真"
        },
        {
          "end_time": 72389,
          "start_time": 71930,
          "text": "永"
        },
        {
          "end_time": 72660,
          "start_time": 72410,
          "text": "绵"
        },
        {
          "end_time": 72909,
          "start_time": 72660,
          "text": "延"
        },
        {
          "end_time": 73249,
          "start_time": 72909,
          "text": ""
        }
      ],
      "text": "纯真永绵延"
    },
    {
      "words": [
        {
          "end_time": 75469,
          "start_time": 75010,
          "text": "小"
        },
        {
          "end_time": 75989,
          "start_time": 75530,
          "text": "娃"
        },
        {
          "end_time": 76509,
          "start_time": 76050,
          "text": "撑"
        },
        {
          "end_time": 77029,
          "start_time": 76570,
          "text": "小"
        },
        {
          "end_time": 77549,
          "start_time": 77090,
          "text": "艇"
        },
        {
          "end_time": 79129,
          "start_time": 77549,
          "text": ""
        }
      ],
      "text": "小娃撑小艇"
    },
    {
      "words": [
        {
          "end_time": 79589,
          "start_time": 79130,
          "text": "偷"
        },
        {
          "end_time": 80109,
          "start_time": 79650,
          "text": "采"
        },
        {
          "end_time": 80589,
          "start_time": 80130,
          "text": "白"
        },
        {
          "end_time": 81069,
          "start_time": 80610,
          "text": "莲"
        },
        {
          "end_time": 81589,
          "start_time": 81130,
          "text": "回"
        },
        {
          "end_time": 83209,
          "start_time": 81589,
          "text": ""
        }
      ],
      "text": "偷采白莲回"
    },
    {
      "words": [
        {
          "end_time": 83669,
          "start_time": 83210,
          "text": "不"
        },
        {
          "end_time": 84189,
          "start_time": 83730,
          "text": "解"
        },
        {
          "end_time": 84709,
          "start_time": 84250,
          "text": "藏"
        },
        {
          "end_time": 84980,
          "start_time": 84730,
          "text": "踪"
        },
        {
          "end_time": 85229,
          "start_time": 84980,
          "text": "迹"
        },
        {
          "end_time": 87229,
          "start_time": 85229,
          "text": ""
        }
      ],
      "text": "不解藏踪迹"
    },
    {
      "words": [
        {
          "end_time": 87749,
          "start_time": 87290,
          "text": "浮"
        },
        {
          "end_time": 88269,
          "start_time": 87810,
          "text": "萍"
        },
        {
          "end_time": 88789,
          "start_time": 88330,
          "text": "一"
        },
        {
          "end_time": 89309,
          "start_time": 88850,
          "text": "道"
        },
        {
          "end_time": 89789,
          "start_time": 89330,
          "text": "开"
        },
        {
          "end_time": 89849,
          "start_time": 89789,
          "text": ""
        }
      ],
      "text": "浮萍一道开"
    },
    {
      "words": [
        {
          "end_time": 89850,
          "start_time": 89850,
          "text": "["
        },
        {
          "end_time": 90629,
          "start_time": 89850,
          "text": "outro"
        },
        {
          "end_time": 92629,
          "start_time": 90629,
          "text": "]"
        }
      ],
      "text": "小娃撑小艇，偷采白莲回。不解藏踪迹，浮萍一道开。"
    }
  ];

  const title = '池上';
  const author = '白居易';

  // 获取歌曲卡拉 OK 形式的 ASS 字幕
  const assResult = await generateAssSubtitleForSong(
    title,
    author,
    sentences,
  );

  console.log(assResult);
}
 
main();