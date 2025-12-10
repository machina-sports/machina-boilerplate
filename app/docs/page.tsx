import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { getReadmeContent } from '@/lib/readme';
import DocsClient from './docs-client';
import { CodeBlock } from '@/components/ui/code-block';

import Link from 'next/link';

async function DocsPage() {
  const readmeContent = getReadmeContent();

  return (
    <main className="flex min-h-screen flex-col items-start justify-start gap-8 bg-zinc-50 dark:bg-zinc-950">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
              <Image
                  src="/logo-grey.webp"
                  alt="Machina Sports logo"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-8 w-auto md:h-10"
                />
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Documentation</h1>
            </div>
            <DocsClient />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 w-full">
        <article className="prose prose-zinc dark:prose-invert max-w-none pb-20 docs-markdown">
          <ReactMarkdown
            components={{
              // Headings
              h1: ({children}) => (
                <h1 className="text-4xl font-extrabold mt-12 mb-6 text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {children}
                </h1>
              ),
              h2: ({children}) => (
                <h2 className="text-3xl font-bold mt-10 mb-5 text-zinc-900 dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                  {children}
                </h2>
              ),
              h3: ({children}) => (
                <h3 className="text-2xl font-bold mt-8 mb-4 text-zinc-900 dark:text-zinc-100">
                  {children}
                </h3>
              ),
              h4: ({children}) => (
                <h4 className="text-xl font-semibold mt-6 mb-3 text-zinc-900 dark:text-zinc-200">
                  {children}
                </h4>
              ),
              
              // Paragraphs and text
              p: ({children}) => (
                <p className="text-base leading-7 mb-5 text-zinc-600 dark:text-zinc-300">
                  {children}
                </p>
              ),
              
              // Lists
              ul: ({children}) => (
                <ul className="list-disc list-inside mb-6 space-y-2 text-zinc-600 dark:text-zinc-300 ml-4">
                  {children}
                </ul>
              ),
              ol: ({children}) => (
                <ol className="list-decimal list-inside mb-6 space-y-2 text-zinc-600 dark:text-zinc-300 ml-4 [&>li>p:first-child]:inline [&>li>p:first-child]:mb-0">
                  {children}
                </ol>
              ),
              li: ({children}) => (
                <li className="pl-1 text-zinc-600 dark:text-zinc-300">
                  {children}
                </li>
              ),
              
              // Code blocks - Handled via code component + pre override
              pre: ({children}) => <>{children}</>,
              code: ({className, children, ...props}: any) => {
                const isInline = !className && !String(children).includes('\n');
                
                if (isInline) {
                  return (
                    <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md text-sm font-mono text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/50" {...props}>
                      {children}
                    </code>
                  );
                }

                return (
                  <CodeBlock className={className}>
                    {children}
                  </CodeBlock>
                );
              },
              
              // Links
              a: ({href, children}) => (
                <a
                  href={href}
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-4 decoration-blue-300 dark:decoration-blue-700/50 hover:decoration-blue-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              
              // Blockquotes
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-6 italic text-zinc-700 dark:text-zinc-300 bg-blue-50/50 dark:bg-blue-900/10 rounded-r-lg">
                  {children}
                </blockquote>
              ),
              
              // Tables
              table: ({children}) => (
                <div className="overflow-x-auto my-8 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <table className="w-full border-collapse text-left text-sm">
                    {children}
                  </table>
                </div>
              ),
              thead: ({children}) => (
                <thead className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                  {children}
                </thead>
              ),
              tbody: ({children}) => (
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
                  {children}
                </tbody>
              ),
              tr: ({children}) => (
                <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  {children}
                </tr>
              ),
              td: ({children}) => (
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                  {children}
                </td>
              ),
              th: ({children}) => (
                <th className="px-6 py-3 font-semibold text-zinc-900 dark:text-zinc-100">
                  {children}
                </th>
              ),
              
              // Horizontal rule
              hr: () => (
                <hr className="my-10 border-t border-zinc-200 dark:border-zinc-800" />
              ),
            }}
          >
            {readmeContent}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}

export default DocsPage;
