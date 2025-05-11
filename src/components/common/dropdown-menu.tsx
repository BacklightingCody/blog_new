"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { createPortal } from "react-dom"
import { Slot } from "@radix-ui/react-slot"

interface DropdownMenuProps {
  children: React.ReactNode
  className?: string
}

interface DropdownMenuTriggerProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

interface DropdownMenuContentProps {
  children: React.ReactNode
  className?: string
  align?: "start" | "center" | "end"
}

interface DropdownMenuGroupProps {
  children: React.ReactNode
  className?: string
}

interface DropdownMenuItemProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
  onClick?: () => void
}

const DropdownMenu = ({ children, className }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const triggerRef = React.useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect())
    }
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div 
      ref={triggerRef}
      className={cn("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            return child
          }
          if (child.type === DropdownMenuContent) {
            const contentProps = child.props as DropdownMenuContentProps
            return isOpen ? (
              <DropdownMenuContent
                children={contentProps.children}
                className={contentProps.className}
                align={contentProps.align}
                triggerRect={triggerRect}
              />
            ) : null
          }
        }
        return child
      })}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, className, asChild }: DropdownMenuTriggerProps) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp className={cn("cursor-pointer", className)}>
      {children}
    </Comp>
  )
}

const DropdownMenuContent = ({ children, className, align = "start", triggerRect }: DropdownMenuContentProps & { triggerRect: DOMRect | null }) => {
  if (!triggerRect) return null

  const getPosition = () => {
    const { left, right, width } = triggerRect

    switch (align) {
      case "center":
        return {
          left: left + (width / 2),
          transform: "translateX(-50%)"
        }
      case "end":
        return {
          left: right,
          transform: "translateX(-100%)"
        }
      default: // start
        return {
          left: left
        }
    }
  }

  const position = getPosition()

  const content = (
    <div
      className={cn(
        "fixed z-[9999] min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "animate-in fade-in-80 zoom-in-95",
        className
      )}
      style={{
        top: `${triggerRect.bottom+10}px`,
        ...position
      }}
    >
      {children}
    </div>
  )

  return createPortal(content, document.body)
}

const DropdownMenuGroup = ({ children, className }: DropdownMenuGroupProps) => {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ children, className, asChild, onClick }: DropdownMenuItemProps) => {
  const Comp = asChild ? Slot : "div"
  return (
    <Comp
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "transition-colors hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        className
      )}
      onClick={onClick}
    >
      {children}
    </Comp>
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
}
