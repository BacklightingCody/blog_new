import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
// import '/atom-one-dark.css'
import 'highlight.js/styles/gradient-dark.css';
// import 'highlight.js/styles/gradient-light.css';
// import 'highlight.js/styles/tokyo-night-dark.css'

type MarkdownRenderProps = {
  content?: string;
  html?: string;
  className?: string;
};

export default function MarkdownRender({ content, html, className }: MarkdownRenderProps) {
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
    <article className={`prose prose-lg max-w-none ${className ?? ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, [remarkToc, { heading: '目录', maxDepth: 3 }]]}
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
        components={{
          img: ({ node, ...props }) => (
            <img
              {...props}
              className="rounded-lg mx-auto my-4 max-h-[400px]"
              alt={props.alt || ''}
            />
          ),
          h1: ({ node, ...props }) => (
            <h1 {...props} className="text-theme-primary mt-8 mb-4 text-3xl font-bold" />
          ),
          h2: ({ node, ...props }) => (
            <h2 {...props} className="text-theme-primary mt-6 mb-3 text-2xl font-semibold" />
          ),
          h3: ({ node, ...props }) => (
            <h2 {...props} className="text-theme-primary mt-6 mb-3 text-2xl font-semibold" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}