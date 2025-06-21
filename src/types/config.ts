// 用来给 Coze 鉴权
export interface IJWTConfig {
  appId: string,
  userId: string,
  keyid: string,
  privateKey: string,
}

export interface IWorkflows {
  [key: string]: string;
  fileUploader: string; // 用来上传临时文件
}

export interface IOSSConfig {
  oss: {
    bucket: string;
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    cdnUrl: string;
  }
}

export interface IBrowserConfig {
  apiKey: string; // browserless token
}

export interface IViduConfig {
  apiKey: string; // vidu API密钥
}

export interface IAzureConfig {
  speech: {
    key: string;
    region: string;
  }
}

export interface IMinimaxConfig {
  apiKey: string;
  groupId: string;
}

export interface IGlobalConfig {
  baseUrl: string; // 默认值 https://api.coze.cn,
  workflows?: IWorkflows;
  jwt?: IJWTConfig;
  aliyun?: IOSSConfig;
  browser?: IBrowserConfig;
  vidu?: IViduConfig;
  azure?: IAzureConfig;
  minimax?: IMinimaxConfig;
}

export interface IGenerateVoiceOptions {
  voiceName: string;
  text: string;
  withFrontend?: boolean;
  speed?: number,
  pitch?: number,
  volumn?: number,
  emotion?: EVoiceEmotion,
}

export enum EVoiceEmotion {
  happy = 'happy',   // "sad", "angry", "fearful", "disgusted", "surprised", "neutral"
  sad = 'sad',
  angry = 'angry',
  fearful = 'fearful',
  disgusted = 'disgusted',
  surprised = 'surprised',
  neutral = 'neutral',
}

export interface SceneItem {
  url: string;
  duration: number; // 每张图展示时间（秒）
  subtitle?: string; // 可选字幕文本
  subtitlePosition?: 'top' | 'middle' | 'bottom'; // 字幕位置
  subtitleDelay?: number; // 字幕延迟显示时间（秒）
  subtitleFontSize?: number; // 字幕字体大小，默认60
  audio?: string; // 可选音频URL
  audioDelay?: number; // 音频延迟播放时间（秒），默认0.5
}

export interface IAssSongPart {
  words: {
    end_time: number;
    start_time: number;
    text: string;
  }[];
  text: string
}

export interface KenBurnsOptions {
  scenes: SceneItem[];
  resolution?: string;   // 默认 1280x720
  fadeDuration?: number; // 默认 1 秒
  fps?: number;          // 默认 25
  enableShake?: boolean; // 是否启用抖动效果，默认 false
  shakeIntensity?: number; // 抖动强度，默认 0.02（2%）
  subtitles?: { title: string; author: string; sentences: IAssSongPart[] }; // 卡拉OK字幕参数
}