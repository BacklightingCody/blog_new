"use client"

import Cube3DLoading, { getRandomVariant } from "@/components/features/GlobalLoading"

export default function NotFound() {
  const variant = getRandomVariant()
  const size = "md"
  const text = "页面未找到"

  return (
    <div className="flex items-center justify-center">
      <Cube3DLoading variant={variant} size={size} text={text} />
    </div>
  )
}
