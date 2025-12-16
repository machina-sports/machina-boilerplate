'use client';

import Image from 'next/image';
import { Copy, Server, Type, Zap, ShieldCheck, Check, Settings } from 'lucide-react';
import { useState } from 'react';
import { TipCard } from './components/tips/TipCard';
import { ClientServerVisual } from './components/tips/ClientServerVisual';
import { ComponentStructureVisual } from './components/tips/ComponentStructureVisual';
import { ArchitectureVisual } from './components/tips/ArchitectureVisual';

const TipsPage = () => {
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
    <main className="flex min-h-screen flex-col items-center justify-start gap-10 bg-zinc-50 px-6 py-16 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Header Section */}
      <div className="flex max-w-3xl flex-col items-center gap-6 text-center">
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
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
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
            <a href="/playground" className="text-sm text-blue-500 hover:underline">
              🤖 Try the Assistant Playground
            </a>
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

      {/* Tips Grid */}
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Tip 1: Componentization & DRY */}
        <TipCard
          title="Componentization & DRY"
          description="Avoid large files and repetition. If you find yourself copying code or writing a monolithic file, split it into smaller, focused components."
          icon={<Copy size={20} />}
          className="md:col-span-2 lg:col-span-1"
        >
          <ComponentStructureVisual />
          <div className="mt-4 space-y-2 px-2 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              <strong>Don&apos;t Repeat Yourself (DRY):</strong> If you see a pattern repeating,
              abstract it into a reusable component.
            </p>
            <p>
              The decision to split depends on complexity, but aim for single-responsibility
              components.
            </p>
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
          <div className="space-y-4 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-zinc-500 uppercase">Bad Practice</span>
              <code className="block rounded bg-red-50 p-2 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                const ListUsers = () =&gt; &#123;
                <br />
                &nbsp;&nbsp;// sending emails logic...
                <br />
                &nbsp;&nbsp;// payment processing...
                <br />
                &nbsp;&nbsp;return &lt;div&gt;...&lt;/div&gt;
                <br />
                &#125;
              </code>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-zinc-500 uppercase">Good Practice</span>
              <code className="block rounded bg-green-50 p-2 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
                const ListUsers = () =&gt; &#123;
                <br />
                &nbsp;&nbsp;// only listing logic
                <br />
                &nbsp;&nbsp;return &lt;UserTable /&gt;
                <br />
                &#125;
              </code>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Observe each function and JSX return. If unrelated logic creeps in, move it out.
            </p>
          </div>
        </TipCard>

        {/* Tip 5: Performance & Hooks */}
        <TipCard
          title="Performance & Hooks"
          description="Use React Hooks and modern patterns to keep the application fluid and performant."
          icon={<Zap size={20} />}
        >
          <ul className="space-y-3 p-2">
            <li className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-bold text-green-500">✓</span>
              <span>
                Use <code>useMemo</code> and <code>useCallback</code> for expensive calculations or
                reference stability.
              </span>
            </li>
            <li className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-bold text-green-500">✓</span>
              <span>Prefer composition over deep prop drilling.</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <span className="font-bold text-green-500">✓</span>
              <span>
                Keep effects (<code>useEffect</code>) simple and focused.
              </span>
            </li>
          </ul>
        </TipCard>

        {/* Tip 6: Prepare for Production */}
        <TipCard
          title="Prepare for Production"
          description="Remove example files and optional dependencies when starting your project."
          icon={<Settings size={20} />}
          className="md:col-span-2"
        >
          <div className="space-y-4 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-900">
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                After cloning and installing dependencies, prepare your project:
              </p>
              <div className="rounded-md bg-zinc-50 p-3 dark:bg-zinc-800">
                <code className="block text-sm text-zinc-800 dark:text-zinc-200">
                  npm run prepare:production
                  <br />
                  npm install
                </code>
              </div>
              <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                <p>
                  <strong>This will:</strong>
                </p>
                <ul className="ml-2 list-inside list-disc space-y-1">
                  <li>
                    Add example files to <code>.gitignore</code>
                  </li>
                  <li>
                    Remove optional dependencies (<code>react-markdown</code>,{' '}
                    <code>react-syntax-highlighter</code>)
                  </li>
                  <li>
                    Clean up example pages (<code>/docs</code>, <code>/redux-demo</code>)
                  </li>
                </ul>
              </div>
              <div className="border-t border-zinc-200 pt-2 dark:border-zinc-700">
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  💡 To restore examples:{' '}
                  <code className="text-xs">npm run prepare:development</code>
                </p>
              </div>
            </div>
          </div>
        </TipCard>
      </div>
    </main>
  );
};

export default TipsPage;
