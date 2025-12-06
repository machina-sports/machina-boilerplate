'use client';

import { useState, ReactNode } from 'react';
import { Monitor, Server, Zap, MousePointer, Database, Globe } from 'lucide-react';

export function ClientServerVisual() {
  const [isClient, setIsClient] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
        <button
          onClick={() => setIsClient(false)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            !isClient 
              ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'
          }`}
        >
          Server Component
        </button>
        <button
          onClick={() => setIsClient(true)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            isClient 
              ? 'bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'
          }`}
        >
          Client Component
        </button>
      </div>

      <div className="relative w-full max-w-sm aspect-[4/5] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl p-6 transition-all duration-500 overflow-hidden group">
        
        {/* 'use client' Directive Animation */}
        <div className={`absolute top-4 left-6 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-mono text-xs rounded border border-yellow-200 dark:border-yellow-800 transition-all duration-500 transform ${isClient ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          'use client';
        </div>

        <div className={`mt-10 space-y-3 transition-all duration-300 ${isClient ? 'pt-8' : 'pt-0'}`}>
           <div className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
           <div className="h-4 w-1/2 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
           <div className="h-4 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
        </div>

        {/* Features Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-sm p-4 border-t border-zinc-200 dark:border-zinc-800">
           <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-3 uppercase tracking-wider">
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
      
      <p className="text-center text-sm text-zinc-500 max-w-xs">
        {isClient 
          ? "Add 'use client' at the top when you need interactivity or browser APIs." 
          : "Default to Server Components for performance and SEO."}
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
