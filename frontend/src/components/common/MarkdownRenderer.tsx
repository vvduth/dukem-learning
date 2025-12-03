/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }: {
    content: string;
}) => {
  return (
    <div className='prose max-w-none'>
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold my-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold my-4" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-bold my-3" {...props} />,
                h4: ({ node, ...props }) => <h4 className="text-lg font-bold my-2" {...props} />,
                p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
                a: ({ node, ...props }) => <a className="text-violet-600 underline hover:text-violet-800" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc ml-6 my-2" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal ml-6 my-2" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                em: ({ node, ...props }) => <em className="italic" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600" {...props} />,
                code: ({ node, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    return !isInline && match ? (
                        <SyntaxHighlighter
                            style={dracula}
                            language={match[1]}
                            PreTag="div"
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code className='bg-neutral-100 p-1 rounded font-mono text-sm' {...props}>
                            {children}
                        </code>
                    )
                },
                pre: ({ node, ...props }) => <pre className="bg-neutral-800 text-white p-3
                rounded-md overflow-x-auto font-mono text-sm my-4" {...props} />,
            }}
        >
        {content}
        </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer