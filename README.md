# Coze 插件工具函数库

这是一个为 Coze 插件开发提供实用工具函数的 TypeScript 库。该库提供了多种实用功能，帮助开发者更轻松地构建 Coze 插件。

## 功能特点

- **实用工具函数**：提供常用的辅助函数，如 `sleep` 延时函数
- **MIME 类型检测**：支持检测多种文件类型的 MIME 类型
- **图像处理**：支持图像获取和 Base64 转换
- **视频处理**：支持与 Vidu API 集成的视频处理功能

## 安装

使用 npm 安装：

```bash
npm install coze-plugin-utils
```

或使用 yarn：

```bash
yarn add coze-plugin-utils
```

或使用 pnpm：

```bash
pnpm add coze-plugin-utils
```

## 使用示例

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

### 视频处理

```typescript
import { getViduResult } from 'coze-plugin-utils';

async function checkVideoTask() {
  const apiKey = 'your_vidu_api_key';
  const taskId = 'your_task_id';
  
  try {
    const result = await getViduResult(apiKey, taskId);
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

### 工具函数 (utils.ts)

- `sleep(ms: number): Promise<void>` - 延迟指定的毫秒数
- `detectMimeType(buffer: Buffer): string | null` - 通过文件头检测 MIME 类型，支持常见的图像、音频和视频格式

### 图像处理 (image.ts)

- `fetchImageAsBase64(url: string): Promise<string>` - 获取远程图像并转换为 Base64 格式的 Data URL

### 视频处理 (video.ts)

- `getViduResult(apiKey: string, taskId: string): Promise<ViduResult>` - 获取 Vidu API 的视频处理任务结果

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
