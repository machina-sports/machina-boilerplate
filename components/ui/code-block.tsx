'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(getTextContent).join('');
    if (typeof node === 'object' && node !== null && 'props' in node) {
      return getTextContent((node as any).props.children);
    }
    return '';
  };

  const textContent = getTextContent(children);
  const language = className?.replace(/language-/, '') || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(textContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="relative group rounded-lg overflow-hidden my-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <span className="text-xs font-mono text-zinc-400 uppercase">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-100"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      
      <div className="p-4 overflow-x-auto bg-zinc-950">
        <pre className="m-0 p-0 bg-transparent font-inherit">
          <code className={`text-sm font-mono text-zinc-50 ${className || ''}`}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
}

