/**
 * Coze插件工具函数库
 * 提供各种实用功能以简化Coze插件开发
 */

import { existsSync } from 'node:fs';

// 导出所有模块
export * from './core';
export * from './media';
export * from './vendor';

// 导出类型
export * from './types/config';

import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

if(ffmpegPath && existsSync(ffmpegPath)) {
  ffmpeg.setFfmpegPath(ffmpegPath as string);
}

export { ffmpeg };