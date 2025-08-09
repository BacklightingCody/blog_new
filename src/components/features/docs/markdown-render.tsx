import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import { useThemeStore, themes } from '@/zustand/stores/themeStore';
import { useTheme } from "next-themes"
import { CodeBlock, InlineCode } from './code-block';
import { MediaImage, MediaVideo, MediaGif } from './media-content';
type MarkdownRenderProps = {
  content?: string;
  html?: string;
  className?: string;
};

export default function MarkdownRender({ content, html, className }: MarkdownRenderProps) {
  const { theme } = useTheme()
  // 基本样式
  const baseText = 'text-base leading-relaxed text-text';
  const spacingY = 'my-4';

  if (html) {
    return (
      <article
        className={`prose prose-lg max-w-none ${className ?? ''}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  if (!content) {
    return (
      <p className="italic">
        没有可显示的内容。
      </p>
    );
  }

  return (
    <article className={`prose prose-lg ${className ?? ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, [remarkToc, { heading: '目录', maxDepth: 3 }]]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-4xl font-bold text-theme-primary mt-10 mb-6" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-2xl font-semibold text-theme-primary mt-8 mb-4 border-b-[0.5px] border-theme-primary pb-1" />
          ),
          h3: ({ node, ...props }) => (
            <h3 {...props} className="text-xl font-semibold text-theme-primary mt-6 mb-3" />
          ),
          h4: ({ node, ...props }) => (
            <h4 {...props} className="font-medium mt-4 mb-2" />
          ),
          p: ({ node, ...props }) => (
            <p {...props} className={`${baseText} ${spacingY}`} />
          ),
          a: ({ node, ...props }) => (
            <a {...props} className="text-blue-500 hover:underline break-all" rel="noopener noreferrer" />
          ),  
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className="border-l-4 border-theme-primary bg-subtle-bg text-text italic pl-4 pr-2 py-2 my-4 rounded"
            />
          ),
          ul: ({ node, ...props }) => (
            // <ul {...props} className="list-disc pl-6 my-4 space-y-1" />
            <ul 
              {...props} 
              className="list-disc pl-6 my-4 space-y-1 [&_ul]:list-circle [&_ul]:pl-6 [&_ul_ul]:list-[square] [&_ul_ul]:pl-6" 
            />
          ),
          ol: ({ node, ...props }) => (
            // <ol {...props} className="list-decimal pl-6 my-4 space-y-1" />
            <ol
              {...props}
              className="list-decimal pl-6 my-4 space-y-1 [&_ol]:list-[lower-alpha] [&_ol]:pl-6 [&_ol_ol]:list-[lower-roman] [&_ol_ol]:pl-6"
          />
          ),
          li: ({ node, ...props }) => (
            <li {...props} className={`${baseText}`} />
          ),
          code: (rawProps) => {
            const { className, children, inline, ...props } = rawProps as any
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''

            if (inline) {
              return <InlineCode {...(props as any)}>{String(children).replace(/\n$/, '')}</InlineCode>
            }

            return (
              <CodeBlock
                className={className}
                language={language}
                {...(props as any)}
              >
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            )
          },
          table: ({ node, ...props }) => (
            <div className="my-4 text-center">
              <table {...props} className="w-full table-auto border-[2px] border-theme-accent text-sm" />
            </div>
          ),
          thead: ({ node, ...props }) => <thead {...props} className="bg-subtle-bg" />,
          th: ({ node, ...props }) => (
            <th {...props} className="border border-theme-accent px-4 py-2 text-left font-semibold" />
          ),
          td: ({ node, ...props }) => (
            <td {...props} className="border border-theme-accent px-4 py-2" />
          ),
          img: (rawProps) => {
            const { node, src, alt, title, ...props } = rawProps as any
            if (!src) return null

            // 检测文件类型
            const srcStr = String(src)
            const isGif = srcStr.toLowerCase().endsWith('.gif')
            const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(srcStr)

            // 解析标题中的参数 (例如: "图片标题 | width=500 | height=300")
            const parts = (title ? String(title) : '').split('|') || []
            const caption = parts[0]?.trim();
            const params: Record<string, any> = {};

            parts.slice(1).forEach(part => {
              const [key, value] = part.split('=').map(s => s.trim());
              if (key && value) {
                params[key] = isNaN(Number(value)) ? value : Number(value);
              }
            });

            if (isVideo) {
              return (
                <MediaVideo
                  src={srcStr}
                  caption={caption || alt}
                  width={typeof params.width === 'number' ? params.width : undefined}
                  height={typeof params.height === 'number' ? params.height : undefined}
                  autoplay={params.autoplay === 'true'}
                  loop={params.loop === 'true'}
                  muted={params.muted === 'true'}
                  controls={params.controls !== 'false'}
                  {...(props as any)}
                />
              );
            }

            if (isGif) {
              return (
                <MediaGif
                  src={srcStr}
                  alt={alt || ''}
                  caption={caption}
                  width={typeof params.width === 'number' ? params.width : undefined}
                  height={typeof params.height === 'number' ? params.height : undefined}
                  autoplay={params.autoplay !== 'false'}
                  {...(props as any)}
                />
              );
            }

            return (
              <MediaImage
                src={srcStr}
                alt={alt || ''}
                caption={caption}
                width={typeof params.width === 'number' ? params.width : undefined}
                height={typeof params.height === 'number' ? params.height : undefined}
                {...(props as any)}
              />
            );
          },
          hr: () => <hr className="my-8 border-t border-border-color" />,

          // 自定义视频标签支持
          video: (rawProps) => {
            const { node, src, poster, ...props } = rawProps as any
            if (!src) return null

            return (
              <MediaVideo
                src={String(src)}
                poster={poster ? String(poster) : undefined}
                caption={(props as any).title}
                width={typeof (props as any).width === 'number' ? (props as any).width : undefined}
                height={typeof (props as any).height === 'number' ? (props as any).height : undefined}
                autoplay={(props as any).autoPlay}
                loop={(props as any).loop}
                muted={(props as any).muted}
                controls={(props as any).controls !== false}
                {...(props as any)}
              />
            )
          },
        }
        }
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}