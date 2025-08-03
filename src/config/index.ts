/**
 * 应用配置管理
 * 统一管理环境变量和应用设置
 */

// 环境变量类型定义
interface Config {
  // 基础配置
  apiUrl: string;
  appName: string;
  appVersion: string;
  
  // 功能开关
  enableDebug: boolean;
  enableAnalytics: boolean;
  enableServiceWorker: boolean;
  enableOfflineMode: boolean;
  
  // API配置
  apiTimeout: number;
  apiRetryCount: number;
  apiRetryDelay: number;
  
  // 上传配置
  maxFileSize: number;
  allowedFileTypes: string[];
  
  // 缓存配置
  cacheTimeout: number;
  enableCache: boolean;
  
  // 主题配置
  defaultTheme: 'light' | 'dark' | 'system';
  defaultColor: string;
  
  // 分页配置
  defaultPageSize: number;
  maxPageSize: number;
  
  // 分页配置对象
  pagination: {
    defaultPageSize: number;
    maxPageSize: number;
  };
  
  // 开发环境标识
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
}

// 获取环境变量的辅助函数
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  if (typeof window !== 'undefined') {
    // 客户端环境
    return (window as any).__ENV__?.[key] || defaultValue;
  }
  // 服务端环境
  return process.env[key] || defaultValue;
};

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = getEnvVar(key);
  return value === 'true' || value === '1';
};

const getNumberEnvVar = (key: string, defaultValue: number = 0): number => {
  const value = getEnvVar(key);
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// 应用配置
export const config: Config = {
  // 基础配置
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3000/api'),
  appName: getEnvVar('NEXT_PUBLIC_APP_NAME', 'Blog System'),
  appVersion: getEnvVar('NEXT_PUBLIC_APP_VERSION', '1.0.0'),
  
  // 功能开关
  enableDebug: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_DEBUG', process.env.NODE_ENV === 'development'),
  enableAnalytics: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
  enableServiceWorker: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_SERVICE_WORKER', true),
  enableOfflineMode: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_OFFLINE_MODE', false),
  
  // API配置
  apiTimeout: getNumberEnvVar('NEXT_PUBLIC_API_TIMEOUT', 10000), // 10秒
  apiRetryCount: getNumberEnvVar('NEXT_PUBLIC_API_RETRY_COUNT', 3),
  apiRetryDelay: getNumberEnvVar('NEXT_PUBLIC_API_RETRY_DELAY', 1000), // 1秒
  
  // 上传配置
  maxFileSize: getNumberEnvVar('NEXT_PUBLIC_MAX_FILE_SIZE', 10 * 1024 * 1024), // 10MB
  allowedFileTypes: getEnvVar('NEXT_PUBLIC_ALLOWED_FILE_TYPES', 'jpg,jpeg,png,gif,pdf,doc,docx,txt,md').split(','),
  
  // 缓存配置
  cacheTimeout: getNumberEnvVar('NEXT_PUBLIC_CACHE_TIMEOUT', 5 * 60 * 1000), // 5分钟
  enableCache: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_CACHE', true),
  
  // 主题配置
  defaultTheme: (getEnvVar('NEXT_PUBLIC_DEFAULT_THEME', 'system') as 'light' | 'dark' | 'system'),
  defaultColor: getEnvVar('NEXT_PUBLIC_DEFAULT_COLOR', 'blue'),
  
  // 分页配置
  defaultPageSize: getNumberEnvVar('NEXT_PUBLIC_DEFAULT_PAGE_SIZE', 20),
  maxPageSize: getNumberEnvVar('NEXT_PUBLIC_MAX_PAGE_SIZE', 100),
  
  // 分页配置对象
  pagination: {
    defaultPageSize: getNumberEnvVar('NEXT_PUBLIC_DEFAULT_PAGE_SIZE', 20),
    maxPageSize: getNumberEnvVar('NEXT_PUBLIC_MAX_PAGE_SIZE', 100),
  },
  
  // 环境标识
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

// 配置验证
export const validateConfig = (): boolean => {
  const errors: string[] = [];
  
  // 验证必需的配置
  if (!config.apiUrl) {
    errors.push('API URL 未配置');
  }
  
  if (!config.appName) {
    errors.push('应用名称未配置');
  }
  
  // 验证数值配置
  if (config.apiTimeout <= 0) {
    errors.push('API 超时时间必须大于 0');
  }
  
  if (config.maxFileSize <= 0) {
    errors.push('最大文件大小必须大于 0');
  }
  
  if (config.defaultPageSize <= 0 || config.defaultPageSize > config.maxPageSize) {
    errors.push('默认分页大小配置错误');
  }
  
  // 输出错误信息
  if (errors.length > 0) {
    console.error('配置验证失败:', errors);
    return false;
  }
  
  if (config.enableDebug) {
    console.log('配置验证通过:', config);
  }
  
  return true;
};

// 获取特定功能的配置
export const getApiConfig = () => ({
  baseURL: config.apiUrl,
  timeout: config.apiTimeout,
  retryCount: config.apiRetryCount,
  retryDelay: config.apiRetryDelay,
});

export const getUploadConfig = () => ({
  maxFileSize: config.maxFileSize,
  allowedFileTypes: config.allowedFileTypes,
});

export const getCacheConfig = () => ({
  timeout: config.cacheTimeout,
  enabled: config.enableCache,
});

export const getThemeConfig = () => ({
  defaultTheme: config.defaultTheme,
  defaultColor: config.defaultColor,
});

export const getPaginationConfig = () => ({
  defaultPageSize: config.defaultPageSize,
  maxPageSize: config.maxPageSize,
});

// 运行时配置更新（仅限客户端）
export const updateRuntimeConfig = (updates: Partial<Config>) => {
  if (typeof window === 'undefined') {
    console.warn('运行时配置更新仅在客户端可用');
    return;
  }
  
  Object.assign(config, updates);
  
  if (config.enableDebug) {
    console.log('运行时配置已更新:', updates);
  }
};

// 导出默认配置
export default config;

// 在开发环境下验证配置
if (config.isDevelopment) {
  validateConfig();
}