'use client';

import { useState } from 'react';
import { Globe, Server, Database, Lock, Key } from 'lucide-react';

export function ArchitectureVisual() {
  const [isSecure, setIsSecure] = useState(true);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Toggle */}
      <div className="flex items-center gap-4 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
        <button
          onClick={() => setIsSecure(false)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
            !isSecure
              ? 'bg-white text-red-600 shadow-sm dark:bg-zinc-950 dark:text-red-400'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'
          }`}
        >
          Direct Call (Unsafe)
        </button>
        <button
          onClick={() => setIsSecure(true)}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
            isSecure
              ? 'bg-white text-green-600 shadow-sm dark:bg-zinc-950 dark:text-green-400'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50'
          }`}
        >
          Proxy Pattern (Secure)
        </button>
      </div>

      {/* Diagram Container */}
      <div className="relative flex aspect-[16/9] w-full max-w-lg items-center justify-between overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/50">
        {/* Client Side */}
        <div className="z-10 flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-blue-200 bg-white shadow-sm dark:border-blue-900 dark:bg-zinc-900">
            <Globe className="text-blue-500" size={32} />
          </div>
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Client (Browser)
          </span>
        </div>

        {/* Middle Ground (Next.js API) - Only visible in Secure mode */}
        <div
          className={`z-10 flex flex-col items-center gap-2 transition-all duration-500 ${isSecure ? 'translate-y-0 opacity-100' : 'absolute left-1/2 -translate-x-1/2 translate-y-8 opacity-0'}`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-zinc-900">
            <Server className="text-indigo-500" size={32} />
          </div>
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Next.js API Route
          </span>
        </div>

        {/* External API */}
        <div className="z-10 flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-amber-200 bg-white shadow-sm dark:border-amber-900 dark:bg-zinc-900">
            <Database className="text-amber-500" size={32} />
          </div>
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            External API
          </span>
        </div>

        {/* Animations & Connectors */}
        <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full">
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
            <line
              x1="80"
              y1="80"
              x2="250"
              y2="80"
              stroke="#3b82f6"
              strokeWidth="3"
              strokeDasharray="4 4"
              className="animate-[dash_1s_linear_infinite]"
            />
          )}

          {/* Secure Path - Right */}
          {isSecure && <line x1="250" y1="80" x2="420" y2="80" stroke="#22c55e" strokeWidth="3" />}
        </svg>

        {/* Exposed Key Animation (Unsafe Mode) */}
        {!isSecure && (
          <div className="absolute top-1/3 left-1/2 flex -translate-x-1/2 -translate-y-1/2 animate-bounce flex-col items-center">
            <div className="rounded-full border border-red-200 bg-red-100 p-2 text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
              <Key size={20} />
            </div>
            <span className="mt-1 rounded border border-red-100 bg-white px-1 text-[10px] font-bold text-red-500 shadow-sm dark:bg-zinc-950">
              API_KEY Exposed!
            </span>
          </div>
        )}

        {/* Secured Key (Secure Mode) */}
        {isSecure && (
          <div className="absolute top-[60%] left-[68%] flex -translate-x-1/2 flex-col items-center">
            <div className="flex items-center gap-1 rounded-full border border-green-200 bg-green-100 p-1.5 text-green-600 shadow-sm dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
              <Key size={12} />
              <Lock size={12} />
            </div>
            <span className="mt-1 text-[10px] font-bold text-green-600 dark:text-green-500">
              Safe on Server
            </span>
          </div>
        )}
      </div>

      <p className="max-w-sm text-center text-sm text-zinc-500">
        {isSecure
          ? 'The Browser calls your Next.js API. The Server holds the keys and calls the External API securely.'
          : 'Direct calls from Browser to External API require exposing keys. Never do this.'}
      </p>

      {/* Code Snippet Preview */}
      <div className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900 p-3 font-mono text-xs text-zinc-300">
        <div className="mb-2 flex items-center gap-2 border-b border-zinc-800 pb-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="ml-2 text-zinc-500">
            {isSecure ? 'app/api/route.ts' : 'app/components/Client.tsx'}
          </span>
        </div>
        {isSecure ? (
          <>
            <span className="text-purple-400">export async function</span>{' '}
            <span className="text-blue-400">GET</span>() {'{'}
            <br />
            &nbsp;&nbsp;
            <span className="text-zinc-500">{'// ✅ Safe: Environment variable on server'}</span>
            <br />
            &nbsp;&nbsp;<span className="text-purple-400">const</span> key = process.env.
            <span className="text-orange-400">API_SECRET</span>;<br />
            &nbsp;&nbsp;<span className="text-purple-400">return</span> fetch(..., {'{'} headers:{' '}
            {'{'} Authorization: key {'}'} {'}'});
            <br />
            {'}'}
          </>
        ) : (
          <>
            <span className="text-purple-400">const</span>{' '}
            <span className="text-blue-400">fetchData</span> = () ={'>'} {'{'}
            <br />
            &nbsp;&nbsp;
            <span className="text-zinc-500">{'// ❌ DANGER: Key expo sed to browser user'}</span>
            <br />
            &nbsp;&nbsp;<span className="text-purple-400">const</span> key ={' '}
            <span className="text-red-400">&quot;sk_live_12345&quot;</span>;<br />
            &nbsp;&nbsp;<span className="text-purple-400">return</span> axios.get(..., {'{'}{' '}
            headers: {'{'} Authorization: key {'}'} {'}'});
            <br />
            {'}'}
          </>
        )}
      </div>
    </div>
  );
}
