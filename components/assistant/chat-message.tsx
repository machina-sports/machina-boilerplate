'use client';

import { Bot, User } from 'lucide-react';
import type { Message } from '@/providers/assistant/types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex items-start gap-3 rounded-lg p-4 ${
        isUser
          ? 'bg-zinc-100 dark:bg-zinc-800'
          : 'bg-blue-50 dark:bg-blue-950/30'
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'bg-zinc-300 dark:bg-zinc-700'
            : 'bg-blue-500 dark:bg-blue-600'
        }`}
      >
        {isUser ? (
          <User size={16} className="text-zinc-700 dark:text-zinc-300" />
        ) : (
          <Bot size={16} className="text-white" />
        )}
      </div>
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {isUser ? 'You' : 'Assistant'}
        </p>
        <div className="text-sm text-zinc-700 dark:text-zinc-300">
          {message.content}
        </div>
      </div>
    </div>
  );
}

