// src/components/MarkdownRenderer.tsx
'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Customizing elements
          h1: ({ children }) => (
            <h1 className="text-4xl font-black mb-6 text-white border-b border-white/10 pb-4 tracking-tighter uppercase">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">{children}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-black mb-6 mt-12 text-emerald-400 tracking-tight uppercase">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-black mb-4 mt-10 text-purple-400 tracking-tight uppercase">
              {children}
            </h3>
          ),
          code: ({ inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code
                  className="bg-white/10 text-indigo-300 px-2 py-0.5 rounded-lg text-sm font-mono border border-white/5"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-black/40 border border-white/10 rounded-2xl p-6 overflow-x-auto my-8 shadow-2xl backdrop-blur-md">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-8 rounded-2xl border border-white/10 bg-white/[0.02]">
              <table className="min-w-full border-collapse">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-white/5 border-b border-white/10 px-6 py-4 text-left font-black uppercase tracking-widest text-[11px] text-slate-300">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-white/5 px-6 py-4 text-slate-300 text-sm font-medium">
              {children}
            </td>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic my-6 text-gray-400 bg-blue-500/5 py-2 rounded-r-lg">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-400 transition-all"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      <style jsx global>{`
        .markdown-content {
          line-height: 1.8;
          color: #e5e7eb;
        }
        .markdown-content p {
          margin-bottom: 1.5rem;
        }
        .markdown-content ul,
        .markdown-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
          list-style: disc;
        }
        .markdown-content li {
          margin-bottom: 0.75rem;
        }
        .markdown-content hr {
          border-color: #374151;
          margin: 3rem 0;
        }
      `}</style>
    </div>
  );
}
