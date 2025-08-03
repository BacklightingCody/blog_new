// Chat 配置常量

export const CHAT_CONFIG = {
  API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'your-api-key-here',
  BASEURL: process.env.NEXT_PUBLIC_CHAT_BASE_URL || 'https://api.openai.com',
  PATH: '/v1/chat/completions',
  
  // 默认模型配置
  DEFAULT_MODEL: 'gpt-3.5-turbo',
  DEFAULT_TEMPERATURE: 0.7,
  DEFAULT_MAX_TOKENS: 2000,
  
  // 消息限制
  MAX_MESSAGE_LENGTH: 4000,
  MAX_HISTORY_MESSAGES: 20,
  
  // 文件上传限制
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_FILE_TYPES: ['.txt', '.md', '.json', '.csv', '.pdf'],
};

// 模型接口定义
export interface ModelInfo {
  value: string;
  name: string;
  maxTokens: number;
  supportsImage: boolean;
  provider: string;
  group: string;
}

// 可用模型列表
export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    value: 'gpt-4o',
    name: 'GPT-4o',
    maxTokens: 4096,
    supportsImage: true,
    provider: 'openai',
    group: 'OpenAI'
  },
  {
    value: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    maxTokens: 4096,
    supportsImage: true,
    provider: 'openai',
    group: 'OpenAI'
  },
  {
    value: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    maxTokens: 4096,
    supportsImage: false,
    provider: 'openai',
    group: 'OpenAI'
  },
  {
    value: 'claude-3-5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    maxTokens: 8192,
    supportsImage: true,
    provider: 'anthropic',
    group: 'Anthropic'
  },
  {
    value: 'gemini-1.5-pro-latest',
    name: 'Gemini 1.5 Pro',
    maxTokens: 8192,
    supportsImage: true,
    provider: 'google',
    group: 'Google'
  },
  {
    value: 'hunyuan-t1-latest',
    name: '腾讯混元',
    maxTokens: 4096,
    supportsImage: true,
    provider: 'tencent',
    group: '腾讯'
  },
  {
    value: 'DeepSeek-R1-Online-64K',
    name: 'DeepSeek R1',
    maxTokens: 65536,
    supportsImage: false,
    provider: 'deepseek',
    group: 'DeepSeek'
  }
];

// 模型配置映射
export const MODEL_CONFIG_MAP = {
  'gpt-4o': {
    name: 'GPT-4o',
    maxTokens: 4096,
    supportImages: true,
    provider: 'openai'
  },
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    maxTokens: 4096,
    supportImages: true,
    provider: 'openai'
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    maxTokens: 4096,
    supportImages: false,
    provider: 'openai'
  },
  'claude-3-5-sonnet-20241022': {
    name: 'Claude 3.5 Sonnet',
    maxTokens: 8192,
    supportImages: true,
    provider: 'anthropic'
  },
  'gemini-1.5-pro-latest': {
    name: 'Gemini 1.5 Pro',
    maxTokens: 8192,
    supportImages: true,
    provider: 'google'
  }
};

// 获取分组的模型数据
export const getGroupedModels = () => {
  const groups: Record<string, ModelInfo[]> = {};
  
  AVAILABLE_MODELS.forEach(model => {
    if (!groups[model.group]) {
      groups[model.group] = [];
    }
    groups[model.group].push(model);
  });
  
  return groups;
};

// 检查模型是否支持图片
export const modelSupportsImage = (modelValue: string): boolean => {
  const model = AVAILABLE_MODELS.find(m => m.value === modelValue);
  return model?.supportsImage || false;
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接错误，请检查网络后重试',
  API_KEY_INVALID: 'API密钥无效，请检查配置',
  RATE_LIMIT: '请求频率过高，请稍后重试',
  SERVER_ERROR: '服务器内部错误，请稍后重试',
  UNKNOWN_ERROR: '未知错误，请重试',
  FILE_TOO_LARGE: '文件大小超出限制',
  UNSUPPORTED_FILE_TYPE: '不支持的文件类型'
};
