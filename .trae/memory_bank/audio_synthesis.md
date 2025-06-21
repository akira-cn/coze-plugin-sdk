# 音频合成功能记忆

## 功能概述

为 `createKenBurnsVideoFromImages` 函数添加了音频合成功能，支持为每个场景添加独立的音频文件，并可设置音频延迟播放时间。

## 新增参数

### SceneItem 接口扩展

在 `src/types/config.ts` 中的 `SceneItem` 接口新增：

```typescript
export interface SceneItem {
  // ... 原有参数
  audio?: string; // 可选音频URL
  audioDelay?: number; // 音频延迟播放时间（秒），默认0.5
}
```

## 实现细节

### 音频处理流程

1. **音频下载**：在视频处理前，先下载所有场景的音频文件
2. **时间计算**：根据场景的开始时间和 `audioDelay` 参数计算音频的实际播放时间
3. **音频延迟**：使用 FFmpeg 的 `adelay` 滤镜实现音频延迟播放
4. **音频混音**：当有多个音频时，使用 `amix` 滤镜进行混音处理

### FFmpeg 滤镜链

```bash
# 单个音频延迟
[audioIndex:a]adelay=startTime*1000|startTime*1000[a0]

# 多音频混音
[a0][a1][a2]amix=inputs=3:duration=longest[outa]

# 输出映射
-map [outv] -map [outa]
```

### 输出配置

- 音频编码：AAC
- 音频比特率：128k
- 音频采样：自动检测

## 使用示例

```typescript
const scenes = [
  {
    url: 'image1.jpg',
    audio: 'https://example.com/audio1.mp3',
    audioDelay: 0.5, // 延迟0.5秒播放
    duration: 5,
    subtitle: '场景1'
  },
  {
    url: 'image2.jpg', 
    audio: 'https://example.com/audio2.mp3',
    audioDelay: 1.0, // 延迟1.0秒播放
    duration: 4,
    subtitle: '场景2'
  }
];
```

## 错误处理

- 音频下载失败时会输出警告，但不会中断视频生成
- 支持部分场景有音频，部分场景无音频的混合模式
- 音频文件格式自动检测和转换

## 兼容性

- 向后兼容：不添加音频参数时，功能与原版本完全一致
- 支持的音频格式：MP3、WAV、AAC、M4A 等 FFmpeg 支持的格式
- 音频时长可以超过对应场景的视频时长

## 测试用例

已在 `example/ffmpeg.ts` 中更新测试用例，包含：
- 三个场景分别设置不同的 `audioDelay` 值（0.5s、1.0s、0.3s）
- 验证音频与视频的同步效果
- 验证多音频混音功能