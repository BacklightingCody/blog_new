// ==================== 核心消息模型 ====================

/**
 * 聊天消息 - 符合 OpenAI 标准
 */
export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string | MessageContent[];
  timestamp: string;
  status: 'sending' | 'sent' | 'error' | 'canceled';
  // 用于界面显示的上下文信息（与发送到API的格式分离）
  images?: string[];
  texts?: string[];
}

/**
 * 消息内容项 - 支持多模态
 */
export interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
}

// ==================== 请求和响应模型 ====================

/**
 * 发送消息请求
 */
export interface SendMessageRequest {
  content: string;
  images?: string[]; // 图片 URL 数组
  texts?: string[]; // 文本上下文数组
  modelConfig?: ModelConfig;
  systemPromptId?: string;
}

/**
 * 大模型配置参数
 */
export interface ModelConfig {
  model: string;
  temperature?: number;
  topK?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

/**
 * Chat Completion API 请求格式
 */
export interface ChatCompletionRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
  // 自定义扩展参数
  top_k?: number;
  useNewKey?: boolean;
}

/**
 * OpenAI 标准消息格式
 */
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | OpenAIMessageContent[];
}

export interface OpenAIMessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
}

// ==================== 会话和系统提示词 ====================

/**
 * 聊天会话
 */
export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  systemPromptId: string;
  modelConfig: ModelConfig;
  createdAt: string;
  updatedAt: string;
  // 绑定session
  documentId?: string;
  version?: string;
  language?: string;
  productCode?: string;
  gitCommitId?: string;
  fileMd5?: string;
  // 新增：会话类型
  // 新增：占位符数据
  placeholders?: PlaceholderItem[];
  sessionType?: 'public' | 'private';
}

/**
 * 系统提示词
 */
export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  description?: string;
  isDefault?: boolean;
}

// ==================== API 响应格式 ====================

/**
 * 标准 API 响应
 */
export interface ApiResponse {
  code: number;
  message: string;
  data: {
    answer: string;
  };
}

// ==================== 默认配置 ====================

export const DEFAULT_MODEL_CONFIG: ModelConfig = {
  model: 'Hunyuan-T1-32K',
  temperature: 0.5,
  topK: 40
  // maxTokens: 2000,
  // topP: 1.0,
  // frequencyPenalty: 0,
  // presencePenalty: 0
};

/**
 * 占位符项 - 重新设计为更灵活的结构
 */
export interface PlaceholderItem {
  id: string; // 占位符的唯一标识
  key: string; // 占位符的key，如 {{doc1}}, {{img1}}, {{img2}}
  value: string; // 占位符的值
  type:
    | 'doc'
    | 'img'
    | 'product'
    | 'language'
    | 'version'
    | 'gitCommitId'
    | 'fileMd5'
    | 'other';
  label?: string; // 显示标签，可选
  description?: string; // 描述，可选
  placeholder?: string; // 占位符文本，如 {{doc}}
}

/**
 * 占位符分组 - 按类型分组的占位符
 */
export interface PlaceholderGroup {
  type:
    | 'doc'
    | 'img'
    | 'product'
    | 'language'
    | 'version'
    | 'gitCommitId'
    | 'fileMd5'
    | 'other';
  label: string; // 分组标签
  items: PlaceholderItem[]; // 该分组下的占位符列表
}
