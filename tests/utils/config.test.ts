/**
 * 配置管理模块测试
 */

import { setGlobalConfig, getGlobalConfig, resetGlobalConfig } from '../../src/core/config';
import { IJWTConfig } from '../../src/types/config';

describe('配置管理模块', () => {
  // 每个测试前重置配置
  beforeEach(() => {
    // 重置为默认配置
    resetGlobalConfig();
  });

  test('应该有默认配置值', () => {
    const config = getGlobalConfig();
    expect(config).toBeDefined();
    expect(config.baseUrl).toBe('https://api.coze.cn');
  });
  
  test('应该能直接使用 setGlobalConfig(obj) 设置配置', () => {
    // 直接传入配置对象
    const newConfig = setGlobalConfig({
      baseUrl: 'https://direct-api.coze.cn',
    });

    // 验证返回值
    expect(newConfig.baseUrl).toBe('https://direct-api.coze.cn');

    // 验证获取的值
    const config = getGlobalConfig();
    expect(config.baseUrl).toBe('https://direct-api.coze.cn');
  });
  
  test('应该能合并嵌套配置', () => {
    // 设置 JWT 配置
    setGlobalConfig('jwt', {
      appId: 'test-app-id',
      keyid: 'test-key-id',
      privateKey: 'test-private-key',
    });

    // 设置 workflows 配置
    setGlobalConfig('workflows', {
      fileUploader: 'test-uploader',
    });

    // 验证配置已合并
    const config = getGlobalConfig();
    expect(config.jwt).toBeDefined();
    expect(config.jwt?.appId).toBe('test-app-id');
    expect(config.workflows).toBeDefined();
    expect(config.workflows?.fileUploader).toBe('test-uploader');

    // 更新 workflows 配置
    setGlobalConfig('workflows', {
      newWorkflow: 'test-new-workflow',
    });

    // 验证 workflows 配置已正确合并
    const updatedConfig = getGlobalConfig();
    expect(updatedConfig.workflows?.fileUploader).toBe('test-uploader');
    expect(updatedConfig.workflows?.newWorkflow).toBe('test-new-workflow');
  });

  test('返回的配置对象应该是副本', () => {
    // 获取配置
    const config = getGlobalConfig();
    
    // 尝试直接修改获取的配置
    config.baseUrl = 'modified-directly';
    
    // 验证全局配置未被修改
    const freshConfig = getGlobalConfig();
    expect(freshConfig.baseUrl).not.toBe('modified-directly');
  });

  // 测试按 key 设置配置
  test('应该能通过 key 设置特定配置项', () => {
    // 设置 baseUrl
    setGlobalConfig('baseUrl', 'https://key-specific-api.coze.cn');
    expect(getGlobalConfig().baseUrl).toBe('https://key-specific-api.coze.cn');

    // 设置 JWT 配置
    const jwtConfig: IJWTConfig = {
      appId: 'key-specific-app-id',
      userId: 'key-specific-user-id',
      keyid: 'key-specific-key-id',
      privateKey: 'key-specific-private-key',
    };
    setGlobalConfig('jwt', jwtConfig);
    
    // 验证 JWT 配置已正确设置
    const config = getGlobalConfig();
    expect(config.jwt).toBeDefined();
    expect(config.jwt?.appId).toBe('key-specific-app-id');
    expect(config.jwt?.userId).toBe('key-specific-user-id');
    expect(config.jwt?.keyid).toBe('key-specific-key-id');
    expect(config.jwt?.privateKey).toBe('key-specific-private-key');

    // 部分更新 JWT 配置
    setGlobalConfig('jwt', { appId: 'updated-app-id' });
    expect(getGlobalConfig().jwt?.appId).toBe('updated-app-id');
    expect(getGlobalConfig().jwt?.keyid).toBe('key-specific-key-id'); // 保持不变
  });

  // 测试按 key 获取配置
  test('应该能通过 key 获取特定配置项', () => {
    // 设置测试数据
    setGlobalConfig('baseUrl', 'https://test-api.coze.cn');
    
    setGlobalConfig('jwt', {
      appId: 'test-app-id',
      keyid: 'test-key-id',
      privateKey: 'test-private-key',
    });
    
    setGlobalConfig('workflows', {
      fileUploader: 'test-file-uploader',
    });

    // 获取特定配置项
    const baseUrl = getGlobalConfig('baseUrl');
    expect(baseUrl).toBe('https://test-api.coze.cn');

    const jwt = getGlobalConfig('jwt');
    expect(jwt).toEqual({
      appId: 'test-app-id',
      keyid: 'test-key-id',
      privateKey: 'test-private-key',
    });

    const workflows = getGlobalConfig('workflows');
    expect(workflows).toEqual({
      fileUploader: 'test-file-uploader',
    });
  });

  // 测试返回的特定配置项是副本
  test('通过 key 获取的对象配置应该是副本', () => {
    // 设置 JWT 配置
    setGlobalConfig('jwt', {
      appId: 'original-app-id',
      keyid: 'original-key-id',
      privateKey: 'original-private-key',
    });

    // 获取 JWT 配置并修改
    const jwt = getGlobalConfig('jwt');
    if (jwt) {
      (jwt as any).appId = 'modified-app-id';
    }

    // 验证原始配置未被修改
    const freshJwt = getGlobalConfig('jwt');
    expect(freshJwt?.appId).toBe('original-app-id');
  });

  // 测试无效 key 错误处理
  test('使用无效的 key 应该抛出错误', () => {
    // 设置无效 key
    expect(() => {
      setGlobalConfig('invalidKey' as any, 'test-value');
    }).toThrow('无效的配置键');

    // 获取无效 key
    expect(() => {
      getGlobalConfig('invalidKey' as any);
    }).toThrow('无效的配置键');
  });
});