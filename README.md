# Coze 插件工具函数库

这是一个为 Coze 插件开发提供实用工具函数的 TypeScript 库。该库提供了多种实用功能，帮助开发者更轻松地构建 Coze 插件。

## 功能特点

- **全局配置管理**：提供统一的配置管理机制，支持设置和获取全局配置
- **实用工具函数**：提供常用的辅助函数，如 `sleep` 延时函数
- **MIME 类型检测**：支持检测多种文件类型的 MIME 类型
- **图像处理**：支持图像获取和 Base64 转换
- **音视频处理**：
  - 音频格式转换（支持 mp3、wav、ogg、flac 等格式）
  - 视频与音频合并
  - 视频字幕添加（ASS 格式）
  - 多个视频文件合并
- **第三方 API 集成**：支持与 Vidu API 集成的视频处理功能

## 安装

使用 npm 安装：

```bash
npm install coze-plugin-sdk
```

或使用 yarn：

```bash
yarn add coze-plugin-sdk
```

或使用 pnpm：

```bash
pnpm add coze-plugin-sdk
```

## 使用示例

### 配置管理

```typescript
import { setGlobalConfig, getGlobalConfig } from 'coze-plugin-sdk';

// 设置全局配置
setGlobalConfig({
  baseUrl: 'https://custom-api.coze.cn',
  jwt: {
    appId: 'your-app-id',
    userId: 'your-user-id',
    keyid: 'your-key-id',
    privateKey: 'your-private-key'
  }
});

// 获取配置
const config = getGlobalConfig();
console.log(`API 基础地址: ${config.baseUrl}`);

// 按键获取特定配置
const jwt = getGlobalConfig('jwt');
if (jwt) {
  console.log(`应用 ID: ${jwt.appId}`);
}
```

### 基础工具函数

```typescript
import { sleep, detectMimeType } from 'coze-plugin-utils';

// 使用 sleep 函数延迟执行
async function delayedOperation() {
  console.log('开始操作');
  await sleep(1000); // 延迟 1 秒
  console.log('延迟后继续');
}

// 检测文件 MIME 类型
const buffer = Buffer.from(/* 文件数据 */);
const mimeType = detectMimeType(buffer);
console.log(`文件类型: ${mimeType}`);
```

### 图像处理

```typescript
import { fetchImageAsBase64 } from 'coze-plugin-utils';

async function getImage() {
  try {
    const imageUrl = 'https://example.com/image.jpg';
    const base64Image = await fetchImageAsBase64(imageUrl);
    console.log('图像已转换为 Base64 格式');
    // 使用 base64Image 进行后续操作
  } catch (error) {
    console.error('获取图像失败:', error);
  }
}
```

### 音频处理

```typescript
import { convertAudio } from 'coze-plugin-utils';

async function processAudio() {
  try {
    // 将音频从 WAV 格式转换为 MP3 格式
    const outputPath = await convertAudio('https://example.com/audio.wav', 'mp3');
    console.log(`音频已转换，输出路径: ${outputPath}`);
    
    // 自动检测源格式并转换为 OGG 格式
    const oggPath = await convertAudio('https://example.com/unknown-audio', 'ogg');
    console.log(`音频已转换为 OGG 格式: ${oggPath}`);
  } catch (error) {
    console.error('音频处理失败:', error);
  }
}
```

### 视频处理

```typescript
import { mergeVideoAndAudio, burnASSSubtitleToVideo, joinVideos } from 'coze-plugin-utils';

async function processVideos() {
  try {
    // 合并视频和音频
    const mergedPath = await mergeVideoAndAudio(
      'https://example.com/video.mp4',
      'https://example.com/audio.mp3'
    );
    console.log(`视频和音频已合并: ${mergedPath}`);
    
    // 添加字幕到视频
    const subtitledPath = await burnASSSubtitleToVideo(
      'https://example.com/video.mp4',
      [{ text: '这是一个示例字幕', effect: '{\\pos(960,1000)}', start: '0:00:01.00', end: '0:00:05.00' }]
    );
    console.log(`字幕已添加到视频: ${subtitledPath}`);
    
    // 合并多个视频文件
    const joinedPath = await joinVideos([
      'https://example.com/video1.mp4',
      'https://example.com/video2.mp4',
      'https://example.com/video3.mp4'
    ]);
    console.log(`多个视频已合并: ${joinedPath}`);
  } catch (error) {
    console.error('视频处理失败:', error);
  }
}
```

### 第三方 API 集成

