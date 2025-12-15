'use client';

import { useChatOpen } from '@/contexts/chat-open-context';
import { Thread } from '@/components/assistant-ui/thread';
import { ThreadList } from '@/components/assistant-ui/thread-list';
import type { FC } from 'react';
import Image from 'next/image';

export const ChatModal: FC = () => {
  const { isOpen, toggleOpen } = useChatOpen();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="aui-chat-modal fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="aui-chat-modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={toggleOpen}
      />

      {/* Modal Content */}
      <div className="aui-chat-modal-content relative z-50 flex h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-zinc-900">
        {/* Header with Thread List */}
        <div className="aui-chat-modal-header flex-shrink-0 border-b border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-zinc-900/50">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/favicon.ico" alt="Machina Boilerplate" width={20} height={20} />
              <div className="h-6 w-px bg-gray-400"></div>
              <h2 className="font-sans text-lg font-semibold text-gray-900 dark:text-gray-100">
                Machina Boilerplate Assistant
              </h2>
            </div>
            <button
              onClick={toggleOpen}
              className="rounded-full p-2 transition-colors hover:bg-gray-200 dark:hover:bg-zinc-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <ThreadList />
        </div>

        {/* Main Thread Area */}
        <div className="aui-chat-modal-body relative flex-1 overflow-hidden bg-white dark:bg-zinc-900">
          <Thread />
        </div>
      </div>
    </div>
  );
};
