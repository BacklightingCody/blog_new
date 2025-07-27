# 前端开发规范

## 📁 项目结构规范

```
src/
├── app/                    # Next.js App Router 页面
│   ├── (routes)/          # 路由组织
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 页面组件
├── components/            # 组件库
│   ├── ui/               # 基础UI组件 (shadcn/ui)
│   ├── common/           # 通用组件
│   ├── composite/        # 复合组件
│   ├── features/         # 功能组件
│   ├── layout/           # 布局组件
│   ├── theme/            # 主题相关组件
│   └── user/             # 用户相关组件
├── hooks/                # 自定义 Hooks
├── lib/                  # 工具库
├── types/                # TypeScript 类型定义
├── constants/            # 常量定义
├── utils/                # 工具函数
├── zustand/              # Zustand 状态管理
├── routes/               # 路由配置
└── middleware/           # 中间件
```

## 📝 命名规范

### 文件命名
- 文件名: `kebab-case`
- 组件文件: `component-name.tsx`
- 页面文件: `page.tsx`, `layout.tsx`, `loading.tsx`
- Hook文件: `use-hook-name.ts`
- 工具文件: `util-name.ts`

### 组件命名
- React组件: `PascalCase`
- 组件导出: `export const ComponentName`
- 组件文件夹: `kebab-case`

### 变量命名
- 变量: `camelCase`
- 常量: `SCREAMING_SNAKE_CASE`
- 函数: `camelCase` (动词开头)
- 类型/接口: `PascalCase`

## 🛠️ 技术栈规范

### 核心技术
- **框架**: Next.js 15 (App Router)
- **UI库**: React 19
- **语言**: TypeScript 5+
- **样式**: Tailwind CSS 4+
- **包管理**: pnpm

### UI组件库
- **基础组件**: Radix UI
- **完整组件**: Ant Design
- **定制组件**: shadcn/ui
- **图标**: Lucide React, Ant Design Icons

### 状态管理
- **全局状态**: Zustand
- **服务端状态**: 原生 fetch (未来考虑 React Query)
- **表单状态**: React Hook Form (推荐)

## 🎨 样式规范

### Tailwind CSS 使用规范
- 优先使用 Tailwind 原子类
- 自定义样式放在 `globals.css`
- 组件样式使用 `@apply` 指令
- 响应式设计: `mobile-first`

### CSS 变量规范
```css
:root {
  --primary-color: #your-color;
  --background-color: #your-color;
  --text-color: #your-color;
  --border-color: #your-color;
}
```

### 主题系统
- 使用 `next-themes` 管理主题
- 支持多色彩主题切换
- CSS 变量驱动的主题系统

## 🔄 状态管理规范

### Zustand Store 结构
```typescript
interface StoreState {
  // 状态
  data: DataType
  loading: boolean
  error: string | null
  
  // 动作
  fetchData: () => Promise<void>
  updateData: (data: DataType) => void
  resetState: () => void
}
```

### Store 文件命名
- 文件名: `{domain}Store.ts`
- Store 变量: `use{Domain}Store`

### 状态分层
- **全局状态**: 主题、用户信息、应用配置
- **页面状态**: 页面级别数据
- **组件状态**: 本地 UI 状态

## 🧩 组件开发规范

### 组件结构
```typescript
interface ComponentProps {
  // props 定义
}

export const ComponentName: React.FC<ComponentProps> = ({
  // props 解构
}) => {
  // hooks
  // 状态
  // 副作用
  // 事件处理
  // 渲染逻辑
  
  return (
    // JSX
  )
}
```

### 组件分类
- **UI组件**: 纯展示组件，无业务逻辑
- **容器组件**: 包含业务逻辑和状态管理
- **页面组件**: 路由级别组件
- **布局组件**: 页面布局结构

### Props 规范
- 使用 TypeScript 接口定义 Props
- 必需属性在前，可选属性在后
- 使用 JSDoc 注释说明复杂属性

## 🪝 Hooks 使用规范

### 自定义 Hooks
- 文件名: `use-hook-name.ts`
- Hook 名称: `useHookName`
- 返回值使用对象或数组

### Hook 规则
- 只在组件顶层调用 Hooks
- 不在循环、条件或嵌套函数中调用
- 自定义 Hook 必须以 `use` 开头

### 常用 Hooks 模式
```typescript
// 数据获取
const useApiData = (url: string) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // 实现逻辑
  
  return { data, loading, error, refetch }
}
```

## 🔧 代码质量规范

### ESLint 规则
- 使用 Next.js 推荐配置
- 集成 Prettier 格式化
- 禁用 `any` 类型使用
- 强制使用 TypeScript 严格模式

### TypeScript 规范
- 启用严格模式
- 明确定义所有类型
- 避免使用 `any`
- 使用联合类型而非枚举

### 代码组织
- 一个文件一个组件
- 相关文件放在同一目录
- 使用 barrel exports (`index.ts`)

## 🧪 测试规范

### 测试文件命名
- 单元测试: `component.test.tsx`
- 集成测试: `feature.integration.test.tsx`
- E2E测试: `flow.e2e.test.tsx`

### 测试覆盖率
- 组件测试覆盖率 >= 80%
- 工具函数测试覆盖率 >= 90%
- 关键业务逻辑 100% 覆盖

## 📱 响应式设计规范

### 断点定义
```javascript
// Tailwind 断点
sm: '640px'   // 手机横屏
md: '768px'   // 平板
lg: '1024px'  // 笔记本
xl: '1280px'  // 桌面
2xl: '1536px' // 大屏
```

### 设计原则
- Mobile First 设计
- 渐进增强
- 触摸友好的交互
- 性能优先

## 🚀 性能优化规范

### 代码分割
- 页面级别代码分割
- 组件懒加载
- 第三方库按需引入

### 图片优化
- 使用 Next.js Image 组件
- 支持 WebP 格式
- 实现懒加载

### 缓存策略
- 静态资源缓存
- API 响应缓存
- 组件级别缓存

## 🔒 安全规范

### 数据处理
- 用户输入验证
- XSS 防护
- CSRF 防护

### 环境变量
- 敏感信息使用环境变量
- 客户端变量以 `NEXT_PUBLIC_` 开头
- 不在代码中硬编码密钥

## 📦 依赖管理规范

### 包管理
- 统一使用 `pnpm`
- 定期更新依赖
- 审查新增依赖的必要性

### 版本控制
- 锁定主要版本号
- 定期安全更新
- 测试依赖更新影响

## 🔄 开发流程规范

### Git 提交
- 使用 Conventional Commits
- 提交前运行 lint 检查
- 小步提交，频繁推送

### 代码审查
- 所有代码必须经过审查
- 关注代码质量和性能
- 检查类型安全和测试覆盖

### 部署流程
- 开发环境自动部署
- 生产环境手动触发
- 部署前运行完整测试套件
