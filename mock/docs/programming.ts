import { Article } from "./types"
import { generateId } from "../utils"

export const programmingArticles: Article[] = [
  {
    id: generateId(),
    title: "虚拟列表中的选区操作",
    date: "2024-04-15",
    category: "programming",
    slug: "virtual-list-selection",
    tags: ["react", "typescript"],
    views: 225,
    likes: 4,
    comments: 0,
  },
  {
    id: generateId(),
    title: "超级组合！NestJS + tRPC 与CSR绝佳搭档React Query",
    date: "2023-09-25",
    category: "programming",
    slug: "nestjs-trpc-react-query",
    tags: ["nestjs", "trpc"],
    views: 711,
    likes: 7,
    comments: 4,
  },
  {
    id: generateId(),
    title: "一个更好用的Bump Version",
    date: "2023-01-05",
    category: "programming",
    slug: "better-bump-version",
    tags: ["nodejs", "npm"],
    views: 432,
    likes: 5,
    comments: 2,
  }
] 