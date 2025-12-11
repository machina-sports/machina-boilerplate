'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function DocsClient() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const gitCloneCommand =
      'git clone git@github.com:machina-sports/machina-frontend-boilerplate.git';
    navigator.clipboard.writeText(gitCloneCommand).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
        copied
          ? 'bg-green-500 text-white dark:bg-green-600'
          : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700'
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
