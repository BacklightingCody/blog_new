# 博客系统前后端完整打通项目

## 🎯 项目概述

这是一个完整的前后端分离博客系统，实现了从后端API到前端展示的完整数据流。项目支持文章管理、分类浏览、标签系统、媒体内容展示等功能，并提供了优秀的代码高亮和用户体验。

## ✨ 核心特性

### 📝 文章系统
- ✅ 文章列表展示（支持分页和无限滚动）
- ✅ 文章详情页面（支持Markdown渲染）
- ✅ 分类浏览（列表视图和时间线视图）
- ✅ 标签系统（颜色标识和过滤）
- ✅ 文章搜索和排序

### 🎨 内容展示
- ✅ 高质量代码高亮（使用prism-react-renderer）
- ✅ 媒体内容支持（图片、视频、GIF）
- ✅ 响应式设计（移动端适配）
- ✅ 暗色/亮色主题切换
- ✅ 优雅的加载状态和错误处理

### 🔧 技术特性
- ✅ TypeScript 全栈类型安全
- ✅ 服务端渲染（SSR）和静态生成（SSG）
- ✅ API 层完整封装
- ✅ 错误边界和降级处理
- ✅ 性能优化（代码分割、懒加载）

## 🛠️ 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: Shadcn/ui
- **代码高亮**: prism-react-renderer
- **Markdown**: react-markdown + remark/rehype
- **动画**: Framer Motion

### 后端
- **框架**: NestJS
- **数据库**: PostgreSQL + Prisma ORM
- **API文档**: Swagger
- **验证**: class-validator

## 🚀 快速开始

### 1. 环境要求
- Node.js 18+
- PostgreSQL 12+
- npm 或 pnpm

### 2. 后端启动
```bash
cd ../backend_new
npm install
npm run start:dev
```

### 3. 前端启动
```bash
npm install
npm run dev
```

### 4. 测试连接
```bash
# 测试API连接
node scripts/test-api-connection.js

# 导入测试数据
node scripts/import-test-data.js
```

### 5. 访问应用
- 前端应用: http://localhost:3001
- 后端API: http://localhost:3000
- API文档: http://localhost:3000/api

## 📁 核心文件结构

```
src/
├── app/docs/                  # 博客页面
│   ├── [category]/           # 分类页
│   └── [category]/[id]/      # 文章详情
├── components/features/docs/ # 博客组件
│   ├── article-page.tsx     # 文章页面
│   ├── blog-list.tsx        # 文章列表
│   ├── code-block.tsx       # 代码高亮
│   └── media-content.tsx    # 媒体组件
├── lib/api/                 # API服务层
├── types/                   # TypeScript类型
└── utils/                   # 工具函数
```

## 🔄 主要改动

### 1. API服务层重构
- 创建统一的API客户端和错误处理
- 实现完整的文章API服务
- 支持分页、搜索、过滤等功能

### 2. 类型系统完善
- 基于后端Prisma模型重新定义前端类型
- 提供类型转换和适配工具
- 确保前后端类型一致性

### 3. 组件功能增强
- 文章列表支持无限滚动和分页
- 文章详情页支持完整的Markdown渲染
- 代码高亮使用prism-react-renderer
- 媒体内容支持图片、视频、GIF

### 4. 用户体验优化
- 加载状态和错误处理
- 响应式设计和主题切换
- 性能优化和代码分割

## 📊 测试数据

项目包含完整的测试数据：
- 2个测试用户
- 8个技术标签
- 4篇示例文章

使用 `node scripts/import-test-data.js` 导入测试数据。

## 📖 详细文档

- [实现指南](./IMPLEMENTATION_GUIDE.md) - 详细的技术实现说明
- [脚本说明](./scripts/README.md) - 测试脚本使用指南

## 🚀 下一步规划

1. **用户认证系统** - 注册、登录、权限管理
2. **评论系统完善** - 完整的评论功能
3. **搜索功能** - 全文搜索和高级筛选
4. **内容管理** - 后台管理界面
5. **性能优化** - 缓存、CDN、监控

---

**项目状态**: ✅ 基础功能完成，前后端完全打通

如有问题请查看文档或提交Issue。
