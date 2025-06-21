import { Article } from "./types"
import { generateId } from "../utils"

export const recipeArticles: Article[] = [
  {
    id: generateId(),
    title: "家常红烧肉的做法",
    date: "2024-04-10",
    category: "recipe",
    slug: "braised-pork",
    tags: ["中餐", "肉类"],
    views: 156,
    likes: 8,
    comments: 3,
  },
  {
    id: generateId(),
    title: "完美蒸蛋的秘诀",
    date: "2024-03-25",
    category: "recipe",
    slug: "perfect-steamed-egg",
    tags: ["中餐", "蛋类"],
    views: 289,
    likes: 12,
    comments: 5,
  },
  {
    id: generateId(),
    title: "自制意大利面的技巧",
    date: "2024-03-15",
    category: "recipe",
    slug: "homemade-pasta",
    tags: ["西餐", "面食"],
    views: 198,
    likes: 6,
    comments: 2,
  }
] 