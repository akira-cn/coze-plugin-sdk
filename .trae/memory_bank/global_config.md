# 全局配置模块

## 模块概述

全局配置模块提供了统一的配置管理功能，允许设置和获取全局配置，所有工具依赖的配置都可以通过该模块获取。

## 配置项定义

配置项定义位于 `src/types/config.d.ts` 文件中：

```typescript
// 用来给 Coze 鉴权
interface IJWTConfig {
  appId: string,
  aud?: string, // 默认值 api.coze.cn
  keyid: string,
  privateKey: jwtSecret,
}

interface IWorkflows {
  [key: string]: string;
  fileUploader?: string; // 用来上传临时文件
}

// Azure 服务配置
interface IAzureConfig {
  speech: {
    key: string;    // Azure Speech Service API 密钥
    region: string; // Azure Speech Service 区域
  }
}

// MiniMax 服务配置
interface IMinimaxConfig {
  apiKey: string; // MiniMax API 密钥
  groupId: string; // 组 ID
}

interface IGlobalConfig {
  baseUrl: string; // 默认值 https://api.coze.cn,
  workflows?: IWorkflows;
  jwt?: IJWTConfig;
  azure?: IAzureConfig;
  minimax?: IMinimaxConfig;
}
```

## API 设计

### setGlobalConfig

```typescript
function setGlobalConfig(config: Partial<IGlobalConfig>): IGlobalConfig
```

- **功能**：设置全局配置，将传入的配置与现有配置合并
- **参数**：`config` - 要设置的配置对象，类型为 `Partial<IGlobalConfig>`
- **返回值**：合并后的完整配置对象
- **特性**：
  - 支持深度合并嵌套对象（如 workflows）
  - 返回配置副本，防止直接修改

### getGlobalConfig

```typescript
function getGlobalConfig(): IGlobalConfig
```

- **功能**：获取当前全局配置
- **返回值**：当前的全局配置对象（返回副本以防止意外修改）

## 默认配置

```typescript
const DEFAULT_CONFIG: IGlobalConfig = {
  baseUrl: 'https://api.coze.cn',
};
```

## 使用示例

```typescript
// 导入配置函数
import { setGlobalConfig, getGlobalConfig } from 'coze-plugin-utils';

// 设置基本配置
setGlobalConfig({ baseUrl: 'https://custom-api.coze.cn' });

// 设置JWT配置
setGlobalConfig({
  jwt: {
    appId: 'your-app-id',
    keyid: 'your-key-id',
    privateKey: 'your-private-key'
  }
});

// 获取配置
const config = getGlobalConfig();
console.log(config.baseUrl); // https://custom-api.coze.cn

// 使用配置中的值
const { jwt } = getGlobalConfig();
if (jwt) {
  // 使用JWT配置进行认证
}
```

## 测试覆盖

测试文件位于 `tests/utils/config.test.ts`，测试内容包括：

1. 默认配置值测试
2. 设置和获取配置测试
3. 嵌套配置合并测试
4. 配置对象副本测试（防止直接修改）