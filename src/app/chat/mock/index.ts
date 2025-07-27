import {
  ChatMessage,
  SystemPrompt,
  ChatSession,
  DEFAULT_MODEL_CONFIG,
  PlaceholderItem
} from '../types';

export const mockSystemPrompts: SystemPrompt[] = [
  {
    id: 'sys-prompt-1',
    name: '默认助手',
    content: '你是一个有用的AI助手，请用简洁、准确的方式回答用户的问题。',
    description: '通用的AI助手角色，适合大多数对话场景',
    isDefault: true
  },
  {
    id: 'sys-prompt-2',
    name: '编程专家',
    content:
      '你是一个专业的编程专家，擅长多种编程语言和技术栈。请提供准确、实用的编程建议和代码示例。',
    description: '专门用于编程相关问题的助手'
  },
  {
    id: 'sys-prompt-3',
    name: '创意写作',
    content:
      '你是一个富有创意的写作助手，能够帮助用户创作各种类型的文本内容，包括故事、诗歌、文章等。',
    description: '专门用于创意写作和内容创作'
  }
];

// 创建消息的辅助函数
const createMessage = (
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

export const mockChatSessions: ChatSession[] = [
  {
    id: 'session-1',
    name: '关于人工智能的探讨',
    systemPromptId: 'sys-prompt-1',
    modelConfig: DEFAULT_MODEL_CONFIG,
    createdAt: '2025-07-10T10:00:00Z',
    updatedAt: '2025-07-10T10:15:00Z',
    messages: [
      createMessage('msg-1-1', 'user', '你好，我想了解一下人工智能的发展趋势。', 15),
      createMessage(
        'msg-1-2',
        'assistant',
        '你好！人工智能的发展趋势非常令人兴奋。目前主要有以下几个方向：\n\n1. **大语言模型**：如GPT、Claude等，在自然语言理解和生成方面取得了突破性进展。\n\n2. **多模态AI**：能够同时处理文本、图像、音频等多种数据类型。',
        14
      ),
      createMessage('msg-1-3', 'user', '能详细说说多模态AI的应用场景吗？', 10),
      createMessage(
        'msg-1-4',
        'assistant',
        '多模态AI有很多实际应用场景：\n\n1. **智能客服**：结合语音识别、自然语言处理和图像识别。\n2. **自动驾驶**：融合视觉、雷达等传感器数据。\n3. **内容创作**：根据文本描述生成图像或视频。',
        8
      )
    ],
    documentId: '1',
    version: '3.10.10',
    language: 'zh',
    productCode: '112313',
    gitCommitId: '1123131',
    fileMd5: '112313123123113',
    sessionType: 'public'
  },
  {
    id: 'session-2',
    name: '编程问题咨询',
    systemPromptId: 'sys-prompt-2',
    modelConfig: DEFAULT_MODEL_CONFIG,
    createdAt: '2025-07-11T14:30:00Z',
    updatedAt: '2025-07-11T14:45:00Z',
    messages: [
      createMessage('msg-2-1', 'user', 'Python中如何反转一个字符串？', 30),
      createMessage(
        'msg-2-2',
        'assistant',
        '在Python中有几种方法可以反转字符串：\n\n```python\n# 方法1：使用切片\ntext = "hello"\nreversed_text = text[::-1]\nprint(reversed_text)  # "olleh"\n\n# 方法2：使用reversed()函数\nreversed_text = "".join(reversed(text))\n\n# 方法3：使用递归\ndef reverse_string(s):\n    if len(s) <= 1:\n        return s\n    return s[-1] + reverse_string(s[:-1])\n```',
        28
      )
    ],
    documentId: '1',
    version: '3.10.11',
    language: 'en',
    productCode: '100120301',
    gitCommitId: '1123113',
    fileMd5: '112313213123123123132',
    sessionType: 'public'
  }
];
// export const mockPlaceholderData: PlaceholderItem[] = [
//   // 文档类占位符
//   {
//     id: 'doc1',
//     key: '{{doc1}}',
//     value: '这是第一个文档的内容，包含了产品的基本介绍和使用说明...',
//     type: 'doc' as const,
//     label: '主文档',
//     description: '产品主要文档内容',
//     placeholder: '{{doc1}}'
//   },
//   {
//     id: 'doc2',
//     key: '{{doc2}}',
//     value: '这是第二个文档的内容，包含了API接口的详细说明...',
//     type: 'doc' as const,
//     label: 'API文档',
//     description: 'API接口文档',
//     placeholder: '{{doc2}}'
//   },

//   // 图片类占位符
//   {
//     id: 'img1',
//     key: '{{img1}}',
//     value: 'https://picsum.photos/400/300?random=1',
//     type: 'img' as const,
//     label: '产品截图1',
//     description: '产品主界面截图',
//     placeholder: '{{img1}}'
//   },
//   {
//     id: 'img2',
//     key: '{{img2}}',
//     value: 'https://picsum.photos/400/300?random=2',
//     type: 'img' as const,
//     label: '产品截图2',
//     description: '产品设置页面截图',
//     placeholder: '{{img2}}'
//   },
//   {
//     id: 'img3',
//     key: '{{img3}}',
//     value: 'https://picsum.photos/600/400?random=3',
//     type: 'img' as const,
//     label: '流程图',
//     description: '业务流程图',
//     placeholder: '{{img3}}'
//   },

//   // 版本信息
//   {
//     id: 'version',
//     key: '{{version}}',
//     value: 'v2.1.0',
//     type: 'version' as const,
//     label: '当前版本',
//     description: '当前产品版本号',
//     placeholder: '{{version}}'
//   },

//   // 语言信息
//   {
//     id: 'language',
//     key: '{{language}}',
//     value: 'zh-CN',
//     type: 'language' as const,
//     label: '语言',
//     description: '当前语言设置',
//     placeholder: '{{language}}'
//   },

//   // 产品信息
//   {
//     id: 'product',
//     key: '{{product}}',
//     value: 'JiGuang-Doc',
//     type: 'product' as const,
//     label: '产品代码',
//     description: '当前产品代码',
//     placeholder: '{{product}}'
//   },

//   // Git信息
//   {
//     id: 'gitCommitId',
//     key: '{{gitCommitId}}',
//     value: 'abc123def456',
//     type: 'gitCommitId' as const,
//     label: 'Git提交ID',
//     description: '当前Git提交ID',
//     placeholder: '{{gitCommitId}}'
//   },

//   // 文件MD5
//   {
//     id: 'fileMd5',
//     key: '{{fileMd5}}',
//     value: 'd41d8cd98f00b204e9800998ecf8427e',
//     type: 'fileMd5' as const,
//     label: '文件MD5',
//     description: '当前文件的MD5值',
//     placeholder: '{{fileMd5}}'
//   }
// ];
export const mockPlaceholderData = []