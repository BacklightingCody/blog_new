'use client'

import { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { Copy, Check, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

interface CodeBlockProps {
  children: string
  className?: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
}

export function CodeBlock({
  children,
  className = '',
  language = 'text',
  filename,
  showLineNumbers = true,
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const { theme } = useTheme()

  // 从className中提取语言信息
  const match = /language-(\w+)/.exec(className || '')
  const lang = match ? match[1] : language

  // 选择主题
  const codeTheme = theme === 'dark' ? themes.vsDark : themes.vsLight

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(children.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const downloadCode = () => {
    const blob = new Blob([children.trim()], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename || `code.${lang}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="relative group my-6">
      {/* 文件名和工具栏 */}
      {(filename || true) && (
        <div className="flex items-center justify-between bg-muted/50 border border-border rounded-t-lg px-4 py-2">
          <div className="flex items-center gap-2">
            {filename && (
              <span className="text-sm font-mono text-muted-foreground">
                {filename}
              </span>
            )}
            <span className="text-xs bg-theme-primary/10 text-theme-primary px-2 py-1 rounded">
              {lang}
            </span>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            
            {filename && (
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadCode}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 代码内容 */}
      <div className="relative">
        <Highlight
          theme={codeTheme}
          code={children.trim()}
          language={lang as any}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} overflow-x-auto p-4 text-sm leading-relaxed ${
                filename ? 'rounded-t-none' : 'rounded-lg'
              } border border-border`}
              style={style}
            >
              {tokens.map((line, i) => {
                const lineNumber = i + 1
                const isHighlighted = highlightLines.includes(lineNumber)
                
                return (
                  <div
                    key={i}
                    {...getLineProps({ line, key: i })}
                    className={`${
                      isHighlighted ? 'bg-yellow-500/10 border-l-2 border-yellow-500 pl-2' : ''
                    } ${showLineNumbers ? 'table-row' : ''}`}
                  >
                    {showLineNumbers && (
                      <span className="table-cell pr-4 text-right select-none text-muted-foreground/60 font-mono text-xs">
                        {lineNumber}
                      </span>
                    )}
                    <span className={showLineNumbers ? 'table-cell' : ''}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </span>
                  </div>
                )
              })}
            </pre>
          )}
        </Highlight>
      </div>
    </div>
  )
}

// 内联代码组件
export function InlineCode({ children, className }: { children: string; className?: string }) {
  return (
    <code className={`bg-muted px-1.5 py-0.5 rounded text-sm font-mono ${className || ''}`}>
      {children}
    </code>
  )
}

// 支持的语言列表
export const supportedLanguages = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'java',
  'c',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'go',
  'rust',
  'swift',
  'kotlin',
  'scala',
  'html',
  'css',
  'scss',
  'sass',
  'less',
  'json',
  'xml',
  'yaml',
  'toml',
  'ini',
  'sql',
  'bash',
  'shell',
  'powershell',
  'dockerfile',
  'makefile',
  'markdown',
  'latex',
  'graphql',
  'prisma',
  'solidity',
] as const

export type SupportedLanguage = typeof supportedLanguages[number]
