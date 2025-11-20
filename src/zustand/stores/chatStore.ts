'use client';

import { create } from 'zustand';
import { flushSync } from 'react-dom';

// 导入类型定义
// ✅ 聊天消息内容（支持文本和图片）
export interface MessageContent {
  type: 'text' | 'image_url';
  text?: string;
  image_url?: {
    url: string;
    detail?: 'low' | 'high' | 'auto';
  };
}

// ✅ 单条消息
export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string | MessageContent[];
  timestamp: string;
  status: 'sending' | 'sent' | 'error' | 'canceled';
  images?: string[];          // 额外上传图片（展示用）
  texts?: string[];           // 原始文本（可用于记录草稿）
  error?: string;             // 错误信息（如果 status 为 error）
  metadata?: Record<string, any>; // 可扩展字段（来源/嵌入参数）
  rawContent?: string;        // （可选）原始包含占位符的文本
}

// ✅ 会话信息
export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  systemPrompt: string;
  modelConfig: ModelConfig;
  createdAt: string;
  updatedAt: string;
  sessionType?: 'public' | 'private';
  pinned?: boolean;
  isArchived?: boolean;
  tags?: string[];
  // 对比模式
  isModelCompare?: boolean;
  compareModels?: string[];
  messagesByModel?: Record<string, ChatMessage[]>;
}

// ✅ 系统提示词
export interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  description?: string;
  isDefault?: boolean;
}

// ✅ 模型配置
export interface ModelConfig {
  model: string;
  temperature?: number;
  topK?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

// ✅ 发送消息的请求结构
export interface SendMessageRequest {
  content: string;                  // 可以包含占位符（如 @{{doc}}）
  images?: string[];
  texts?: string[];
  modelConfig?: ModelConfig;
  systemPrompt?: string;
  placeholders?: PlaceholderItem[]; // ✅ 新增支持占位符参数
  // 不在会话中追加一条新的用户消息（用于重试：复用原用户消息）
  suppressUserMessage?: boolean;
}

// ✅ 占位符结构，用于动态替换内容
export interface PlaceholderItem {
  id: string;
  key: string;   // 替换占位名（如 doc、version、product）
  value: string; // 替换后的值
  type: 'doc' | 'img' | 'product' | 'language' | 'version' | 'gitCommitId' | 'fileMd5' | 'other';
  label?: string;
  description?: string;
}

// ✅ OpenAI 请求消息体（结构化为数组）
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | MessageContent[];
}

// ✅ OpenAI Chat Completion API 请求结构
export interface ChatCompletionRequest {
  model: string;
  messages: OpenAIMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stream?: boolean;
  top_k?: number;
  // 额外：占位符（后端可选处理，不直接传第三方厂商）
  placeholders?: Array<{ id?: string; key: string; value?: string; type?: string; label?: string }>;
  // 期望的流式格式（默认 sse）
  streamFormat?: 'sse' | 'json';
}

// ✅ 默认模型配置
export const DEFAULT_MODEL_CONFIG: ModelConfig = {
  model: 'gemini-2.0-flash',
  temperature: 0.5,
  topK: 40
};


// Mock数据
const mockSystemPrompts: SystemPrompt[] = [
  {
    id: 'default',
    name: '默认助手',
    content: '你是一个有用的AI助手，请用中文回答用户的问题。',
    description: '通用AI助手，适用于各种日常对话',
    isDefault: true
  },
  {
    id: 'code',
    name: '代码助手',
    content: '你是一个专业的编程助手，擅长各种编程语言和技术问题。请提供准确、实用的代码建议和解决方案。',
    description: '专门用于编程相关问题的助手'
  }
];

const createMockMessage = (
  id: string,
  role: 'user' | 'assistant',
  content: string,
  minutesAgo: number = 0
): ChatMessage => {
  const timestamp = new Date();
  timestamp.setMinutes(timestamp.getMinutes() - minutesAgo);

  return {
    id,
    role,
    content,
    timestamp: timestamp.toISOString(),
    status: 'sent'
  };
};

