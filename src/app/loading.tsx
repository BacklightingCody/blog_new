"use client"

import Cube3DLoading, { getRandomVariant } from "@/components/features/GlobalLoading"

export default function Loading() {
  const variant = getRandomVariant()
  const size = "md"
  const text = "页面加载中，请稍候..."

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center">
      <Cube3DLoading variant={variant} size={size} text={text} />
    </div>
  )
}
