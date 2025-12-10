'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism';
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
    <div className="relative group rounded-lg overflow-hidden my-4 border border-[#44475a] bg-[#282a36] shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-[#21222c] border-b border-[#44475a]">
        <span className="text-xs font-mono text-[#bd93f9] uppercase tracking-wider">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded hover:bg-[#44475a] transition-colors text-[#6272a4] hover:text-[#8be9fd]"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      
      <div className="overflow-x-auto bg-[#282a36]">
        <SyntaxHighlighter 
          language={language} 
          style={dracula}
          customStyle={{
            margin: 0,
            padding: '1rem',
            background: '#282a36',
          }}
        >
          {textContent}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

