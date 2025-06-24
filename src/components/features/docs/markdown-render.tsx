import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import { useEffect } from 'react';
// import '/atom-one-dark.css'
// import 'highlight.js/styles/gradient-dark.css';
// import 'highlight.js/styles/gradient-light.css';
import 'highlight.js/styles/tokyo-night-dark.css'
import { useThemeStore, themes } from '@/zustand/themeStore';
import { useTheme } from "next-themes"
type MarkdownRenderProps = {
  content?: string;
  html?: string;
  className?: string;
};

export default function MarkdownRender({ content, html, className }: MarkdownRenderProps) {
  const { colorTheme, setColorTheme } = useThemeStore();
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
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
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
          code: ({ node, className: language, children, ...props }) => {
            const base = 'font-mono rounded px-5 py-4';

            return (
              <pre className="overflow-x-auto my-4 rounded bg-muted text-sm border border-theme-accent">
                <code {...props} className={`${base} block text-left`}>
                  {children}
                </code>
              </pre>
            );
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
          img: ({ node, ...props }) => (
            <img
              {...props}
              className="rounded-lg mx-auto my-4 max-h-[400px] shadow-md"
              alt={props.alt || ''}
            />
          ),
          hr: () => <hr className="my-8 border-t border-border-color" />,
        }
        }
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}