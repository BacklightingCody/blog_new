"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useClientSide } from "@/hooks/useClientSide"

export default function TimeStats() {
  const isClient = useClientSide();
  const [stats, setStats] = useState({
    dayOfYear: 0,
    yearPercentage: 0,
    dayPercentage: 0,
  })

  // 假设文章数量，实际应用中可以从API获取
  const articleCount = 10

  useEffect(() => {
    if (!isClient) return;

    const calculateStats = () => {
      const now = new Date()
      const startOfYear = new Date(now.getFullYear(), 0, 0)
      const diff = now.getTime() - startOfYear.getTime()
      const oneDay = 1000 * 60 * 60 * 24
      const dayOfYear = Math.floor(diff / oneDay)

      // 计算年份百分比
      const daysInYear = (new Date(now.getFullYear(), 11, 31).getTime() - startOfYear.getTime()) / oneDay
      const yearPercentage = (dayOfYear / daysInYear) * 100

      // 计算今天已过百分比
      const hours = now.getHours()
      const minutes = now.getMinutes()
      const seconds = now.getSeconds()
      const totalSeconds = hours * 3600 + minutes * 60 + seconds
      const dayPercentage = (totalSeconds / 86400) * 100

      setStats({
        dayOfYear,
        yearPercentage,
        dayPercentage,
      })
    }

    calculateStats()
    const interval = setInterval(calculateStats, 1000)
    return () => clearInterval(interval)
  }, [isClient])

  return (
    <Card className='bg-theme-secondery/10 border-0'>
      <CardContent className="p-6">
        {/* <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">文章列表</h2>
          <Badge variant="outline" className="text-xl text-theme-primary">
            {articleCount} 篇文章
          </Badge>
        </div> */}
        <div className="flex justify-around">
          <StatItem label="今天是 2025 年的第" value={stats.dayOfYear} suffix="天" />
          <StatItem label="今年已过" value={stats.yearPercentage} suffix="%" decimals={6} />
          <StatItem label="今天已过" value={stats.dayPercentage} suffix="%" decimals={6} />
          <StatItem label="文章数" value={10} suffix='篇' />
        </div>
      </CardContent>
    </Card>
  )
}

function StatItem({
  label,
  value,
  suffix = "",
  decimals = 0,
}: {
  label: string
  value: number
  suffix?: string
  decimals?: number
}) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground mb-1">{label}</span>
      <div className="flex items-baseline">
        <motion.span
          className="text-2xl font-bold text-theme-primary"
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {decimals > 0 ? value.toFixed(decimals) : value}
        </motion.span>
        <span className="ml-1 text-lg">{suffix}</span>
      </div>
    </div>
  )
}
