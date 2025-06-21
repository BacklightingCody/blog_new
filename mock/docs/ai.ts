import { Article } from "./types"
import { generateId } from "../utils"

export const aiArticles: Article[] = [
  {
    id: generateId(),
    title: "ChatGPT API 使用指南",
    date: "2024-04-12",
    category: "ai",
    slug: "chatgpt-api-guide",
    tags: ["chatgpt", "api"],
    views: 567,
    likes: 15,
    comments: 8,
  },
  {
    id: generateId(),
    title: "Stable Diffusion 本地部署教程",
    date: "2024-03-28",
    category: "ai",
    slug: "stable-diffusion-local",
    tags: ["stable-diffusion", "ai绘画"],
    views: 432,
    likes: 9,
    comments: 4,
  },
  {
    id: generateId(),
    title: "AI 辅助编程实践",
    date: "2024-03-20",
    category: "ai",
    slug: "ai-assisted-programming",
    tags: ["copilot", "编程"],
    views: 389,
    likes: 11,
    comments: 6,
  }
] 