'use client';

import Image from 'next/image';
import { Copy, Server, Type, Zap, ShieldCheck, Check } from 'lucide-react';
import { useState } from 'react';
import { TipCard } from './components/tips/TipCard';
import { ClientServerVisual } from './components/tips/ClientServerVisual';
import { ComponentStructureVisual } from './components/tips/ComponentStructureVisual';
import { ArchitectureVisual } from './components/tips/ArchitectureVisual';

const TipsPage = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const gitCloneCommand = 'git clone git@github.com:machina-sports/machina-frontend-boilerplate.git';
    navigator.clipboard.writeText(gitCloneCommand).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-10 bg-zinc-50 px-6 py-16 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      
      {/* Header Section */}
      <div className="flex flex-col items-center gap-6 text-center max-w-3xl">
        <Image
          src="/logo-grey.webp"
          alt="Machina Sports logo"
          width={0}
          height={0}
          sizes="100vw"
          priority
          className="h-12 w-auto md:h-16"
        />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Machina Boilerplate Development Tips</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            Best practices and guidelines for a better development experience.
          </p>
          
          {/* Git Clone Button */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                copied
                  ? 'bg-green-500 dark:bg-green-600 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-300 dark:hover:bg-zinc-700'
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

          <div className="pt-2">
            <a href="/redux-demo" className="text-sm text-blue-500 hover:underline">
               Check Redux Demo Page
            </a>
          </div>
        </div>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full">
        
        {/* Tip 1: Componentization & DRY */}
        <TipCard
          title="Componentization & DRY"
          description="Avoid large files and repetition. If you find yourself copying code or writing a monolithic file, split it into smaller, focused components."
          icon={<Copy size={20} />}
          className="md:col-span-2 lg:col-span-1"
        >
          <ComponentStructureVisual />
          <div className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400 px-2">
            <p><strong>Don't Repeat Yourself (DRY):</strong> If you see a pattern repeating, abstract it into a reusable component.</p>
            <p>The decision to split depends on complexity, but aim for single-responsibility components.</p>
          </div>
        </TipCard>

        {/* Tip 2: 'use client' Usage */}
        <TipCard
          title="Client vs Server Components"
          description="By default, use Server Components. Add 'use client' only when you need browser interactivity."
          icon={<Server size={20} />}
          className="md:col-span-2 lg:col-span-1"
        >
          <ClientServerVisual />
        </TipCard>

        {/* Tip 3: Secure Architecture */}
        <TipCard
          title="API & Security Architecture"
          description="Never expose external API calls or secrets on the client-side. Use Next.js API Routes as a secure proxy layer."
          icon={<ShieldCheck size={20} />}
          className="md:col-span-2"
        >
          <ArchitectureVisual />
        </TipCard>

        {/* Tip 4: Context & Naming */}
        <TipCard
          title="Naming & Context"
          description="Pay attention to component names and their context. If a component is named 'ListUsers', its implementation should focus on that."
          icon={<Type size={20} />}
        >
          <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg space-y-4">
             <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-zinc-500 uppercase">Bad Practice</span>
                <code className="text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded block">
                  const ListUsers = () =&gt; &#123;<br/>
                  &nbsp;&nbsp;// sending emails logic...<br/>
                  &nbsp;&nbsp;// payment processing...<br/>
                  &nbsp;&nbsp;return &lt;div&gt;...&lt;/div&gt;<br/>
                  &#125;
                </code>
             </div>
             <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-zinc-500 uppercase">Good Practice</span>
                <code className="text-sm bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-2 rounded block">
                  const ListUsers = () =&gt; &#123;<br/>
                  &nbsp;&nbsp;// only listing logic<br/>
                  &nbsp;&nbsp;return &lt;UserTable /&gt;<br/>
                  &#125;
                </code>
             </div>
             <p className="text-sm text-zinc-600 dark:text-zinc-400">
               Observe each function and JSX return. If unrelated logic creeps in, move it out.
             </p>
          </div>
        </TipCard>

        {/* Tip 4: Performance & Hooks */}
        <TipCard
          title="Performance & Hooks"
          description="Use React Hooks and modern patterns to keep the application fluid and performant."
          icon={<Zap size={20} />}
        >
           <ul className="space-y-3 p-2">
             <li className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
               <span className="text-green-500 font-bold">✓</span>
               <span>Use <code>useMemo</code> and <code>useCallback</code> for expensive calculations or reference stability.</span>
             </li>
             <li className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
               <span className="text-green-500 font-bold">✓</span>
               <span>Prefer composition over deep prop drilling.</span>
             </li>
             <li className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
               <span className="text-green-500 font-bold">✓</span>
               <span>Keep effects (<code>useEffect</code>) simple and focused.</span>
             </li>
           </ul>
        </TipCard>

      </div>
    </main>
  );
};

export default TipsPage;