```typescript
import { setGlobalConfig, vidu, getViduResult } from 'coze-plugin-utils';

// 设置全局配置
setGlobalConfig('vidu', {
  apiKey: 'your_vidu_api_key'
});

async function generateVideo() {
  try {
    // 根据文本生成视频
    const textVideoResult = await vidu.textToVideo({
      model: 'vidu1.5',
      prompt: '一朵花开在山崖上',
      bgm: true,
    });
    console.log('文本生成视频结果:', textVideoResult);
    
    // 根据图片生成视频
    const imageVideoResult = await vidu.imageToVideo({
      model: 'vidu1.5',
      prompt: '花朵绽放',
      image: 'https://example.com/flower.jpg',
      bgm: true,
    });
    console.log('图片生成视频结果:', imageVideoResult);
    
    // 根据起始和结束图片生成视频
    const startEndVideoResult = await vidu.startEndToVideo({
      model: 'vidu1.5',
      prompt: '花朵从含苞到绽放',
      start_image: 'https://example.com/flower_bud.jpg',
      end_image: 'https://example.com/flower_bloom.jpg',
      bgm: true,
    });
    console.log('起始结束图片生成视频结果:', startEndVideoResult);
    
    // 根据参考视频生成新视频
    const referenceVideoResult = await vidu.referenceToVideo({
      model: 'vidu1.5',
      prompt: '花朵在风中摇曳',
      reference_video: 'https://example.com/flower_video.mp4',
      bgm: true,
    });
    console.log('参考视频生成结果:', referenceVideoResult);
    
    // 生成音频
    const audioResult = await vidu.textToAudio({
      model: 'vidu_audio',
      prompt: '轻柔的钢琴曲',
      duration: 30, // 30秒
    });
    console.log('文本生成音频结果:', audioResult);
  } catch (error) {
    console.error('生成失败:', error);
  }
}

async function checkVideoTask() {
  const taskId = 'your_task_id';
  
  try {
    // 方法1：使用全局配置获取视频处理结果
    const result = await getViduResult(taskId);
    
    // 方法2：直接传入apiKey
    const apiKey = 'your_vidu_api_key';
    const result2 = await getViduResult(apiKey, taskId);
    
    if (result.state === 'success') {
      console.log('视频处理成功:', result.creations);
    } else {
      console.log('视频处理状态:', result.state);
      if (result.errorMsg) {
        console.error('错误信息:', result.errorMsg);
      }
    }
  } catch (error) {
    console.error('获取视频结果失败:', error);
  }
}
```

## API 文档

### 配置管理 (config.ts)

配置管理模块提供了统一的全局配置管理功能，允许设置和获取全局配置，所有工具依赖的配置都可以通过该模块获取。

#### 配置结构

```typescript
interface IGlobalConfig {
  baseUrl: string; // 默认值 https://api.coze.cn
  workflows?: IWorkflows;
  jwt?: IJWTConfig;
}

interface IJWTConfig {
  appId: string;
  userId: string;
  keyid: string;
  privateKey: string;
}

interface IWorkflows {
  [key: string]: string;
  fileUploader?: string; // 用来上传临时文件
}
```

#### API

- `setGlobalConfig(config: Partial<IGlobalConfig>): IGlobalConfig` - 设置全局配置，将传入的配置与现有配置合并
- `setGlobalConfig<K extends keyof IGlobalConfig>(key: K, config: ...): IGlobalConfig` - 设置特定配置项
- `getGlobalConfig(): IGlobalConfig` - 获取完整的全局配置
- `getGlobalConfig<K extends keyof IGlobalConfig>(key: K): IGlobalConfig[K]` - 获取特定配置项
- `resetGlobalConfig(): IGlobalConfig` - 重置全局配置到默认值

#### 特性

- 支持深度合并嵌套对象（如 workflows 和 jwt）
- 返回配置副本，防止直接修改
- 类型安全，提供完整的 TypeScript 类型支持
- 支持按键设置和获取特定配置项

#### 使用示例

```typescript
import { setGlobalConfig, getGlobalConfig } from 'coze-plugin-utils';

// 设置整个配置对象
setGlobalConfig({
  baseUrl: 'https://custom-api.coze.cn',
  jwt: {
    appId: 'your-app-id',
    keyid: 'your-key-id',
    privateKey: 'your-private-key'
  }
});

// 设置特定配置项
setGlobalConfig('baseUrl', 'https://another-api.coze.cn');

// 获取完整配置
const config = getGlobalConfig();
console.log(config.baseUrl);

// 获取特定配置项
const jwt = getGlobalConfig('jwt');
if (jwt) {
  // 使用 JWT 配置进行认证
}
```

### 工具函数 (utils.ts)

- `sleep(ms: number): Promise<void>` - 延迟指定的毫秒数
- `detectMimeType(buffer: Buffer): string | null` - 通过文件头检测 MIME 类型，支持常见的图像、音频和视频格式

### 图像处理 (vendor/vidu.ts)

- `fetchImageAsBase64(url: string): Promise<string>` - 获取图像并转换为 Base64 格式

### 音频处理 (media/ffmpeg.ts)

- `convertAudio(url: string, desType: string, srcType?: string): Promise<string>` - 将音频从一种格式转换为另一种格式
  - `url`: 输入音频文件网址
  - `desType`: 目标音频格式 (例如: 'mp3', 'wav', 'ogg', 'flac')
  - `srcType`: 可选，源音频格式。如果未提供，将通过检测文件头来确定

