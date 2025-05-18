"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

type CategoryContextType = {
  activeCategory: string
  setCategory: (category: string) => void
}

const CategoryContext = createContext<CategoryContextType>({
  activeCategory: "all",
  setCategory: () => {},
})

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "all")

  const setCategory = (category: string) => {
    const params = new URLSearchParams(searchParams)
    if (category === "all") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`${pathname}?${params.toString()}`)
    setActiveCategory(category)
  }

  useEffect(() => {
    setActiveCategory(searchParams.get("category") || "all")
  }, [searchParams])

  return <CategoryContext.Provider value={{ activeCategory, setCategory }}>{children}</CategoryContext.Provider>
}

export const useCategory = () => useContext(CategoryContext)
