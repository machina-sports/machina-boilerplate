'use client';

import { useState } from 'react';
import { Layers, FileCode, ArrowDown } from 'lucide-react';

export function ComponentStructureVisual() {
  const [isRefactored, setIsRefactored] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <button
        onClick={() => setIsRefactored(!isRefactored)}
        className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
      >
        <Layers size={16} />
        {isRefactored ? 'Merge into Monolith' : 'Refactor & Split'}
      </button>

      <div className="relative flex h-64 w-full max-w-md items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-950/30">
        {/* Monolith State */}
        <div
          className={`absolute transition-all duration-700 ease-in-out ${isRefactored ? 'pointer-events-none scale-90 opacity-0' : 'scale-100 opacity-100'}`}
        >
          <div className="flex h-56 w-48 flex-col items-center justify-center gap-2 rounded-lg border-2 border-red-200 bg-white p-4 shadow-sm dark:border-red-900/50 dark:bg-zinc-900">
            <FileCode size={32} className="text-red-400" />
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              LargePage.tsx
            </span>
            <div className="mt-2 w-full space-y-1 opacity-50">
              <div className="h-1.5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-1.5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-1.5 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-1.5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-1.5 w-full rounded bg-red-100 dark:bg-red-900/30" />
              <div className="h-1.5 w-full rounded bg-red-100 dark:bg-red-900/30" />
              <div className="h-1.5 w-full rounded bg-red-100 dark:bg-red-900/30" />
            </div>
            <span className="mt-1 text-[10px] font-medium text-red-500">Too Complex!</span>
          </div>
        </div>

        {/* Refactored State */}
        <div
          className={`absolute h-full w-full transition-all duration-700 ease-in-out ${!isRefactored ? 'pointer-events-none scale-110 opacity-0' : 'scale-100 opacity-100'}`}
        >
          <div className="relative flex h-full w-full flex-col items-center justify-between">
            {/* Parent */}
            <div className="z-10 flex h-20 w-32 flex-col items-center justify-center rounded-lg border-2 border-green-200 bg-white shadow-sm dark:border-green-900/50 dark:bg-zinc-900">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Page.tsx
              </span>
            </div>

            {/* Arrows */}
            <div className="absolute top-20 flex w-full justify-center gap-12 text-zinc-300 dark:text-zinc-700">
              <ArrowDown size={24} className="-rotate-12" />
              <ArrowDown size={24} className="translate-y-2 rotate-0" />
              <ArrowDown size={24} className="rotate-12" />
            </div>

            {/* Children */}
            <div className="flex items-end gap-4 pb-2">
              <ChildBlock name="Header" />
              <ChildBlock name="List" />
              <ChildBlock name="Footer" />
            </div>
          </div>
        </div>
      </div>

      <p className="max-w-sm text-center text-sm text-zinc-500">
        {isRefactored
          ? 'Better! Separate logic into focused, reusable components.'
          : 'Avoid large files. If you see repetition or complexity, break it down.'}
      </p>
    </div>
  );
}

function ChildBlock({ name }: { name: string }) {
  return (
    <div className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-lg border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <FileCode size={16} className="text-green-500" />
      <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{name}.tsx</span>
    </div>
  );
}
