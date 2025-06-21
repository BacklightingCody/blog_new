import { generateId } from "../utils"

export const initialComments = [
  {
    id: generateId(),
    author: "李四",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "非常详细的文章！对 React 18 的并发特性解释得很清楚，特别是 Suspense 的部分。",
    time: "2小时前",
    likes: 12,
  },
  {
    id: generateId(),
    author: "王五",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "代码示例很实用，已经在项目中尝试使用了。有个问题：在使用嵌套 Suspense 时，如何处理错误边界？",
    time: "4小时前",
    likes: 8,
  },
  {
    id: generateId(),
    author: "赵六",
    avatar: "/placeholder.svg?height=32&width=32",
    content: "期待更多关于 React 18 新特性的文章！",
    time: "1天前",
    likes: 5,
  },
]