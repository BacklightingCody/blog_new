import { useEffect, useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import {
  ChatSession,
  SystemPrompt,
  ChatMessage,
  SendMessageRequest,
  ModelConfig,
  DEFAULT_MODEL_CONFIG,
  ChatCompletionRequest,
  OpenAIMessage,
  MessageContent
} from '../types';
import { mockChatSessions, mockSystemPrompts } from '../mock';
import { BASEURL, PATH, aikeys, MODELS } from '../constants';
import { sendChatRequest } from '../service';

// 工具函数：从 MessageContent[] 中提取文本内容
const extractTextFromContent = (content: MessageContent[]): string => {
  return content
    .filter((item) => item.type === 'text')
    .map((item) => item.text)
    .join(' ');
};

/**
 * 聊天管理器状态
 */
interface ChatManagerState {
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
}

/**
 * 聊天管理器 Hook
 */
export function useChatManager() {
  const [state, setState] = useState<ChatManagerState>({
    sessions: [],
    currentSessionId: null,
    systemPrompts: mockSystemPrompts,
    selectedPromptId: mockSystemPrompts[0]?.id || '',
    modelConfig: DEFAULT_MODEL_CONFIG,
    loading: false,
    streaming: false,
    streamContent: '',
    error: null,
    editingPromptId: null
  });

  const streamContentRef = useRef('');

  // 用于取消请求的 AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  // 初始化
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      sessions: mockChatSessions
    }));
  }, []);

  /**
   * 创建新会话
   */
  const createSession = (
    name?: string,
    documentContext?: {
      documentId?: string;
      version?: string;
      language?: string;
      productCode?: string;
      gitCommitId?: string;
      fileMd5?: string;
    },
    sessionType: 'public' | 'private' = 'private'
  ): ChatSession => {
    const sessionId = `session_${Date.now()}`;
    const timestamp = new Date().toISOString();

    const newSession: ChatSession = {
      id: sessionId,
      name: name || `Chat ${state.sessions.length + 1}`,
      messages: [],
      systemPromptId: state.selectedPromptId,
      modelConfig: state.modelConfig,
      createdAt: timestamp,
      updatedAt: timestamp,
      // 新增字段
      documentId: documentContext?.documentId,
      version: documentContext?.version,
      language: documentContext?.language,
      productCode: documentContext?.productCode,
      gitCommitId: documentContext?.gitCommitId,
      fileMd5: documentContext?.fileMd5,
      placeholders: [], // 初始为空，后续异步加载
      sessionType
    };

    setState((prev) => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
      currentSessionId: sessionId
    }));

    return newSession;
  };

  /**
   * 删除会话
   */
  const deleteSession = (sessionId: string) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== sessionId),
      currentSessionId:
        prev.currentSessionId === sessionId ? null : prev.currentSessionId
    }));
  };

  /**
   * 设置当前会话
   */
  const setCurrentSession = (sessionId: string) => {
    setState((prev) => ({
      ...prev,
      currentSessionId: sessionId
    }));
  };

  /**
   * 获取当前会话
   */
  const getCurrentSession = (): ChatSession | null => {
    return state.sessions.find((s) => s.id === state.currentSessionId) || null;
  };

  /**
   * 获取当前系统提示词
   */
  const getCurrentPrompt = (): SystemPrompt => {
    return (
      state.systemPrompts.find((p) => p.id === state.selectedPromptId) ||
      state.systemPrompts[0]
    );
  };

  /**
   * 构建 OpenAI 消息格式
   */
  const buildOpenAIMessages = (
    userContent: string,
    images: string[] = [],
    texts: string[] = [],
    historyMessages: ChatMessage[] = [],
    systemPrompt?: string
  ): OpenAIMessage[] => {
    const messages: OpenAIMessage[] = [];

    // 第一步也是消息中的第一条，添加系统提示词
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    // 第二步，添加历史消息
    historyMessages.forEach((msg) => {
      // 如果是用户消息且有额外的上下文信息，需要重新构建完整内容
      if (msg.role === 'user' && (msg.images?.length || msg.texts?.length)) {
        const contentArray: MessageContent[] = [];

        // 如果有文本上下文，先添加上下文信息
        if (msg.texts?.length) {
          const contextText = msg.texts.join('\n');
          contentArray.push({
            type: 'text',
            text: `上下文信息：\n${contextText}\n\n用户问题：${typeof msg.content === 'string' ? msg.content : extractTextFromContent(msg.content)}`
          });
        } else {
          // 没有文本上下文，直接添加用户内容
          contentArray.push({
            type: 'text',
            text:
              typeof msg.content === 'string'
                ? msg.content
                : extractTextFromContent(msg.content)
          });
        }

        // 添加图片
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
        // 对于AI消息或没有额外上下文的用户消息，直接使用原内容
        messages.push({
          role: msg.role,
          content: msg.content
        });
      }
    });

    // 第三步，构建当前用户消息
    let currentContent: string | MessageContent[];

    if (images.length > 0 || texts.length > 0) {
      // 多模态消息
      const contentArray: MessageContent[] = [];

      // 将文本上下文和用户输入整合
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

      // 添加图片
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
      // 纯文本消息
      currentContent = userContent;
    }

    messages.push({
      role: 'user',
      content: currentContent
    });

    return messages;
  };

  /**
   * 发送消息
   */
  const sendMessage = async (request: SendMessageRequest): Promise<void> => {
    // 确保有活动会话
    let currentSession = getCurrentSession();
    if (!currentSession) {
      currentSession = createSession();
    }

    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();

    setState((prev) => ({ ...prev, loading: true, error: null, streaming: false }));
    streamContentRef.current = '';

    try {
      // 创建用户消息 - 保持原始输入和上下文分离
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: request.content, // 保持原始用户输入
        timestamp: new Date().toISOString(),
        status: 'sent',
        // 添加额外的上下文信息，用于界面显示
        images: request.images,
        texts: request.texts
      };

      // 添加用户消息到会话
      setState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((session) =>
          session.id === currentSession!.id
            ? { ...session, messages: [...session.messages, userMessage] }
            : session
        )
      }));

      // 构建 API 请求
      const systemPrompt = getCurrentPrompt();
      const modelConfig = request.modelConfig || state.modelConfig;

      const apiRequest: ChatCompletionRequest = {
        model: modelConfig.model,
        messages: buildOpenAIMessages(
          request.content,
          request.images,
          request.texts,
          currentSession.messages.filter((m) => m.status === 'sent'),
          systemPrompt.content
        ),
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.maxTokens,
        top_p: modelConfig.topP,
        frequency_penalty: modelConfig.frequencyPenalty,
        presence_penalty: modelConfig.presencePenalty,
        stream: true,
        top_k: modelConfig.topK
      };

      // 发送请求
      setState((prev) => ({ ...prev, streaming: true }));

      const response = await sendChatRequest(
        apiRequest,
        aikeys,
        (chunk: string) => {
          streamContentRef.current += chunk;

          // 使用 flushSync 强制同步更新，确保立即渲染
          // 注意：在流式接收过程中，保持loading状态为true，直到完全接收完成
          flushSync(() => {
            setState((prev) => ({
              ...prev,
              loading: true, // 保持loading状态，直到流式接收完成
              streaming: true,
              streamContent: streamContentRef.current
            }));
          });
        },
        `${BASEURL}${PATH}`,
        abortControllerRef.current?.signal
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
      setState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((session) =>
          session.id === currentSession!.id
            ? {
                ...session,
                messages: [
                  ...session.messages.map((m) =>
                    m.id === userMessage.id ? { ...m, status: 'sent' as const } : m
                  ),
                  aiMessage
                ],
                updatedAt: new Date().toISOString()
              }
            : session
        ),
        loading: false,
        streaming: false,
        streamContent: ''
      }));
    } catch (error) {
      // 如果是用户取消的请求，保留当前已接收的内容
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🚫 用户取消了请求');

        // 如果有已接收的内容，保存为AI消息
        if (streamContentRef.current.trim()) {
          const canceledAIMessage: ChatMessage = {
            id: `msg_${Date.now()}_canceled`,
            role: 'assistant',
            content: streamContentRef.current,
            timestamp: new Date().toISOString(),
            status: 'canceled' // 新增canceled状态表示被取消的消息
          };

          // 保存已接收的内容到会话中
          setState((prev) => ({
            ...prev,
            loading: false,
            streaming: false,
            streamContent: '',
            sessions: prev.sessions.map((session) =>
              session.id === currentSession!.id
                ? {
                    ...session,
                    messages: [...session.messages, canceledAIMessage],
                    updatedAt: new Date().toISOString()
                  }
                : session
            )
          }));
        } else {
          // 如果没有接收到任何内容，只重置状态
          setState((prev) => ({
            ...prev,
            loading: false,
            streaming: false,
            streamContent: ''
          }));
        }

        // 清理streamContentRef
        streamContentRef.current = '';
        return;
      }

      const errorInfo =
        error instanceof Error
          ? classifyError(error)
          : { type: 'unknown' as const, message: '❓ 未知错误' };

      // 创建错误状态的AI消息
      const errorAIMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: errorInfo.message,
        timestamp: new Date().toISOString(),
        status: 'error'
      };

      // 添加错误消息到会话
      setState((prev) => ({
        ...prev,
        loading: false,
        streaming: false,
        streamContent: '',
        error: null, // 清除全局错误状态，因为已经有具体的错误消息了
        sessions: prev.sessions.map((session) =>
          session.id === currentSession.id
            ? {
                ...session,
                messages: [...session.messages, errorAIMessage],
                updatedAt: new Date().toISOString()
              }
            : session
        )
      }));
    } finally {
      // 清理 AbortController
      abortControllerRef.current = null;
    }
  };

  /**
   * 错误分类函数
   */
  const classifyError = (
    error: Error
  ): { type: 'network' | 'api' | 'unknown'; message: string } => {
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

    // if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
    //   return { type: 'api', message: '⏰ API调用频率超限，请稍后重试' };
    // }

    // if (errorMessage.includes('400') || errorMessage.includes('bad request')) {
    //   return { type: 'api', message: '❌ 请求参数错误' };
    // }

    if (errorMessage.includes('500') || errorMessage.includes('internal server')) {
      return { type: 'api', message: '🔧 服务器内部错误，请稍后重试' };
    }

    return { type: 'unknown', message: `❓ ${error.message}` };
  };

  /**
   * 重试消息
   */
  const retryMessage = async (messageId: string): Promise<void> => {
    const currentSession = getCurrentSession();
    if (!currentSession) return;

    const messageIndex = currentSession.messages.findIndex(
      (m) => m.id === messageId
    );
    if (messageIndex === -1) return;

    const message = currentSession.messages[messageIndex];
    if (message.role !== 'user') return;

    // 删除该用户消息之后的所有消息（包括失败的AI回复）
    const messagesToKeep = currentSession.messages.slice(0, messageIndex + 1);

    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === currentSession.id
          ? {
              ...session,
              messages: messagesToKeep,
              updatedAt: new Date().toISOString()
            }
          : session
      )
    }));

    // 构建包含完整上下文的重试请求
    const retryRequest: SendMessageRequest = {
      content:
        typeof message.content === 'string'
          ? message.content
          : extractTextFromContent(message.content as MessageContent[]),
      images: message.images || [],
      texts: message.texts || []
    };

    console.log('重试消息，包含完整上下文:', {
      content: retryRequest.content,
      images: retryRequest.images?.length || 0,
      texts: retryRequest.texts?.length || 0,
      deletedMessages: currentSession.messages.length - messagesToKeep.length
    });

    // 重新发送消息
    await sendMessage(retryRequest);
  };

  /**
   * 更新模型配置
   */
  const updateModelConfig = (config: Partial<ModelConfig>) => {
    setState((prev) => ({
      ...prev,
      modelConfig: { ...prev.modelConfig, ...config }
    }));
  };

  /**
   * 设置系统提示词
   */
  const setSystemPrompt = (promptId: string) => {
    setState((prev) => ({ ...prev, selectedPromptId: promptId }));
  };

  /**
   * 取消请求
   */
  const cancelRequest = () => {
    // 取消正在进行的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // 注意：这里不需要处理消息保存逻辑，因为AbortError会在sendMessage的catch块中处理
    // 只需要重置UI状态
    setState((prev) => ({
      ...prev,
      loading: false,
      streaming: false,
      streamContent: '',
      error: null
    }));

    console.log('🚫 请求已取消');
  };

  /**
   * 清除错误状态
   */
  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  /**
   * 更新会话名称
   */
  const updateSessionName = (sessionId: string, name: string) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, name, updatedAt: new Date().toISOString() }
          : session
      )
    }));
  };

  /**
   * 删除消息
   */
  const deleteMessage = (sessionId: string, messageId: string) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: session.messages.filter((m) => m.id !== messageId),
              updatedAt: new Date().toISOString()
            }
          : session
      )
    }));
  };

  /**
   * 编辑消息
   */
  const editMessage = (sessionId: string, messageId: string, newContent: string) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
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
  };

  /**
   * 保存新的系统提示词
   */
  const saveSystemPrompt = (prompt: Omit<SystemPrompt, 'id'>) => {
    const newPrompt: SystemPrompt = {
      ...prompt,
      id: `sys-prompt-${Date.now()}`
    };

    setState((prev) => ({
      ...prev,
      systemPrompts: [...prev.systemPrompts, newPrompt]
    }));

    return newPrompt;
  };

  /**
   * 更新系统提示词
   */
  const updateSystemPrompt = (
    promptId: string,
    updates: Partial<Omit<SystemPrompt, 'id'>>
  ) => {
    setState((prev) => ({
      ...prev,
      systemPrompts: prev.systemPrompts.map((prompt) =>
        prompt.id === promptId ? { ...prompt, ...updates } : prompt
      )
    }));
  };

  /**
   * 删除系统提示词
   */
  const deleteSystemPrompt = (promptId: string) => {
    setState((prev) => {
      const updatedPrompts = prev.systemPrompts.filter(
        (prompt) => prompt.id !== promptId
      );

      // 如果删除的是当前选中的提示词，切换到默认提示词
      let newSelectedPromptId = prev.selectedPromptId;
      if (promptId === prev.selectedPromptId) {
        const defaultPrompt = updatedPrompts.find((p) => p.isDefault);
        newSelectedPromptId = defaultPrompt?.id || updatedPrompts[0]?.id || '';
      }

      return {
        ...prev,
        systemPrompts: updatedPrompts,
        selectedPromptId: newSelectedPromptId
      };
    });
  };

  /**
   * 复制系统提示词
   */
  const duplicateSystemPrompt = (promptId: string) => {
    const originalPrompt = state.systemPrompts.find((p) => p.id === promptId);
    if (!originalPrompt) return null;

    const duplicatedPrompt: SystemPrompt = {
      ...originalPrompt,
      id: `sys-prompt-${Date.now()}`,
      name: `${originalPrompt.name} (副本)`,
      isDefault: false
    };

    setState((prev) => ({
      ...prev,
      systemPrompts: [...prev.systemPrompts, duplicatedPrompt]
    }));

    return duplicatedPrompt;
  };

  /**
   * 开始编辑系统提示词
   */
  const startEditPrompt = (promptId: string) => {
    setState((prev) => ({
      ...prev,
      editingPromptId: promptId
    }));
  };

  /**
   * 取消编辑系统提示词
   */
  const cancelEditPrompt = () => {
    setState((prev) => ({
      ...prev,
      editingPromptId: null
    }));
  };

  return {
    // 状态
    sessions: state.sessions,
    currentSessionId: state.currentSessionId,
    currentSession: getCurrentSession(),
    systemPrompts: state.systemPrompts,
    selectedPromptId: state.selectedPromptId,
    editingPromptId: state.editingPromptId,
    modelConfig: state.modelConfig,
    loading: state.loading,
    streaming: state.streaming,
    streamContent: state.streamContent,
    error: state.error,

    // 会话管理方法
    createSession,
    deleteSession,
    setCurrentSession,
    getCurrentSession,
    getCurrentPrompt,
    updateSessionName,

    // 消息管理方法
    sendMessage,
    handleSend: sendMessage,
    retryMessage,
    editMessage,
    deleteMessage,

    // 配置管理方法
    updateModelConfig,
    setSystemPrompt,

    // 系统提示词管理方法
    saveSystemPrompt,
    updateSystemPrompt,
    deleteSystemPrompt,
    duplicateSystemPrompt,
    startEditPrompt,
    cancelEditPrompt,

    // 控制方法
    cancelRequest,
    clearError,

    // 工具方法
    getAvailableModels: (hasImage?: boolean) => {
      if (hasImage !== undefined) {
        // 如果指定了 hasImage 参数，返回过滤后的平铺列表（保持向后兼容）
        return MODELS.filter((model) => !hasImage || model.supportsImage);
      }

      // 如果没有指定参数，返回分组数据
      const textOnlyModels = MODELS.filter((model) => !model.supportsImage);
      const multimodalModels = MODELS.filter((model) => model.supportsImage);

      return [
        {
          label: '📝 仅支持文字',
          title: '仅支持文字的模型',
          options: textOnlyModels.map((model) => ({
            label: model.label,
            value: model.value
          }))
        },
        {
          label: '🖼️ 支持图文',
          title: '支持图片和文字的模型',
          options: multimodalModels.map((model) => ({
            label: model.label,
            value: model.value
          }))
        }
      ];
    }
  };
}
