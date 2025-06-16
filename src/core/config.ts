/**
 * 全局配置管理模块
 * 提供设置和获取全局配置的功能
 */

import { IGlobalConfig, IJWTConfig, IWorkflows, IOSSConfig, IBrowserConfig, IViduConfig, IAzureConfig, IMinimaxConfig } from '../types/config';

// 默认配置值
const DEFAULT_CONFIG: IGlobalConfig = {
  baseUrl: 'https://api.coze.cn',
};

// 全局配置存储
let globalConfig: IGlobalConfig = { ...DEFAULT_CONFIG };

/**
 * 重置全局配置到默认值
 * 
 * @returns 重置后的默认配置对象
 * 
 * @example
 * ```typescript
 * // 重置配置
 * resetGlobalConfig();
 * ```
 */
export function resetGlobalConfig(): IGlobalConfig {
  globalConfig = { ...DEFAULT_CONFIG };
  return { ...globalConfig };
}

/**
 * 设置全局配置
 * 
 * @param config - 要设置的配置对象，将与现有配置合并
 * @returns 合并后的完整配置对象
 * 
 * @example
 * ```typescript
 * // 设置整个配置对象
 * setGlobalConfig({ baseUrl: 'https://custom-api.coze.cn' });
 * ```
 */
export function setGlobalConfig(config: Partial<IGlobalConfig>): IGlobalConfig;

/**
 * 设置全局配置
 * 
 * @param key - 指定要设置的配置键名，如 'baseUrl', 'jwt', 'workflows'
 * @param config - 要设置的配置值，类型取决于 key
 * @returns 合并后的完整配置对象
 * @throws 当指定的 key 无效时抛出错误
 * 
 * @example
 * ```typescript
 * // 只设置 JWT 配置
 * setGlobalConfig('jwt', {
 *   appId: 'your-app-id',
 *   keyid: 'your-key-id',
 *   privateKey: 'your-private-key'
 * });
 * 
 * // 设置 Azure Speech 配置
 * setGlobalConfig('azure', {
 *   speech: {
 *     key: 'your-azure-speech-key',
 *     region: 'your-azure-region'
 *   }
 * });
 * 
 * // 设置 MiniMax 配置
 * setGlobalConfig('minimax', {
 *   apiKey: 'your-minimax-api-key',
 *   groupId: 'your-group-id'
 * });
 * 
 * // 设置 baseUrl
 * setGlobalConfig('baseUrl', 'https://custom-api.coze.cn');
 * ```
 */
export function setGlobalConfig<K extends keyof IGlobalConfig>(
  key: K,
  config: K extends 'baseUrl' ? string : K extends 'jwt' ? Partial<IJWTConfig> : K extends 'workflows' ? Partial<IWorkflows> : K extends 'aliyun'? Partial<IOSSConfig> : K extends 'browser' ? Partial<IBrowserConfig> : K extends 'vidu' ? Partial<IViduConfig> : K extends 'azure' ? Partial<IAzureConfig> : K extends 'minimax' ? Partial<IMinimaxConfig> : never,
): IGlobalConfig;

/**
 * 设置全局配置（实现）
 */
