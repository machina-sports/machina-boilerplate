'use client';

import { useState } from 'react';
import { Globe, Server, Database, ShieldCheck, ShieldAlert, Lock, Key, ArrowRight } from 'lucide-react';

export function ArchitectureVisual() {
  const [isSecure, setIsSecure] = useState(true);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Toggle */}
      <div className="flex items-center gap-4 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
        <button
          onClick={() => setIsSecure(false)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            !isSecure 
              ? 'bg-white dark:bg-zinc-950 text-red-600 dark:text-red-400 shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'
          }`}
        >
          Direct Call (Unsafe)
        </button>
        <button
          onClick={() => setIsSecure(true)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            isSecure 
              ? 'bg-white dark:bg-zinc-950 text-green-600 dark:text-green-400 shadow-sm' 
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'
          }`}
        >
          Proxy Pattern (Secure)
        </button>
      </div>

      {/* Diagram Container */}
      <div className="relative w-full max-w-lg aspect-[16/9] bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 flex items-center justify-between overflow-hidden">
        
        {/* Client Side */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-16 h-16 bg-white dark:bg-zinc-900 border-2 border-blue-200 dark:border-blue-900 rounded-lg shadow-sm flex items-center justify-center">
            <Globe className="text-blue-500" size={32} />
          </div>
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Client (Browser)</span>
        </div>

        {/* Middle Ground (Next.js API) - Only visible in Secure mode */}
        <div className={`flex flex-col items-center gap-2 z-10 transition-all duration-500 ${isSecure ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 absolute left-1/2 -translate-x-1/2'}`}>
          <div className="w-16 h-16 bg-white dark:bg-zinc-900 border-2 border-indigo-200 dark:border-indigo-900 rounded-lg shadow-sm flex items-center justify-center">
            <Server className="text-indigo-500" size={32} />
          </div>
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Next.js API Route</span>
        </div>

        {/* External API */}
        <div className="flex flex-col items-center gap-2 z-10">
          <div className="w-16 h-16 bg-white dark:bg-zinc-900 border-2 border-amber-200 dark:border-amber-900 rounded-lg shadow-sm flex items-center justify-center">
            <Database className="text-amber-500" size={32} />
          </div>
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">External API</span>
        </div>

        {/* Animations & Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Unsafe Path */}
          {!isSecure && (
            <path 
              d="M 80 80 Q 250 20 420 80" 
              fill="none" 
              stroke="#ef4444" 
              strokeWidth="3" 
              strokeDasharray="6 4"
              className="animate-pulse"
            />
          )}
          
          {/* Secure Path - Left */}
          {isSecure && (
             <line x1="80" y1="80" x2="250" y2="80" stroke="#3b82f6" strokeWidth="3" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" />
          )}
          
          {/* Secure Path - Right */}
          {isSecure && (
             <line x1="250" y1="80" x2="420" y2="80" stroke="#22c55e" strokeWidth="3" />
          )}
        </svg>

        {/* Exposed Key Animation (Unsafe Mode) */}
        {!isSecure && (
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce">
            <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-2 rounded-full border border-red-200 dark:border-red-800">
               <Key size={20} />
            </div>
            <span className="text-[10px] font-bold text-red-500 mt-1 bg-white dark:bg-zinc-950 px-1 rounded shadow-sm border border-red-100">API_KEY Exposed!</span>
          </div>
        )}

        {/* Secured Key (Secure Mode) */}
        {isSecure && (
          <div className="absolute top-[60%] left-[68%] -translate-x-1/2 flex flex-col items-center">
             <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-1.5 rounded-full border border-green-200 dark:border-green-800 flex items-center gap-1 shadow-sm">
               <Key size={12} />
               <Lock size={12} />
             </div>
             <span className="text-[10px] font-bold text-green-600 dark:text-green-500 mt-1">Safe on Server</span>
          </div>
        )}

      </div>

      <p className="text-center text-sm text-zinc-500 max-w-sm">
        {isSecure 
          ? "The Browser calls your Next.js API. The Server holds the keys and calls the External API securely." 
          : "Direct calls from Browser to External API require exposing keys. Never do this."}
      </p>

      {/* Code Snippet Preview */}
      <div className="w-full bg-zinc-900 rounded-lg p-3 overflow-hidden text-xs font-mono text-zinc-300 border border-zinc-800">
        <div className="flex items-center gap-2 mb-2 border-b border-zinc-800 pb-2">
           <div className="w-2 h-2 rounded-full bg-red-500" />
           <div className="w-2 h-2 rounded-full bg-yellow-500" />
           <div className="w-2 h-2 rounded-full bg-green-500" />
           <span className="text-zinc-500 ml-2">{isSecure ? 'app/api/route.ts' : 'app/components/Client.tsx'}</span>
        </div>
        {isSecure ? (
          <>
            <span className="text-purple-400">export async function</span> <span className="text-blue-400">GET</span>() {'{'}<br/>
            &nbsp;&nbsp;<span className="text-zinc-500">// ✅ Safe: Environment variable on server</span><br/>
            &nbsp;&nbsp;<span className="text-purple-400">const</span> key = process.env.<span className="text-orange-400">API_SECRET</span>;<br/>
            &nbsp;&nbsp;<span className="text-purple-400">return</span> fetch(..., {'{'} headers: {'{'} Authorization: key {'}'} {'}'});<br/>
            {'}'}
          </>
        ) : (
          <>
            <span className="text-purple-400">const</span> <span className="text-blue-400">fetchData</span> = () ={'>'} {'{'}<br/>
            &nbsp;&nbsp;<span className="text-zinc-500">// ❌ DANGER: Key exposed to browser user</span><br/>
            &nbsp;&nbsp;<span className="text-purple-400">const</span> key = <span className="text-red-400">"sk_live_12345"</span>;<br/>
            &nbsp;&nbsp;<span className="text-purple-400">return</span> axios.get(..., {'{'} headers: {'{'} Authorization: key {'}'} {'}'});<br/>
            {'}'}
          </>
        )}
      </div>
    </div>
  );
}

