'use client';

import { useState } from 'react';
import { Layers, FileCode, ArrowDown } from 'lucide-react';

export function ComponentStructureVisual() {
  const [isRefactored, setIsRefactored] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <button
        onClick={() => setIsRefactored(!isRefactored)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
      >
        <Layers size={16} />
        {isRefactored ? 'Merge into Monolith' : 'Refactor & Split'}
      </button>

      <div className="relative w-full max-w-md h-64 bg-zinc-50 dark:bg-zinc-950/30 rounded-lg border border-zinc-200 dark:border-zinc-800 p-8 flex items-center justify-center">
        
        {/* Monolith State */}
        <div className={`absolute transition-all duration-700 ease-in-out ${isRefactored ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="w-48 h-56 bg-white dark:bg-zinc-900 border-2 border-red-200 dark:border-red-900/50 rounded-lg shadow-sm flex flex-col items-center justify-center gap-2 p-4">
            <FileCode size={32} className="text-red-400" />
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">LargePage.tsx</span>
            <div className="space-y-1 w-full mt-2 opacity-50">
              <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-1.5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
              <div className="h-1.5 w-full bg-red-100 dark:bg-red-900/30 rounded" />
              <div className="h-1.5 w-full bg-red-100 dark:bg-red-900/30 rounded" />
              <div className="h-1.5 w-full bg-red-100 dark:bg-red-900/30 rounded" />
            </div>
            <span className="text-[10px] text-red-500 font-medium mt-1">Too Complex!</span>
          </div>
        </div>

        {/* Refactored State */}
        <div className={`absolute w-full h-full transition-all duration-700 ease-in-out ${!isRefactored ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>
          <div className="relative w-full h-full flex flex-col items-center justify-between">
            {/* Parent */}
            <div className="w-32 h-20 bg-white dark:bg-zinc-900 border-2 border-green-200 dark:border-green-900/50 rounded-lg shadow-sm flex flex-col items-center justify-center z-10">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Page.tsx</span>
            </div>

            {/* Arrows */}
            <div className="absolute top-20 w-full flex justify-center gap-12 text-zinc-300 dark:text-zinc-700">
               <ArrowDown size={24} className="-rotate-12" />
               <ArrowDown size={24} className="rotate-0 translate-y-2" />
               <ArrowDown size={24} className="rotate-12" />
            </div>

            {/* Children */}
            <div className="flex gap-4 items-end pb-2">
               <ChildBlock name="Header" />
               <ChildBlock name="List" />
               <ChildBlock name="Footer" />
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-zinc-500 max-w-sm">
        {isRefactored 
          ? "Better! Separate logic into focused, reusable components." 
          : "Avoid large files. If you see repetition or complexity, break it down."}
      </p>
    </div>
  );
}

function ChildBlock({ name }: { name: string }) {
  return (
    <div className="w-24 h-24 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm flex flex-col items-center justify-center gap-1 p-2">
      <FileCode size={16} className="text-green-500" />
      <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{name}.tsx</span>
    </div>
  );
}