### 视频处理 (media/ffmpeg.ts)

- `mergeVideoAndAudio(videoUrl: string, audioUrl: string, audioType?: string): Promise<string>` - 将视频和音频合并为一个文件
  - `videoUrl`: 视频文件网址
  - `audioUrl`: 音频文件网址
  - `audioType`: 可选，音频类型 ('wav', 'mp3', 'ogg', 'm4a', 'aac')

- `burnASSSubtitleToVideo(videoUrl: string, contents: IAssEvents[]): Promise<string>` - 将 ASS 格式字幕烧录到视频中
  - `videoUrl`: 视频文件网址
  - `contents`: 字幕内容数组，包含文本、效果、时间等信息

- `joinVideos(urls: string[], outputFormat?: string): Promise<string>` - 将多个视频文件按顺序合并成一个视频
  - `urls`: 视频文件URL数组，按照需要合并的顺序排列
  - `outputFormat`: 可选，输出视频格式，默认为 'mp4'

### 第三方 API 集成 (vendor/vidu.ts)

#### 配置 Vidu API

```typescript
import { setGlobalConfig } from 'coze-plugin-utils';

// 设置 Vidu API 密钥
setGlobalConfig('vidu', {
  apiKey: 'your_vidu_api_key'
});
```

#### 视频生成 API

- `textToVideo(options: IViduCreationOptions): Promise<IViduResult | { errorMsg: unknown }>` - 根据文本提示生成视频
  - `options.model`: 模型名称，如 'vidu1.5'
  - `options.prompt`: 文本提示
  - `options.bgm`: 是否添加背景音乐
  - `options.seed`: 可选，随机种子
  - `options.callback_url`: 可选，回调 URL

- `imageToVideo(options: IViduCreationOptions): Promise<IViduResult | { errorMsg: unknown }>` - 根据图片生成视频
  - `options.model`: 模型名称
  - `options.prompt`: 文本提示
  - `options.image`: 图片 URL 或 Base64 字符串
  - `options.bgm`: 可选，是否添加背景音乐
  - `options.seed`: 可选，随机种子
  - `options.callback_url`: 可选，回调 URL

- `startEndToVideo(options: IViduCreationOptions): Promise<IViduResult | { errorMsg: unknown }>` - 根据起始和结束图片生成视频
  - `options.model`: 模型名称
  - `options.prompt`: 文本提示
  - `options.start_image`: 起始图片 URL 或 Base64 字符串
  - `options.end_image`: 结束图片 URL 或 Base64 字符串
  - `options.bgm`: 可选，是否添加背景音乐
  - `options.seed`: 可选，随机种子
  - `options.callback_url`: 可选，回调 URL

- `referenceToVideo(options: IViduCreationOptions): Promise<IViduResult | { errorMsg: unknown }>` - 根据参考视频生成新视频
  - `options.model`: 模型名称
  - `options.prompt`: 文本提示
  - `options.reference_video`: 参考视频 URL
  - `options.bgm`: 可选，是否添加背景音乐
  - `options.seed`: 可选，随机种子
  - `options.callback_url`: 可选，回调 URL

#### 音频生成 API

- `textToAudio(options: IAudioTextOptions): Promise<IViduResult | { errorMsg: unknown }>` - 根据文本生成音频
  - `options.model`: 模型名称
  - `options.prompt`: 文本提示
  - `options.duration`: 可选，音频时长
  - `options.seed`: 可选，随机种子
  - `options.callback_url`: 可选，回调 URL

- `timingToAudio(options: IAudioTimingOptions): Promise<IViduResult | { errorMsg: unknown }>` - 根据时间点提示生成音频
  - `options.model`: 模型名称
  - `options.timing_prompts`: 时间点提示数组
  - `options.duration`: 可选，音频时长
  - `options.seed`: 可选，随机种子
  - `options.callback_url`: 可选，回调 URL

#### 任务结果查询

- `getViduResult(taskId: string, timeout?: number): Promise<IViduResult>` - 获取 Vidu 视频处理任务的结果（使用全局配置中的apiKey）
  - `taskId`: 任务 ID
  - `timeout`: 可选，超时时间（毫秒），默认为 180000

- `getViduResult(apiKey: string, taskId: string, timeout?: number): Promise<IViduResult>` - 获取 Vidu 视频处理任务的结果（直接传入apiKey）
  - `apiKey`: Vidu API 密钥
  - `taskId`: 任务 ID
  - `timeout`: 可选，超时时间（毫秒），默认为 180000

## 许可证

本项目采用 MIT 许可证。查看 [LICENSE](./LICENSE) 文件了解更多详情。

这意味着您可以自由地使用、修改和分发本代码，无论是用于个人还是商业目的，但需要保留原始许可证和版权声明。

## 贡献指南

欢迎提交 Issues 和 Pull Requests 来帮助改进这个库。请确保遵循项目的代码风格和提交规范。

1. Fork 这个仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request
