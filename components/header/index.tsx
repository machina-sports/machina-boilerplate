import React from 'react';
import Image from 'next/image';
import { Check, Copy } from 'lucide-react';

interface HeaderProps {
  handleCopy: () => void;
  copied: boolean;
}
const Header = ({ handleCopy, copied }: HeaderProps) => {
  return (
    <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
      <Image
        src="/machina-logo-dark.svg"
        alt="Machina Sports logo"
        width={0}
        height={0}
        sizes="100vw"
        priority
        className="h-12 w-auto md:h-16"
      />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#ff6d00] sm:text-4xl">
          Machina Boilerplate Development Tips
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          Best practices and guidelines for a better development experience.
        </p>

        {/* Git Clone Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              copied
                ? 'bg-green-500 text-white dark:bg-green-600'
                : 'bg-zinc-200 text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700'
            }`}
          >
            {copied ? (
              <>
                <Check size={16} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={16} />
                Copy git clone command
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col items-center gap-2 pt-2">
          <a href="/redux-demo" className="text-sm text-blue-500 hover:underline">
            Check Redux Demo Page
          </a>
          <a href="/docs" className="text-sm text-blue-500 hover:underline">
            Read Full Documentation
          </a>
          <a href="/deploy" className="text-sm text-blue-500 hover:underline">
            Deployment Guide
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
