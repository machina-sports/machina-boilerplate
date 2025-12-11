'use client';

import { useState, ReactNode } from 'react';
import { Monitor, Server, Zap, MousePointer, Database, Globe } from 'lucide-react';

export function ClientServerVisual() {
  const [isClient, setIsClient] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex items-center gap-4 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
        <button
          onClick={() => setIsClient(false)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
            !isClient
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'
          }`}
        >
          Server Component
        </button>
        <button
          onClick={() => setIsClient(true)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
            isClient
              ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'
          }`}
        >
          Client Component
        </button>
      </div>

      <div className="group relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-lg border border-zinc-200 bg-white p-6 shadow-xl transition-all duration-500 dark:border-zinc-800 dark:bg-zinc-900">
        {/* 'use client' Directive Animation */}
        <div
          className={`absolute top-4 left-6 transform rounded border border-yellow-200 bg-yellow-100 px-3 py-1 font-mono text-xs text-yellow-700 transition-all duration-500 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 ${isClient ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
        >
          &apos;use client&apos;;
        </div>

        <div
          className={`mt-10 space-y-3 transition-all duration-300 ${isClient ? 'pt-8' : 'pt-0'}`}
        >
          <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>

        {/* Features Overlay */}
        <div className="absolute right-0 bottom-0 left-0 border-t border-zinc-200 bg-zinc-50/90 p-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/90">
          <p className="mb-3 text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
            {isClient ? 'Available Features' : 'Optimized For'}
          </p>

          <div className="grid grid-cols-2 gap-2">
            {isClient ? (
              <>
                <FeatureItem icon={<Zap size={14} />} text="useState / Effects" />
                <FeatureItem icon={<MousePointer size={14} />} text="Browser Events" />
                <FeatureItem icon={<Database size={14} />} text="Local Storage" />
                <FeatureItem icon={<Globe size={14} />} text="Window / Document" />
              </>
            ) : (
              <>
                <FeatureItem icon={<Server size={14} />} text="Data Fetching" />
                <FeatureItem icon={<Monitor size={14} />} text="Static HTML" />
                <FeatureItem icon={<Zap size={14} />} text="Zero Bundle Size" />
              </>
            )}
          </div>
        </div>
      </div>

      <p className="max-w-xs text-center text-sm text-zinc-500">
        {isClient
          ? "Add 'use client' at the top when you need interactivity or browser APIs."
          : 'Default to Server Components for performance and SEO.'}
      </p>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
      <span className="text-zinc-400">{icon}</span>
      {text}
    </div>
  );
}
