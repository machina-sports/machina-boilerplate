'use client';

import { useAppSelector } from '@/store/useState';
import { useAppDispatch } from '@/store/dispatch';
import { clearMessages } from '@/providers/assistant/reducer';
import { ConfigurationPanel } from '@/components/assistant/configuration-panel';
import { ChatPanel } from '@/components/assistant/chat-panel';
import { Sparkles, RotateCcw } from 'lucide-react';
import Image from 'next/image';

export default function PlaygroundPage() {
  const dispatch = useAppDispatch();
  const { messages, selectedWorkflow } = useAppSelector((state) => state.assistant);

  const handleReset = () => {
    if (confirm('Are you sure you want to clear the conversation?')) {
      dispatch(clearMessages());
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/logo-grey.webp"
                alt="Machina Sports logo"
                width={0}
                height={0}
                sizes="100vw"
                priority
                className="h-10 w-auto"
              />
              <div className="flex items-center gap-2">
                <Sparkles size={24} className="text-blue-500 dark:text-blue-400" />
                <div>
                  <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Playground
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Try out workflows and see the results
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Back to Home
              </a>
              {messages.length > 0 && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Configuration Panel - Left Side */}
          <div className="lg:col-span-1">
            <ConfigurationPanel />
          </div>

          {/* Chat Panel - Right Side */}
          <div className="lg:col-span-2">
            <ChatPanel />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            About the Assistant
          </h2>
          <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
            <p>
              This assistant helps developers understand and use the Machina frontend boilerplate
              effectively. Select a workflow from the configuration panel to get started.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
                <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">
                  Assistant Chat
                </h3>
                <p className="text-xs">
                  General purpose assistant for boilerplate questions and guidance
                </p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
                <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">
                  Code Helper
                </h3>
                <p className="text-xs">
                  Get code examples and best practices for components and features
                </p>
              </div>
              <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800/50">
                <h3 className="mb-2 font-medium text-zinc-900 dark:text-zinc-100">
                  Deployment Guide
                </h3>
                <p className="text-xs">
                  Help with deployment configuration and troubleshooting
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

