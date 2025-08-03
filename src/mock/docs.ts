/**
 * 文档相关的Mock数据
 * 用于API路由的测试数据
 */

export const mockArticles = [
  // 编程类文章
  {
    id: 1,
    slug: 'getting-started-with-nextjs',
    title: 'Next.js 入门指南',
    summary: '学习如何使用 Next.js 构建现代化的 React 应用程序',
    content: `# Next.js 入门指南

Next.js 是一个基于 React 的全栈框架，提供了许多开箱即用的功能...

## 主要特性

- 服务端渲染 (SSR)
- 静态站点生成 (SSG)
- API 路由
- 自动代码分割
- 内置 CSS 支持

## 快速开始

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

这样就可以创建一个新的 Next.js 项目并启动开发服务器。`,
    html: '<h1>Next.js 入门指南</h1><p>Next.js 是一个基于 React 的全栈框架...</p>',
    coverImage: '/images/nextjs-cover.jpg',
    readTime: 5,
    category: 'programming',
    tags: ['Next.js', 'React', 'JavaScript'],
    isPublished: true,
    isDraft: false,
    viewCount: 1250,
    likes: 89,
    bookmarks: 34,
    comments: 12,
    userId: 1,
    user: {
      id: 1,
      username: 'coder_zhang',
      firstName: '张',
      lastName: '三',
      imageUrl: '/avatars/zhang.jpg',
    },
    articleTags: [
      { 
        tag: { 
          id: 1, 
          name: 'Next.js', 
          slug: 'nextjs', 
          color: '#000000',
          description: 'React框架',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-15T10:00:00Z'
      },
      { 
        tag: { 
          id: 2, 
          name: 'React', 
          slug: 'react', 
          color: '#61dafb',
          description: 'JavaScript库',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-15T10:00:00Z'
      },
      { 
        tag: { 
          id: 3, 
          name: 'JavaScript', 
          slug: 'javascript', 
          color: '#f7df1e',
          description: '编程语言',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-15T10:00:00Z'
      },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    slug: 'react-hooks-guide',
    title: 'React Hooks 完全指南',
    summary: '深入理解 React Hooks 的使用方法和最佳实践',
    content: `# React Hooks 完全指南

React Hooks 是 React 16.8 引入的新特性，让你可以在函数组件中使用状态和其他 React 特性...

## 常用 Hooks

### useState
用于在函数组件中添加状态。

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

### useEffect
用于处理副作用，如数据获取、订阅等。

\`\`\`javascript
useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);
\`\`\``,
    html: '<h1>React Hooks 完全指南</h1><p>React Hooks 是 React 16.8 引入的新特性...</p>',
    coverImage: '/images/react-hooks-cover.jpg',
    readTime: 8,
    category: 'programming',
    tags: ['React', 'Hooks', 'JavaScript'],
    isPublished: true,
    isDraft: false,
    viewCount: 2100,
    likes: 156,
    bookmarks: 78,
    comments: 23,
    userId: 1,
    user: {
      id: 1,
      username: 'coder_zhang',
      firstName: '张',
      lastName: '三',
      imageUrl: '/avatars/zhang.jpg',
    },
    articleTags: [
      { 
        tag: { 
          id: 2, 
          name: 'React', 
          slug: 'react', 
          color: '#61dafb',
          description: 'JavaScript库',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-10T14:30:00Z'
      },
      { 
        tag: { 
          id: 4, 
          name: 'Hooks', 
          slug: 'hooks', 
          color: '#61dafb',
          description: 'React钩子',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-10T14:30:00Z'
      },
      { 
        tag: { 
          id: 3, 
          name: 'JavaScript', 
          slug: 'javascript', 
          color: '#f7df1e',
          description: '编程语言',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-10T14:30:00Z'
      },
    ],
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: 3,
    slug: 'typescript-best-practices',
    title: 'TypeScript 最佳实践',
    summary: 'TypeScript 开发中的最佳实践和常见模式',
    content: `# TypeScript 最佳实践

TypeScript 为 JavaScript 添加了静态类型检查，提高了代码的可维护性和可读性...

## 类型定义

### 接口 vs 类型别名

\`\`\`typescript
// 接口
interface User {
  id: number;
  name: string;
  email: string;
}

// 类型别名
type UserType = {
  id: number;
  name: string;
  email: string;
};
\`\`\`

### 泛型的使用

\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}
\`\`\``,
    html: '<h1>TypeScript 最佳实践</h1><p>TypeScript 为 JavaScript 添加了静态类型检查...</p>',
    coverImage: '/images/typescript-cover.jpg',
    readTime: 12,
    category: 'programming',
    tags: ['TypeScript', 'JavaScript', 'Types'],
    isPublished: true,
    isDraft: false,
    viewCount: 1800,
    likes: 134,
    bookmarks: 67,
    comments: 18,
    userId: 1,
    user: {
      id: 1,
      username: 'coder_zhang',
      firstName: '张',
      lastName: '三',
      imageUrl: '/avatars/zhang.jpg',
    },
    articleTags: [
      { 
        tag: { 
          id: 5, 
          name: 'TypeScript', 
          slug: 'typescript', 
          color: '#3178c6',
          description: 'JavaScript超集',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-05T09:15:00Z'
      },
      { 
        tag: { 
          id: 3, 
          name: 'JavaScript', 
          slug: 'javascript', 
          color: '#f7df1e',
          description: '编程语言',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-05T09:15:00Z'
      },
      { 
        tag: { 
          id: 6, 
          name: 'Types', 
          slug: 'types', 
          color: '#3178c6',
          description: '类型系统',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-05T09:15:00Z'
      },
    ],
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
  },

  // AI类文章
  {
    id: 4,
    slug: 'introduction-to-machine-learning',
    title: '机器学习入门指南',
    summary: '从零开始学习机器学习的基本概念和常用算法',
    content: `# 机器学习入门指南

机器学习是人工智能的一个重要分支，让计算机能够从数据中学习并做出预测...

## 机器学习类型

### 监督学习
使用标记数据训练模型，包括分类和回归问题。

### 无监督学习
从未标记的数据中发现隐藏的模式。

### 强化学习
通过与环境交互来学习最优策略。

## 常用算法

- 线性回归
- 决策树
- 随机森林
- 支持向量机
- 神经网络`,
    html: '<h1>机器学习入门指南</h1><p>机器学习是人工智能的一个重要分支...</p>',
    coverImage: '/images/ml-cover.jpg',
    readTime: 15,
    category: 'ai',
    tags: ['机器学习', 'AI', 'Python'],
    isPublished: true,
    isDraft: false,
    viewCount: 3200,
    likes: 245,
    bookmarks: 128,
    comments: 45,
    userId: 2,
    user: {
      id: 2,
      username: 'ai_expert',
      firstName: '李',
      lastName: '四',
      imageUrl: '/avatars/li.jpg',
    },
    articleTags: [
      { 
        tag: { 
          id: 7, 
          name: '机器学习', 
          slug: 'machine-learning', 
          color: '#ff6b6b',
          description: '人工智能分支',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-20T16:45:00Z'
      },
      { 
        tag: { 
          id: 8, 
          name: 'AI', 
          slug: 'ai', 
          color: '#4ecdc4',
          description: '人工智能',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-20T16:45:00Z'
      },
      { 
        tag: { 
          id: 9, 
          name: 'Python', 
          slug: 'python', 
          color: '#3776ab',
          description: '编程语言',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-20T16:45:00Z'
      },
    ],
    createdAt: '2024-01-20T16:45:00Z',
    updatedAt: '2024-01-20T16:45:00Z',
  },
  {
    id: 5,
    slug: 'chatgpt-prompt-engineering',
    title: 'ChatGPT 提示词工程实战',
    summary: '掌握ChatGPT提示词设计技巧，提高AI对话效果',
    content: `# ChatGPT 提示词工程实战

提示词工程是与AI模型有效交互的关键技能...

## 基本原则

### 明确性
提示词要清晰、具体，避免歧义。

### 上下文
提供足够的背景信息帮助AI理解任务。

### 示例
通过few-shot learning提供示例。

## 高级技巧

### 角色扮演
让AI扮演特定角色来获得专业回答。

### 思维链
引导AI逐步思考复杂问题。

### 约束条件
设置输出格式和内容限制。`,
    html: '<h1>ChatGPT 提示词工程实战</h1><p>提示词工程是与AI模型有效交互的关键技能...</p>',
    coverImage: '/images/chatgpt-cover.jpg',
    readTime: 10,
    category: 'ai',
    tags: ['ChatGPT', '提示词', 'AI'],
    isPublished: true,
    isDraft: false,
    viewCount: 2800,
    likes: 198,
    bookmarks: 95,
    comments: 32,
    userId: 2,
    user: {
      id: 2,
      username: 'ai_expert',
      firstName: '李',
      lastName: '四',
      imageUrl: '/avatars/li.jpg',
    },
    articleTags: [
      { 
        tag: { 
          id: 10, 
          name: 'ChatGPT', 
          slug: 'chatgpt', 
          color: '#10a37f',
          description: 'AI聊天机器人',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-18T11:20:00Z'
      },
      { 
        tag: { 
          id: 11, 
          name: '提示词', 
          slug: 'prompt', 
          color: '#10a37f',
          description: 'AI提示工程',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-18T11:20:00Z'
      },
      { 
        tag: { 
          id: 8, 
          name: 'AI', 
          slug: 'ai', 
          color: '#4ecdc4',
          description: '人工智能',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-18T11:20:00Z'
      },
    ],
    createdAt: '2024-01-18T11:20:00Z',
    updatedAt: '2024-01-18T11:20:00Z',
  },

  // 食谱类文章
  {
    id: 6,
    slug: 'classic-mapo-tofu',
    title: '经典麻婆豆腐制作方法',
    summary: '学会制作正宗的四川麻婆豆腐，麻辣鲜香',
    content: `# 经典麻婆豆腐制作方法

麻婆豆腐是四川省传统名菜之一，以其麻、辣、鲜、香的特点而闻名...

## 所需食材

### 主料
- 嫩豆腐 400g
- 牛肉末 100g
- 豆瓣酱 2勺

### 调料
- 花椒粉 1勺
- 生抽 1勺
- 老抽 半勺
- 糖 少许
- 葱花 适量

## 制作步骤

1. 豆腐切块，用盐水焯一下
2. 热锅下油，炒牛肉末
3. 加入豆瓣酱炒出红油
4. 下豆腐块，轻轻翻炒
5. 调味，撒花椒粉和葱花即可`,
    html: '<h1>经典麻婆豆腐制作方法</h1><p>麻婆豆腐是四川省传统名菜之一...</p>',
    coverImage: '/images/mapo-tofu-cover.jpg',
    readTime: 6,
    category: 'recipe',
    tags: ['川菜', '豆腐', '家常菜'],
    isPublished: true,
    isDraft: false,
    viewCount: 1650,
    likes: 112,
    bookmarks: 89,
    comments: 28,
    userId: 3,
    user: {
      id: 3,
      username: 'chef_wang',
      firstName: '王',
      lastName: '五',
      imageUrl: '/avatars/wang.jpg',
    },
    articleTags: [
      { 
        tag: { 
          id: 12, 
          name: '川菜', 
          slug: 'sichuan-cuisine', 
          color: '#e74c3c',
          description: '四川菜系',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-12T19:30:00Z'
      },
      { 
        tag: { 
          id: 13, 
          name: '豆腐', 
          slug: 'tofu', 
          color: '#f39c12',
          description: '豆制品',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-12T19:30:00Z'
      },
      { 
        tag: { 
          id: 14, 
          name: '家常菜', 
          slug: 'home-cooking', 
          color: '#27ae60',
          description: '日常菜谱',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-12T19:30:00Z'
      },
    ],
    createdAt: '2024-01-12T19:30:00Z',
    updatedAt: '2024-01-12T19:30:00Z',
  },
  {
    id: 7,
    slug: 'homemade-pizza-recipe',
    title: '自制披萨完整教程',
    summary: '在家也能做出美味的意式披萨，从面团到烘烤全流程',
    content: `# 自制披萨完整教程

披萨是意大利的传统美食，现在在家也能制作出美味的披萨...

## 披萨面团

### 材料
- 高筋面粉 300g
- 温水 180ml
- 酵母 3g
- 盐 5g
- 橄榄油 15ml

### 制作方法
1. 酵母用温水化开
2. 面粉加盐混合
3. 加入酵母水和橄榄油
4. 揉成光滑面团
5. 发酵1小时至两倍大

## 披萨酱
- 番茄酱 200g
- 大蒜 2瓣
- 罗勒叶 适量
- 盐、胡椒调味

## 组装与烘烤
1. 面团擀成圆饼
2. 刷披萨酱
3. 撒马苏里拉奶酪
4. 加喜欢的配菜
5. 烤箱220°C烤12-15分钟`,
    html: '<h1>自制披萨完整教程</h1><p>披萨是意大利的传统美食...</p>',
    coverImage: '/images/pizza-cover.jpg',
    readTime: 8,
    category: 'recipe',
    tags: ['披萨', '意式', '烘焙'],
    isPublished: true,
    isDraft: false,
    viewCount: 2200,
    likes: 167,
    bookmarks: 134,
    comments: 41,
    userId: 3,
    user: {
      id: 3,
      username: 'chef_wang',
      firstName: '王',
      lastName: '五',
      imageUrl: '/avatars/wang.jpg',
    },
    articleTags: [
      { 
        tag: { 
          id: 15, 
          name: '披萨', 
          slug: 'pizza', 
          color: '#e67e22',
          description: '意式美食',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-08T15:45:00Z'
      },
      { 
        tag: { 
          id: 16, 
          name: '意式', 
          slug: 'italian', 
          color: '#2ecc71',
          description: '意大利风味',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-08T15:45:00Z'
      },
      { 
        tag: { 
          id: 17, 
          name: '烘焙', 
          slug: 'baking', 
          color: '#f1c40f',
          description: '烘焙技术',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-08T15:45:00Z'
      },
    ],
    createdAt: '2024-01-08T15:45:00Z',
    updatedAt: '2024-01-08T15:45:00Z',
  },

  // 生活类文章
  {
    id: 8,
    slug: 'minimalist-lifestyle-guide',
    title: '极简生活方式指南',
    summary: '学会断舍离，拥抱简单而有意义的生活',
    content: `# 极简生活方式指南

极简主义不仅仅是减少物品，更是一种生活哲学...

## 极简的核心理念

### 专注重要的事
去除生活中的干扰，专注于真正重要的事情。

### 质量胜过数量
选择高质量的物品，而不是大量的低质量物品。

### 体验胜过物质
重视体验和关系，而不是物质积累。

## 实践步骤

### 1. 整理物品
- 分类整理所有物品
- 保留真正需要和喜爱的
- 捐赠或处理多余物品

### 2. 数字极简
- 清理手机应用
- 减少社交媒体使用
- 整理数字文件

### 3. 时间管理
- 学会说不
- 专注重要任务
- 留出空白时间`,
    html: '<h1>极简生活方式指南</h1><p>极简主义不仅仅是减少物品...</p>',
    coverImage: '/images/minimalist-cover.jpg',
    readTime: 7,
    category: 'life',
    tags: ['极简', '生活方式', '断舍离'],
    isPublished: true,
    isDraft: false,
    viewCount: 1890,
    likes: 143,
    bookmarks: 76,
    comments: 35,
    userId: 4,
    user: {
      id: 4,
      username: 'life_guru',
      firstName: '赵',
      lastName: '六',
      imageUrl: '/avatars/zhao.jpg',
    },
    articleTags: [
      { 
        tag: { 
          id: 18, 
          name: '极简', 
          slug: 'minimalism', 
          color: '#95a5a6',
          description: '极简主义',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-14T13:15:00Z'
      },
      { 
        tag: { 
          id: 19, 
          name: '生活方式', 
          slug: 'lifestyle', 
          color: '#3498db',
          description: '生活理念',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-14T13:15:00Z'
      },
      { 
        tag: { 
          id: 20, 
          name: '断舍离', 
          slug: 'decluttering', 
          color: '#9b59b6',
          description: '整理方法',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        createdAt: '2024-01-14T13:15:00Z'
      },
    ],
    createdAt: '2024-01-14T13:15:00Z',
    updatedAt: '2024-01-14T13:15:00Z',
  },
];

export const mockCategories = [
  { 
    id: 'programming', 
    name: '编程', 
    slug: 'programming',
    description: '编程技术、框架、最佳实践',
    color: '#3b82f6',
    icon: '💻',
    count: 15 
  },
  { 
    id: 'ai', 
    name: 'AI', 
    slug: 'ai',
    description: '人工智能、机器学习、深度学习',
    color: '#8b5cf6',
    icon: '🤖',
    count: 8 
  },
  { 
    id: 'recipe', 
    name: '食谱', 
    slug: 'recipe',
    description: '美食制作、烹饪技巧、营养搭配',
    color: '#10b981',
    icon: '🍳',
    count: 12 
  },
  { 
    id: 'life', 
    name: '生活', 
    slug: 'life',
    description: '生活方式、个人成长、健康养生',
    color: '#f59e0b',
    icon: '🌱',
    count: 6 
  },
];

export const mockPopularArticles = mockArticles
  .sort((a, b) => b.viewCount - a.viewCount)
  .slice(0, 5);

export const mockRecentArticles = mockArticles
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5);