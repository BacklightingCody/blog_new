"use client"

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'

interface CustomCardContentProps {
  title: string
  description?: string
  date: string
  tags: string[]
}

export function CustomCardContent({ title, description, date, tags }: CustomCardContentProps) {
  return (
    <>
      <CardHeader className="pb-3">

        <div className="flex items-center justify-between gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CardTitle className="text-lg font-semibold leading-tight truncate overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-theme-secondary transition-colors">
                  {title}
                </CardTitle>
              </TooltipTrigger>
              <TooltipContent>
                <p>{title}</p>
              </TooltipContent>
            </ Tooltip>
          </TooltipProvider>

          <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
            <Calendar className="w-3 h-3" />
            {new Date(date).toLocaleDateString("zh-CN", {
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>

        {description && (
          <CardDescription className="text-sm text-muted-foreground line-clamp-2">{description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2 py-0.5 bg-theme-primary/10 hover:bg-theme-accent transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </>
  )
}
