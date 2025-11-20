import { SystemPrompt, ChatSession, ChatMessage, ModelConfig } from '@/zustand/stores/chatStore';

// 系统提示词
export const mockSystemPrompts: SystemPrompt[] = [
  {
    id: '1',
    name: '默认助手',
    content: '你是一个有用的AI助手，请友好、准确地回答用户的问题。',
    // userId: 1, // 移除不存在的字段
    isDefault: true,
    // updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '编程助手',
    content: '你是一个专业的编程助手，擅长多种编程语言和技术栈，能够帮助用户解决编程问题、代码审查和技术咨询。',
    // userId: 1, // 移除不存在的字段
    isDefault: false,
    // updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: '写作助手',
    content: '你是一个专业的写作助手，能够帮助用户改进文章结构、语言表达和写作技巧。',
    // userId: 1, // 移除不存在的字段
    isDefault: false,
    // updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: '翻译助手',
    content: '你是一个专业的翻译助手，能够准确地在中英文之间进行翻译，并保持原文的语境和风格。',
    // userId: 1, // 移除不存在的字段
    isDefault: false,
    // updatedAt: '2024-01-01T00:00:00Z'
  }
];

// 默认模型配置
const defaultModelConfig: ModelConfig = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 2048,
  topP: 1,
  frequencyPenalty: 0,
  presencePenalty: 0
};

// 模拟消息
const mockMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    role: 'user',
    content: '你好，我想了解一下React的基本概念。',
    timestamp: '2024-01-15T10:00:00Z',
    status: 'sent'
  },
  {
    id: 'msg_2',
    role: 'assistant',
    content: 'React是一个用于构建用户界面的JavaScript库。它的核心概念包括组件、JSX、状态管理等。',
    timestamp: '2024-01-15T10:00:30Z',
    status: 'sent'
  },
  {
    id: 'msg_3',
    role: 'user',
    content: '能详细解释一下组件的概念吗？',
    timestamp: '2024-01-15T10:01:00Z',
    status: 'sent'
  },
  {
    id: 'msg_4',
    role: 'assistant',
    content: '当然！React组件是可重用的UI构建块。它们可以是函数组件或类组件，接收props作为输入，返回JSX作为输出。',
    timestamp: '2024-01-15T10:01:30Z',
    status: 'sent'
  }
];

// 模拟会话
export const mockSessions: ChatSession[] = [
  {
    id: 'session_1',
    name: 'React学习讨论',
    messages: mockMessages,
    systemPrompt: mockSystemPrompts[1].content, // 编程助手
    modelConfig: defaultModelConfig,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:01:30Z',
    sessionType: 'private'
  },
  {
    id: 'session_2',
    name: '新对话',
    messages: [],
    systemPrompt: mockSystemPrompts[2].content, // 写作助手
    modelConfig: defaultModelConfig,
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    sessionType: 'private'
  },
  {
    id: 'session_3',
    name: '技术咨询',
    messages: [],
    systemPrompt: mockSystemPrompts[0].content, // 默认助手
    modelConfig: defaultModelConfig,
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
    sessionType: 'private'
  }
];