export function setGlobalConfig<K extends keyof IGlobalConfig>(
  keyOrConfig: K | Partial<IGlobalConfig>,
  config?: K extends 'baseUrl' ? string : K extends 'jwt' ? Partial<IJWTConfig> : K extends 'workflows' ? Partial<IWorkflows> : K extends 'aliyun'? Partial<IOSSConfig> : K extends 'browser' ? Partial<IBrowserConfig> : K extends 'vidu' ? Partial<IViduConfig> : K extends 'azure' ? Partial<IAzureConfig> : K extends 'minimax' ? Partial<IMinimaxConfig> : never,
): IGlobalConfig {
  // 检查是否是直接传入配置对象的情况
  if (typeof keyOrConfig === 'object' && config === undefined) {
    // 直接传入配置对象的情况: setGlobalConfig(obj)
    const fullConfig = keyOrConfig as Partial<IGlobalConfig>;
    
    // 深度合并配置
    if (fullConfig.workflows && globalConfig.workflows) {
      fullConfig.workflows = { ...globalConfig.workflows, ...fullConfig.workflows };
    }
    
    if (fullConfig.azure && globalConfig.azure) {
      fullConfig.azure = {
        ...globalConfig.azure,
        ...fullConfig.azure,
        speech: { ...globalConfig.azure.speech, ...fullConfig.azure.speech },
      };
    }
    
    // 更新全局配置
    globalConfig = {
      ...globalConfig,
      ...fullConfig,
    };
  } else {
    // 传入 key 和 config 的情况: setGlobalConfig(key, value)
    const key = keyOrConfig as K;
    
    // 验证 key 是否有效
    if (!Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, key) 
      && key !== 'jwt' && key !== 'workflows' && key !== 'aliyun' && key !== 'browser' && key !== 'vidu' && key !== 'azure' && key !== 'minimax') {
      throw new Error(`无效的配置键: ${String(key)}`);
    }

    // 根据 key 更新特定配置
    if (key === 'workflows' && globalConfig.workflows) {
      globalConfig.workflows = { ...globalConfig.workflows, ...(config as IWorkflows) };
    } else if (key === 'jwt' && globalConfig.jwt) {
      globalConfig.jwt = { ...globalConfig.jwt, ...(config as IJWTConfig) };
    } else if (key === 'jwt' && !globalConfig.jwt) {
      globalConfig.jwt = config as IJWTConfig;
    } else if (key === 'workflows' && !globalConfig.workflows) {
      globalConfig.workflows = config as IWorkflows;
    } else if (key === 'aliyun' && globalConfig.aliyun) {
      globalConfig.aliyun.oss = { ...globalConfig.aliyun.oss, ...(config as IOSSConfig).oss };
    } else if (key === 'aliyun' &&!globalConfig.aliyun) {
      globalConfig.aliyun = config as IOSSConfig;
    } else if (key === 'browser' && globalConfig.browser) {
      globalConfig.browser = { ...globalConfig.browser, ...(config as IBrowserConfig) };
    } else if (key === 'browser' && !globalConfig.browser) {
      globalConfig.browser = config as IBrowserConfig;
    } else if (key === 'vidu' && globalConfig.vidu) {
      globalConfig.vidu = { ...globalConfig.vidu, ...(config as IViduConfig) };
    } else if (key === 'vidu' && !globalConfig.vidu) {
      globalConfig.vidu = config as IViduConfig;
    } else if (key === 'azure' && globalConfig.azure) {
      globalConfig.azure = { 
        ...globalConfig.azure, 
        ...(config as IAzureConfig),
        speech: { ...globalConfig.azure.speech, ...(config as IAzureConfig).speech },
      };
    } else if (key === 'azure' && !globalConfig.azure) {
      globalConfig.azure = config as IAzureConfig;
    } else if (key === 'minimax' && globalConfig.minimax) {
      globalConfig.minimax = { ...globalConfig.minimax, ...(config as IMinimaxConfig) };
    } else if (key === 'minimax' && !globalConfig.minimax) {
      globalConfig.minimax = config as IMinimaxConfig;
    } else {
      (globalConfig as any)[key] = config;
    }
  }
  
  return { ...globalConfig };
}

/**
 * 获取当前全局配置
 * 
 * @param key - 可选，指定要获取的配置键名，如 'baseUrl', 'jwt', 'workflows'
 * @returns 当前的全局配置对象或指定键的配置值（返回副本以防止意外修改）
 * @throws 当指定的 key 无效时抛出错误
 * 
 * @example
 * ```typescript
 * // 获取完整配置
 * const config = getGlobalConfig();
 * console.log(config.baseUrl);
 * 
 * // 获取特定配置项
 * const jwtConfig = getGlobalConfig('jwt');
 * if (jwtConfig) {
 *   // 使用JWT配置进行认证
 * }
 * 
 * // 获取 Azure 配置
 * const azureConfig = getGlobalConfig('azure');
 * if (azureConfig?.speech) {
 *   // 使用 Azure Speech Service
 *   console.log(azureConfig.speech.key, azureConfig.speech.region);
 * }
 * 
 * // 获取 MiniMax 配置
 * const minimaxConfig = getGlobalConfig('minimax');
 * if (minimaxConfig?.apiKey) {
 *   // 使用 MiniMax API
 *   console.log(minimaxConfig.apiKey, minimaxConfig.groupId);
 * }
 * 
 * // 获取 baseUrl
 * const baseUrl = getGlobalConfig('baseUrl');
 * console.log(baseUrl); // https://api.coze.cn
 * ```
 */
export function getGlobalConfig(): IGlobalConfig;
export function getGlobalConfig<K extends keyof IGlobalConfig>(key: K): IGlobalConfig[K];
export function getGlobalConfig<K extends keyof IGlobalConfig>(key?: K): IGlobalConfig | IGlobalConfig[K] {
  if (key !== undefined) {
    // 验证 key 是否有效
    if (!Object.prototype.hasOwnProperty.call(DEFAULT_CONFIG, key) && key !== 'jwt' && key !== 'workflows' && key !== 'aliyun' && key !== 'browser' && key !== 'vidu' && key !== 'azure' && key !== 'minimax') {
      throw new Error(`无效的配置键: ${String(key)}`);
    }
    
    // 返回指定键的配置值的副本
    const value = globalConfig[key];
    if (typeof value === 'object' && value !== null) {
      return { ...value } as IGlobalConfig[K];
    }
    return value;
  }
  
  // 返回完整配置的副本
  return { ...globalConfig };
}