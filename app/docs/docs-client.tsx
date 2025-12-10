'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function DocsClient() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const gitCloneCommand = 'git clone git@github.com:machina-sports/machina-frontend-boilerplate.git';
    navigator.clipboard.writeText(gitCloneCommand).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        copied
          ? 'bg-green-500 dark:bg-green-600 text-white'
          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-300 dark:hover:bg-zinc-700'
      }`}
    >
      {copied ? (
        <>
          <Check size={14} />
          Copied!
        </>
      ) : (
        <>
          <Copy size={14} />
          Clone Repo
        </>
      )}
    </button>
  );
}

