import { generateId } from "../utils"

export interface ArticleDetailData {
  id: string
  slug: string
  title: string
  author: {
    id: string
    name: string
    avatar: string
    bio: string
  }
  coverImage: string
  createdAt: string
  updatedAt: string
  readTime: string
  category: string
  tags: string[]
  summary: string
  content: string
  likes: number
  bookmarks: number
  comments: number
}

export const article:ArticleDetailData = {
  id: generateId().toString(),
  slug: "react-18-concurrent-rendering",
  title: "深入理解 React 18 的并发特性：Suspense 和 Concurrent Rendering",
  author: {
    id: "user_123",
    name: "张三",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "前端架构师，专注于 React 生态系统",
  },
  coverImage: "/cover/react-concurrency.png",
  createdAt: "2024-01-15",
  updatedAt: "2024-01-15",
  readTime: "8分钟阅读",
  category: "前端开发",
  tags: ["React", "JavaScript", "前端"],
  summary:
    "本文深入探讨了 React 18 引入的并发特性，包括 Suspense 组件的工作原理、Concurrent Rendering 的实现机制，以及这些特性如何提升用户体验。我们将通过实际代码示例来演示如何在项目中有效利用这些新特性。",
  content: `
  ## 目录\n<!-- toc -->
React 18 带来了许多令人兴奋的新特性，其中最重要的就是并发特性（Concurrent Features）。这些特性不仅改变了 React 的渲染方式，也为开发者提供了更好的用户体验控制能力。

## 什么是并发渲染？

![图片alt](/avatar.jpg)

| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Here's this   |
| Paragraph   | Text        | And more      |

并发渲染（Concurrent Rendering）是 React 18 的核心特性之一。它允许 React 在渲染过程中暂停、恢复或放弃工作，从而保持应用的响应性。

### 主要优势

1. **更好的用户体验**：通过优先级调度，确保高优先级的更新（如用户输入）能够快速响应
2. **避免阻塞**：长时间的渲染任务不会阻塞浏览器的主线程
3. **智能批处理**：自动批处理多个状态更新，减少不必要的重渲染

## Suspense 的进化

Suspense 在 React 18 中得到了显著增强，现在不仅支持代码分割，还支持数据获取。

\`\`\`jsx
function App() {
  return (
    <Suspense fallback={<Loading />}>
      <UserProfile userId={1} />
    </Suspense>
  );
}

function UserProfile({ userId }) {
  const user = use(fetchUser(userId)); // 使用新的 use Hook
  return <div>{user.name}</div>;
}
\`\`\`

### 嵌套 Suspense

React 18 支持嵌套的 Suspense 边界，允许更细粒度的加载状态控制：

\`\`\`jsx
<Suspense fallback={<PageSkeleton />}>
  <Header />
  <Suspense fallback={<ContentSkeleton />}>
    <MainContent />
  </Suspense>
  <Footer />
</Suspense>
\`\`\`

## 实际应用场景

### 1. 数据获取优化

使用 Suspense 和并发特性，我们可以实现更优雅的数据获取模式：

\`\`\`jsx
function ProductList() {
  const products = use(fetchProducts());
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
\`\`\`

### 2. 渐进式加载

通过 Suspense 的嵌套使用，可以实现页面的渐进式加载：

\`\`\`jsx
<Suspense fallback={<HeaderSkeleton />}>
  <Header />
  <Suspense fallback={<SidebarSkeleton />}>
    <Sidebar />
    <Suspense fallback={<ContentSkeleton />}>
      <MainContent />
    </Suspense>
  </Suspense>
</Suspense>
\`\`\`

## 性能优化建议

1. **合理设置 Suspense 边界**：不要过度嵌套，也不要设置得太粗糙
2. **使用 startTransition**：对于非紧急的更新，使用 startTransition 来标记
3. **优化 fallback 组件**：确保 fallback 组件轻量且有意义

## 总结

React 18 的并发特性为我们提供了强大的工具来构建更好的用户体验。通过合理使用 Suspense 和并发渲染，我们可以创建响应更快、体验更流畅的应用程序。

这些特性的引入标志着 React 生态系统的一个重要里程碑，值得每个 React 开发者深入学习和实践。
  `,
  likes: 128,
  bookmarks: 45,
  comments: 23,
}

export async function mockArticle() {

  await new Promise(resolve => setTimeout(resolve, 100)); 

  return article
}