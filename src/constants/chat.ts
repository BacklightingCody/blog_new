// 统一的模型描述接口（单一事实来源）
export interface ChatModelDescriptor {
  // 选择值与厂商真实模型名
  value: string;
  name: string;
  provider: string;

  // 接口与代理
  urls: {
    generate: string; // 非流式直连 URL
    stream: string;   // 流式直连 URL（SSE）
  };
  proxyPath: string;   // 统一本地代理路径（前端默认走代理）
  apiKeyEnv: string;   // 服务端读取的环境变量名（前端不读取值）

  // 能力
  supports: {
    image: boolean;
    stream: boolean;
  };

  // 限制
  limits: {
    maxTokens: number;
    maxMessageLength: number;
    maxHistoryMessages: number;
    maxFileSize: number; // bytes
    allowedImageTypes: string[];
    allowedFileTypes: string[];
  };
}

// 默认模型 key（仅保留一个模型）
export const DEFAULT_MODEL = 'gemini-2.0-flash';

// 可用模型（仅保留 Gemini 2.0 Flash）
export const AVAILABLE_MODELS: ChatModelDescriptor[] = [
  {
    value: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'google',
    urls: {
      generate: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      stream: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse'
    },
    proxyPath: '/api/chat/gemini',
    apiKeyEnv: 'GEMINI_MODEL_API_KEY',
    supports: {
      image: true,
      stream: true
    },
    limits: {
      maxTokens: 8192,
      maxMessageLength: 4000,
      maxHistoryMessages: 20,
      maxFileSize: 5 * 1024 * 1024, // 10MB
      allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      allowedFileTypes: ['.txt', '.md', '.json', '.csv', '.pdf']
    }
  },
  {
    value: 'qwen-image',
    name: 'qwen-image',
    provider: 'qwen',
    urls: {
      generate: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
      stream: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis'
    },
    proxyPath: '/api/chat/qwen',
    apiKeyEnv: 'QWEN_MODEL_API_KEY',
    supports: {
      image: true,
      stream: true
    },
    limits: {
      maxTokens: 8192,
      maxMessageLength: 4000,
      maxHistoryMessages: 20,
      maxFileSize: 5 * 1024 * 1024, // 10MB
      allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      allowedFileTypes: ['.txt', '.md', '.json', '.csv', '.pdf']
    }
  }
];

// 辅助方法
export const getModelByValue = (modelValue: string): ChatModelDescriptor | undefined =>
  AVAILABLE_MODELS.find(m => m.value === modelValue);

export const modelSupportsImage = (modelValue: string): boolean => !!getModelByValue(modelValue)?.supports.image;
export const modelSupportsStream = (modelValue: string): boolean => !!getModelByValue(modelValue)?.supports.stream;

export const getModelUrl = (modelValue: string, opts?: { stream?: boolean }): string => {
  const m = getModelByValue(modelValue) || getModelByValue(DEFAULT_MODEL)!;
  return opts?.stream ? m.urls.stream : m.urls.generate;
};

export const getModelProxyPath = (modelValue: string): string => {
  const m = getModelByValue(modelValue) || getModelByValue(DEFAULT_MODEL)!;
  return m.proxyPath;
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
