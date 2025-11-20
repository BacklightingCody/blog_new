# Blog 项目源码结构

这是一个基于 Next.js 15 和 React 的现代化博客平台。

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router 页面
│   ├── api/               # API 路由
│   ├── docs/              # 文档页面
│   ├── chat/              # 聊天页面
│   ├── layout.tsx         # 根布局（服务端组件）
│   ├── page.tsx           # 首页
│   └── providers.tsx      # 客户端提供者
├── components/            # React 组件
│   ├── features/          # 功能组件
│   │   ├── docs/          # 文档相关组件
│   │   └── chat/          # 聊天相关组件
│   ├── layout/            # 布局组件
│   ├── ui/                # 基础 UI 组件
│   └── common/            # 通用组件
├── hooks/                 # 自定义 Hook
├── lib/                   # 第三方库配置
├── services/              # 数据服务层
├── types/                 # TypeScript 类型定义
├── utils/                 # 工具函数
├── config/                # 配置文件
├── constants/             # 常量定义
├── zustand/               # 状态管理
└── mock/                  # 模拟数据
```

## 🏗️ 架构设计

### 组件分层

1. **服务端组件**：用于数据获取和初始渲染
2. **客户端组件**：用于交互和状态管理
3. **UI 组件**：可复用的基础组件

### 数据流

1. **服务端数据获取**：使用 `lib/api/articles.ts` 中的缓存函数
2. **客户端数据获取**：使用 `services/` 中的服务类
3. **状态管理**：使用 Zustand 进行全局状态管理

### 路由结构

- `/` - 首页
- `/docs` - 文档列表页
- `/docs/[category]` - 分类页面
- `/docs/[category]/[id]` - 文章详情页
- `/chat` - 聊天页面

## 🚀 最佳实践

### 1. 组件开发

- 优先使用服务端组件
- 只在需要交互时使用客户端组件
- 使用 TypeScript 进行类型检查
- 遵循单一职责原则

### 2. 数据获取

- 服务端：使用 React `cache()` 缓存数据
- 客户端：使用自定义 Hook 管理状态
- 使用 Next.js 15 的新数据获取模式

### 3. 性能优化

- 使用 `React.memo()` 避免不必要的重渲染
- 实现虚拟滚动和无限加载
- 优化图片和资源加载

### 4. SEO 优化

- 使用动态 Metadata 生成
- 实现结构化数据
- 优化页面加载速度

## 🔧 开发指南

### 添加新功能

1. 在 `types/` 中定义相关类型
2. 在 `services/` 中实现数据服务
3. 创建服务端组件获取初始数据
4. 创建客户端组件处理交互
5. 添加相应的 API 路由

### 样式规范

- 使用 Tailwind CSS 进行样式设计
- 使用 CSS 变量实现主题切换
- 遵循一致的设计系统

### 代码规范

- 使用 ESLint 和 Prettier 保持代码一致性
- 遵循 React 和 Next.js 最佳实践
- 编写有意义的注释和文档

## 🐛 问题排查

### 常见问题

1. **Hydration 错误**：确保服务端和客户端渲染一致
2. **导入错误**：使用正确的相对路径或别名
3. **类型错误**：检查 TypeScript 类型定义

### 调试技巧

- 使用 React DevTools 调试组件
- 使用 Next.js 开发工具检查路由
- 查看网络请求和 API 响应

## 📦 部署

### 环境变量

确保设置以下环境变量：

```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_***
CLERK_SECRET_KEY=sk_***
```

### 构建和部署

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码变更
4. 发起 Pull Request

## 📝 更新日志

### v2.0.0
- 重构为 Next.js 15 架构
- 实现服务端和客户端组件分离
- 优化数据获取和缓存策略
- 改进 TypeScript 类型系统
- 增强 SEO 和性能优化