const mockChatSessions: ChatSession[] = [
  {
    id: 'session_1',
    name: 'AI技术讨论',
    messages: [
      createMockMessage('msg_1_1', 'user', '你好！我想了解一下当前人工智能技术的发展趋势。', 120),
      createMockMessage('msg_1_2', 'assistant', '你好！很高兴为你介绍人工智能技术的发展趋势。当前AI领域确实非常活跃...', 118)
    ],
    systemPrompt: '',
    modelConfig: DEFAULT_MODEL_CONFIG,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    sessionType: 'private'
  },
  {
    id: 'session_2',
    name: 'React开发问题',
    messages: [
      createMockMessage('msg_2_1', 'user', '我在使用React Hooks时遇到了一个问题，useEffect的依赖数组应该如何正确使用？', 180),
      createMockMessage('msg_2_2', 'assistant', '这是一个很好的问题！useEffect的依赖数组是React Hooks中的关键概念...', 175)
    ],
    systemPrompt: '',
    modelConfig: DEFAULT_MODEL_CONFIG,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    sessionType: 'private'
  }
];

// Chat Store 状态接口
interface ChatState {
  // 基础状态
  sessions: ChatSession[];
  currentSessionId: string | null;
  systemPrompts: SystemPrompt[];
  selectedPromptId: string;
  modelConfig: ModelConfig;
  loading: boolean;
  streaming: boolean;
  streamContent: string;
  error: string | null;
  editingPromptId: string | null;

  // 内部状态
  streamContentRef: string;
  abortController: AbortController | null;

  // 对比模式（全局便捷控制，与会话字段保持同步）
  isModelCompareEnabled: boolean;
  compareModels: string[];
  compareStreaming: boolean;
  compareStreamContentByModel: Record<string, string>;
  compareStreamRefByModel: Record<string, string>;
}

// Chat Store 动作接口
interface ChatActions {
  // 会话管理
  createSession: (name?: string, documentContext?: any, sessionType?: 'public' | 'private') => ChatSession;
  clearSessionMessages: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  setCurrentSession: (sessionId: string) => void;
  getCurrentSession: () => ChatSession | null;
  updateSessionName: (sessionId: string, name: string) => void;
  toggleSessionPin: (sessionId: string) => void;
  changeSessionType: (sessionId: string, sessionType: 'public' | 'private') => void;
  // 对比模式控制
  toggleModelCompare: (enabled: boolean) => void;
  setCompareModels: (models: string[]) => void;
  sendMultiModelMessage: (request: SendMessageRequest) => Promise<void>;
  // 新增：对齐 useChatManager 规范
  initSessions: (sessions?: ChatSession[]) => void;
  selectSession: (sessionId: string) => void;
  loadMoreMessages: (sessionId: string, count?: number) => Promise<{ hasMore: boolean }>;
  stopStreaming: () => void;
  setSystemPrompt: (sessionId: string, prompt: string) => void;
  setModel: (sessionId: string, model: string) => void;

  // 消息管理
  sendMessage: (request: SendMessageRequest) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  deleteMessage: (sessionId: string, messageId: string) => void;
  editMessage: (sessionId: string, messageId: string, newContent: string) => void;

  // 系统提示词管理
  getCurrentPrompt: () => SystemPrompt;
  selectPrompt: (promptId: string) => void;
  addSystemPrompt: (prompt: Omit<SystemPrompt, 'id'>) => SystemPrompt;
  updateSystemPrompt: (promptId: string, updates: Partial<Omit<SystemPrompt, 'id'>>) => void;
  deleteSystemPrompt: (promptId: string) => void;
  duplicateSystemPrompt: (promptId: string) => SystemPrompt | null;
  startEditPrompt: (promptId: string) => void;
  cancelEditPrompt: () => void;

