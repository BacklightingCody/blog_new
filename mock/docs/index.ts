import { Article } from "./types"
import { programmingArticles } from "./programming"
import { recipeArticles } from "./recipe"
import { aiArticles } from "./ai"
import { allArticles } from './articles'
export type { Article }

export const getAllArticles = (): Article[] => {
  return [...programmingArticles, ...recipeArticles, ...aiArticles,...allArticles]
}

export const getArticlesByCategory = (category: string): Article[] => {
  switch (category) {
    case "programming":
      return programmingArticles
    case "recipe":
      return recipeArticles
    case "ai":
      return aiArticles
    default:
      return allArticles
  }
} 