  // 配置管理
  updateModelConfig: (config: Partial<ModelConfig>) => void;

  // 控制方法
  cancelRequest: () => void;
  clearError: () => void;

  // 工具方法
  buildOpenAIMessages: (
    userContent: string,
    images?: string[],
    texts?: string[],
    historyMessages?: ChatMessage[],
    systemPrompt?: string,
    options?: { appendCurrentUser?: boolean }
  ) => OpenAIMessage[];
  extractTextFromContent: (content: MessageContent[]) => string;
  classifyError: (error: Error) => { type: 'network' | 'api' | 'unknown'; message: string };
}

type ChatStore = ChatState & ChatActions;

// 工具函数
const extractTextFromContent = (content: MessageContent[]): string => {
  return content
    .filter((item) => item.type === 'text')
    .map((item) => item.text)
    .join(' ');
};

// 导入实际的API服务
import { sendChatRequest } from '@/services/chatApi';
import { ChatBackend } from '@/lib/api/chat';
import { DEFAULT_MODEL, modelSupportsStream, getModelProxyPath } from '@/constants/chat';

// 创建Chat Store
export const useChatStore = create<ChatStore>((set, get) => ({
  // 初始状态
  sessions: mockChatSessions,
  currentSessionId: mockChatSessions[0]?.id || null,
  systemPrompts: mockSystemPrompts,
  selectedPromptId: '',
  modelConfig: DEFAULT_MODEL_CONFIG,
  loading: false,
  streaming: false,
  streamContent: '',
  error: null,
  editingPromptId: null,
  streamContentRef: '',
  abortController: null,
  isModelCompareEnabled: false,
  compareModels: [],
  compareStreaming: false,
  compareStreamContentByModel: {},
  compareStreamRefByModel: {},

  // 会话管理
  createSession: (name, documentContext, sessionType = 'private') => {
    const sessionId = `session_${Date.now()}`;
    const timestamp = new Date().toISOString();
    const state = get();

    const newSession: ChatSession = {
      id: sessionId,
      name: name || `对话 ${state.sessions.length + 1}`,
      messages: [],
      systemPrompt: '',
      modelConfig: state.modelConfig,
      createdAt: timestamp,
      updatedAt: timestamp,
      sessionType,
      isModelCompare: false,
      compareModels: [],
      messagesByModel: {}
    };

    set((state) => ({
      sessions: [newSession, ...state.sessions],
      currentSessionId: sessionId
    }));

    // 异步持久化到后端（不阻塞UI）
    (async () => {
      try {
        await ChatBackend.createSession({
          name: newSession.name,
          systemPrompt: newSession.systemPrompt,
          modelConfig: { modelName: newSession.modelConfig.model, temperature: newSession.modelConfig.temperature, topK: newSession.modelConfig.topK, maxTokens: newSession.modelConfig.maxTokens, topP: newSession.modelConfig.topP, frequencyPenalty: newSession.modelConfig.frequencyPenalty, presencePenalty: newSession.modelConfig.presencePenalty },
          sessionType,
          pinned: newSession.pinned || false,
          isArchived: newSession.isArchived || false,
          tags: newSession.tags || [],
          isModelCompare: newSession.isModelCompare || false,
          compareModels: newSession.compareModels || []
        });
      } catch {}
    })();

    return newSession;
  },

  clearSessionMessages: (sessionId) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, messages: [], updatedAt: new Date().toISOString() }
          : session
      )
    }));
  },

  deleteSession: (sessionId) => {
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== sessionId),
      currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId
    }));
  },

  setCurrentSession: (sessionId) => {
    set((state) => {
      // 切换会话时自动关闭全局对比开关，使用会话自身的标记
      const next = state.sessions.find((s) => s.id === sessionId);
      return {
        currentSessionId: sessionId,
        isModelCompareEnabled: !!next?.isModelCompare,
        compareModels: next?.compareModels || []
      };
    });
  },

  // 新增：初始化与选择别名
  initSessions: (sessionsArg) => {
    if (!sessionsArg) return;
    set({ sessions: sessionsArg, currentSessionId: sessionsArg[0]?.id || null });
  },

  selectSession: (sessionId) => {
    set({ currentSessionId: sessionId });
  },

  getCurrentSession: () => {
    const state = get();
    return state.sessions.find((s) => s.id === state.currentSessionId) || null;
  },

  updateSessionName: (sessionId, name) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, name, updatedAt: new Date().toISOString() }
          : session
      )
    }));
  },

  toggleSessionPin: (sessionId) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, pinned: !session.pinned, updatedAt: new Date().toISOString() }
          : session
      )
    }));
  },

  changeSessionType: (sessionId, sessionType) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, sessionType, updatedAt: new Date().toISOString() }
          : session
      )
    }));
  },

  // 对比模式控制
  toggleModelCompare: (enabled) => {
    const stateNow = get();
    const current = stateNow.getCurrentSession();
    if (!current) return;
    set((state) => ({
      isModelCompareEnabled: enabled,
      sessions: state.sessions.map((s) =>
        s.id === current.id ? { ...s, isModelCompare: enabled, updatedAt: new Date().toISOString() } : s
      )
    }));
  },

  setCompareModels: (models) => {
    const stateNow = get();
    const current = stateNow.getCurrentSession();
    if (!current) return;
    set((state) => ({
      compareModels: models,
      sessions: state.sessions.map((s) =>
        s.id === current.id ? { ...s, compareModels: models, updatedAt: new Date().toISOString() } : s
      )
    }));
  },

  // 新增：分页加载（本地 Mock，返回无更多）
  loadMoreMessages: async () => {
    return { hasMore: false };
  },

  setSystemPrompt: (sessionId, prompt) => {
    set((state) => ({
      sessions: state.sessions.map((s) => s.id === sessionId ? { ...s, systemPrompt: prompt, updatedAt: new Date().toISOString() } : s)
    }));
  },

  setModel: (sessionId, model) => {
    set((state) => ({
      sessions: state.sessions.map((s) => s.id === sessionId ? { ...s, modelConfig: { ...s.modelConfig, model }, updatedAt: new Date().toISOString() } : s)
    }));
  },

  // 消息管理
  sendMessage: async (request) => {
    const state = get();
    let currentSession = state.getCurrentSession();

    if (!currentSession) {
      currentSession = state.createSession();
    }

    // 创建新的 AbortController
    const abortController = new AbortController();
    set({ abortController, loading: true, error: null, streaming: false, streamContentRef: '' });

    try {
      // 创建用户消息（当 suppressUserMessage 不为 true 时，才回显到会话）
      let userMessage: ChatMessage | null = null;
      if (!request.suppressUserMessage) {
        userMessage = {
          id: `msg_${Date.now()}`,
          role: 'user',
          content: request.content,
          timestamp: new Date().toISOString(),
          status: 'sent',
          images: request.images,
          texts: request.texts
        };

        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === currentSession!.id
              ? { ...session, messages: [...session.messages, userMessage!] }
              : session
          )
        }));

        // 异步保存用户消息
        (async () => {
          try { await ChatBackend.addMessage(currentSession!.id, { role: 'user', content: String(userMessage!.content), images: userMessage!.images, texts: userMessage!.texts, rawContent: userMessage!.rawContent }); } catch {}
        })();
      }

      // 如果开启了对比模式，转交并发发送
      if ((currentSession.isModelCompare || state.isModelCompareEnabled) && (currentSession.compareModels?.length || state.compareModels.length)) {
        await get().sendMultiModelMessage(request);
        set({ loading: false, streaming: false, streamContent: '', streamContentRef: '' });
        return;
      }

      // 构建 API 请求
      const systemPrompt = state.getCurrentPrompt();
      const modelConfig = request.modelConfig || state.modelConfig;

      const resolvedModel = modelConfig.model || DEFAULT_MODEL
      const enableStream = modelSupportsStream(resolvedModel)
      const apiRequest: ChatCompletionRequest = {
        model: resolvedModel,
        messages: state.buildOpenAIMessages(
          request.content,
          request.images,
          request.texts,
          currentSession.messages.filter((m) => m.status === 'sent'),
          systemPrompt.content,
          { appendCurrentUser: !request.suppressUserMessage }
        ),
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens,
        top_p: modelConfig.topP,
        frequency_penalty: modelConfig.frequencyPenalty,
        presence_penalty: modelConfig.presencePenalty,
        stream: enableStream,
        top_k: modelConfig.topK,
        // 透传占位符（由服务端决定是否与业务数据替换，当前仅占位）
        placeholders: request.placeholders,
        // 期望 SSE：true 表示 prefer sse，gemini 将回退为 json
        streamFormat: 'sse'
      };

      // 发送请求
      set({ streaming: true });

      const response = await sendChatRequest(
        apiRequest,
        '',
        (chunk: string) => {
          set((state) => {
            const newStreamContent = state.streamContentRef + chunk;
            return {
              streamContentRef: newStreamContent,
              streamContent: newStreamContent
            };
          });
        },
        // 通过服务端代理，避免浏览器直接带 key
        getModelProxyPath(resolvedModel),
        abortController.signal
      );

      // 创建 AI 回复消息
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        status: 'sent'
      };

      // 更新会话
      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === currentSession!.id
            ? {
              ...session,
              messages: [...session.messages, aiMessage],
              updatedAt: new Date().toISOString()
            }
            : session
        ),
        loading: false,
        streaming: false,
        streamContent: '',
        streamContentRef: ''
      }));

      // 异步保存AI消息
      (async () => { try { await ChatBackend.addMessage(currentSession!.id, { role: 'assistant', content: String(aiMessage.content) }); } catch {} })();

    } catch (error) {
      // 处理错误
      if (error instanceof Error && error.message === 'Request aborted') {
        // 用户取消请求
        const state = get();
        if (state.streamContentRef.trim()) {
          const canceledAIMessage: ChatMessage = {
            id: `msg_${Date.now()}_canceled`,
            role: 'assistant',
            content: state.streamContentRef,
            timestamp: new Date().toISOString(),
            status: 'canceled'
          };

          set((state) => ({
            sessions: state.sessions.map((session) =>
              session.id === currentSession!.id
                ? {
                  ...session,
                  messages: [...session.messages, canceledAIMessage],
                  updatedAt: new Date().toISOString()
                }
                : session
            ),
            loading: false,
            streaming: false,
            streamContent: '',
            streamContentRef: ''
          }));
        } else {
          set({
            loading: false,
            streaming: false,
            streamContent: '',
            streamContentRef: ''
          });
        }
        return;
      }

      const errorInfo = state.classifyError(error as Error);
      const errorAIMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: errorInfo.message,
        timestamp: new Date().toISOString(),
        status: 'error'
      };

      set((state) => ({
        sessions: state.sessions.map((session) =>
          session.id === currentSession!.id
            ? {
              ...session,
              messages: [...session.messages, errorAIMessage],
              updatedAt: new Date().toISOString()
            }
            : session
        ),
        loading: false,
        streaming: false,
        streamContent: '',
        streamContentRef: '',
        error: null
      }));
    } finally {
      set({ abortController: null });
    }
  },

  // 多模型并发发送（简化为非流式聚合）
  sendMultiModelMessage: async (request) => {
    const state = get();
    const session = state.getCurrentSession();
    if (!session) return;

    const models = (session.compareModels && session.compareModels.length > 0) ? session.compareModels : state.compareModels;
    if (!models || models.length === 0) return;

    // 记录用户消息（共用一条）
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: request.content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      images: request.images,
      texts: request.texts
    };
    set((st) => ({
      sessions: st.sessions.map((s) => {
        if (s.id !== session.id) return s;
        const map = { ...(s.messagesByModel || {}) };
        // 在每个模型专属列表里也记录用户消息（仅一次），便于列内上下文连续
        for (const model of models) {
          const arr = map[model] || [];
          if (!arr.some((m) => m.id === userMsg.id)) {
            map[model] = [...arr, userMsg];
          }
        }
        return {
          ...s,
          messages: [...s.messages, userMsg],
          messagesByModel: map,
          updatedAt: new Date().toISOString(),
        };
      })
    }));

    // 使用会话上下文构建 messages
    const historyMessages = session.messages.filter((m) => m.status === 'sent');
    const sysPrompt = state.getCurrentPrompt();

    // 并发请求各模型（按模型能力决定是否使用 SSE）
    set({ compareStreaming: true, compareStreamContentByModel: {}, compareStreamRefByModel: {} });
    const tasks = models.map(async (modelValue) => {
      const enableStream = modelSupportsStream(modelValue);
      const apiRequest: ChatCompletionRequest = {
        model: modelValue,
        messages: state.buildOpenAIMessages(
          request.content,
          request.images,
          request.texts,
          historyMessages,
          sysPrompt.content,
          { appendCurrentUser: false }
        ),
        temperature: state.modelConfig.temperature,
        max_tokens: state.modelConfig.maxTokens,
        top_p: state.modelConfig.topP,
        frequency_penalty: state.modelConfig.frequencyPenalty,
        presence_penalty: state.modelConfig.presencePenalty,
        stream: enableStream,
        top_k: state.modelConfig.topK,
        streamFormat: enableStream ? 'sse' : 'json'
      };

      try {
        const res = await sendChatRequest(
          apiRequest,
          '',
          enableStream
            ? (delta: string) => {
              set((st) => {
                const ref = { ...(st.compareStreamRefByModel || {}) };
                ref[modelValue] = (ref[modelValue] || '') + delta;
                return {
                  compareStreamRefByModel: ref,
                  compareStreamContentByModel: { ...st.compareStreamContentByModel, [modelValue]: ref[modelValue] }
                };
              });
            }
            : undefined,
          getModelProxyPath(modelValue)
        );
        const aiMsg: ChatMessage = {
          id: `msg_${Date.now()}_${modelValue}`,
          role: 'assistant',
          content: res,
          timestamp: new Date().toISOString(),
          status: 'sent',
          metadata: { model: modelValue }
        };
        set((st) => ({
          sessions: st.sessions.map((s) => {
            if (s.id !== session.id) return s;
            const map = { ...(s.messagesByModel || {}) };
            map[modelValue] = [...(map[modelValue] || []), aiMsg];
            return { ...s, messagesByModel: map, updatedAt: new Date().toISOString() };
          })
        }));
      } catch (e) {
        const err = e as Error;
        const aiErr: ChatMessage = {
          id: `msg_${Date.now()}_${modelValue}_err`,
          role: 'assistant',
          content: state.classifyError(err).message,
          timestamp: new Date().toISOString(),
          status: 'error',
          metadata: { model: modelValue }
        } as any;
        set((st) => ({
          sessions: st.sessions.map((s) => {
            if (s.id !== session.id) return s;
            const map = { ...(s.messagesByModel || {}) };
            map[modelValue] = [...(map[modelValue] || []), aiErr];
            return { ...s, messagesByModel: map, updatedAt: new Date().toISOString() };
          })
        }));
      }
    });

    await Promise.allSettled(tasks);
    set({ compareStreaming: false, compareStreamContentByModel: {}, compareStreamRefByModel: {} });
  },

  retryMessage: async (messageId) => {
    const state = get();
    const currentSession = state.getCurrentSession();
    if (!currentSession) return;

    const targetIndex = currentSession.messages.findIndex((m) => m.id === messageId);
    if (targetIndex === -1) return;

    let userIndex = targetIndex;
    let baseUserMessage = currentSession.messages[targetIndex];

    // 如果点击的是 AI 消息，则回溯到最近的上一条用户消息
    if (baseUserMessage.role !== 'user') {
      for (let i = targetIndex - 1; i >= 0; i -= 1) {
        if (currentSession.messages[i].role === 'user') {
          userIndex = i;
          baseUserMessage = currentSession.messages[i];
          break;
        }
      }
    }

    // 如果仍未找到用户消息，则不处理
    if (!baseUserMessage || baseUserMessage.role !== 'user') return;

    // 删除该用户消息之后的所有消息（保证对话一致性）
    const messagesToKeep = currentSession.messages.slice(0, userIndex + 1);

    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === currentSession.id
          ? {
            ...session,
            messages: messagesToKeep,
            updatedAt: new Date().toISOString()
          }
          : session
      )
    }));

    // 重新发送消息
      const retryRequest: SendMessageRequest = {
      content: typeof baseUserMessage.content === 'string' ? baseUserMessage.content : extractTextFromContent(baseUserMessage.content as MessageContent[]),
      images: baseUserMessage.images || [],
        texts: baseUserMessage.texts || [],
        suppressUserMessage: true
    };

    await state.sendMessage(retryRequest);
  },

  deleteMessage: (sessionId, messageId) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
            ...session,
            messages: session.messages.filter((m) => m.id !== messageId),
            updatedAt: new Date().toISOString()
          }
          : session
      )
    }));
  },

  editMessage: (sessionId, messageId, newContent) => {
    set((state) => ({
      sessions: state.sessions.map((session) =>
        session.id === sessionId
          ? {
            ...session,
            messages: session.messages.map((m) =>
              m.id === messageId ? { ...m, content: newContent } : m
            ),
            updatedAt: new Date().toISOString()
          }
          : session
      )
    }));
  },

  // 系统提示词管理
  getCurrentPrompt: () => {
    const state = get();
    return state.systemPrompts.find((p) => p.id === state.selectedPromptId) || { id: 'empty', name: '未使用系统提示词', content: '' };
  },

  selectPrompt: (promptId) => {
    set({ selectedPromptId: promptId });
  },

  addSystemPrompt: (prompt) => {
    const newPrompt: SystemPrompt = {
      ...prompt,
      id: `sys-prompt-${Date.now()}`
    };

    set((state) => ({
      systemPrompts: [...state.systemPrompts, newPrompt]
    }));

    return newPrompt;
  },

  updateSystemPrompt: (promptId, updates) => {
    set((state) => ({
      systemPrompts: state.systemPrompts.map((prompt) =>
        prompt.id === promptId ? { ...prompt, ...updates } : prompt
      )
    }));
  },

  deleteSystemPrompt: (promptId) => {
    set((state) => {
      const updatedPrompts = state.systemPrompts.filter((prompt) => prompt.id !== promptId);
      let newSelectedPromptId = state.selectedPromptId;

      if (promptId === state.selectedPromptId) {
        const defaultPrompt = updatedPrompts.find((p) => p.isDefault);
        newSelectedPromptId = defaultPrompt?.id || updatedPrompts[0]?.id || '';
      }

      return {
        systemPrompts: updatedPrompts,
        selectedPromptId: newSelectedPromptId
      };
    });
  },

  duplicateSystemPrompt: (promptId) => {
    const state = get();
    const originalPrompt = state.systemPrompts.find((p) => p.id === promptId);
    if (!originalPrompt) return null;

    const duplicatedPrompt: SystemPrompt = {
      ...originalPrompt,
      id: `sys-prompt-${Date.now()}`,
      name: `${originalPrompt.name} (副本)`,
      isDefault: false
    };

    set((state) => ({
      systemPrompts: [...state.systemPrompts, duplicatedPrompt]
    }));

    return duplicatedPrompt;
  },

  startEditPrompt: (promptId) => {
    set({ editingPromptId: promptId });
  },

  cancelEditPrompt: () => {
    set({ editingPromptId: null });
  },

  // 配置管理
  updateModelConfig: (config) => {
    set((state) => ({
      modelConfig: { ...state.modelConfig, ...config }
    }));
  },

  // 控制方法
  cancelRequest: () => {
    const state = get();
    if (state.abortController) {
      state.abortController.abort();
      set({ abortController: null });
    }

    set({
      loading: false,
      streaming: false,
      streamContent: '',
      streamContentRef: '',
      error: null
    });
  },

  // 新增：停止流式别名
  stopStreaming: () => {
    const state = get();
    state.cancelRequest();
  },

  clearError: () => {
    set({ error: null });
  },

  // 工具方法
  buildOpenAIMessages: (userContent, images = [], texts = [], historyMessages = [], systemPrompt, options = { appendCurrentUser: true }) => {
    const messages: OpenAIMessage[] = [];

    // 添加系统提示词
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    // 添加历史消息
    historyMessages.forEach((msg) => {
      if (msg.role === 'user' && (msg.images?.length || msg.texts?.length)) {
        const contentArray: MessageContent[] = [];

        if (msg.texts?.length) {
          const contextText = msg.texts.join('\n');
          contentArray.push({
            type: 'text',
            text: `上下文信息：\n${contextText}\n\n用户问题：${typeof msg.content === 'string' ? msg.content : extractTextFromContent(msg.content as MessageContent[])}`
          });
        } else {
          contentArray.push({
            type: 'text',
            text: typeof msg.content === 'string' ? msg.content : extractTextFromContent(msg.content as MessageContent[])
          });
        }

        msg.images?.forEach((imageUrl) => {
          contentArray.push({
            type: 'image_url',
            image_url: { url: imageUrl, detail: 'auto' }
          });
        });

        messages.push({
          role: msg.role,
          content: contentArray
        });
      } else {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    });

    // 构建当前用户消息（可选）
    if (options.appendCurrentUser) {
      let currentContent: string | MessageContent[];

      if (images.length > 0 || texts.length > 0) {
        const contentArray: MessageContent[] = [];

        if (texts.length > 0) {
          const contextText = texts.join('\n');
          contentArray.push({
            type: 'text',
            text: `上下文信息：\n${contextText}\n\n用户问题：${userContent}`
          });
        } else {
          contentArray.push({
            type: 'text',
            text: userContent
          });
        }

        images.forEach((imageUrl) => {
          contentArray.push({
            type: 'image_url',
            image_url: {
              url: imageUrl,
              detail: 'auto'
            }
          });
        });

        currentContent = contentArray;
      } else {
        currentContent = userContent;
      }

      messages.push({
        role: 'user',
        content: currentContent
      });
    }

    return messages;
  },

  extractTextFromContent,

  classifyError: (error) => {
    const errorMessage = error.message.toLowerCase();

    if (
      errorMessage.includes('network') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('connection') ||
      errorMessage.includes('fetch')
    ) {
      return { type: 'network', message: '🌐 网络连接错误，请检查网络后重试' };
    }

    if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
      return { type: 'api', message: '🔑 API密钥无效，请检查配置' };
    }

    if (errorMessage.includes('500') || errorMessage.includes('internal server')) {
      return { type: 'api', message: '🔧 服务器内部错误，请稍后重试' };
    }

    return { type: 'unknown', message: `❓ ${error.message}` };
  }
}));

// 额外导出别名 Hook 期望的方法签名（保持向后兼容）
export type ChatManagerMethods = Pick<ChatActions,
  'initSessions' | 'createSession' | 'selectSession' | 'deleteSession' | 'sendMessage' |
  'retryMessage' | 'editMessage' | 'deleteMessage' | 'loadMoreMessages' | 'stopStreaming' |
  'setSystemPrompt' | 'setModel'
>;