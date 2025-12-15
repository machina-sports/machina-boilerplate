'use client';

import { AssistantIf, ThreadPrimitive } from '@assistant-ui/react';
import type { FC } from 'react';
import dynamic from 'next/dynamic';
const AssistantMessage = dynamic(() => import('./thread-components/assistant-message'));
const Composer = dynamic(() => import('./thread-components/composer'));
const EditComposer = dynamic(() => import('./thread-components/edit-composer'));
const ThreadScrollToBottom = dynamic(() => import('./thread-components/thread-scroll-to-bottom'));
const ThreadWelcome = dynamic(() => import('./thread-components/thread-welcome'));
const ThreadLoading = dynamic(() => import('./thread-components/thread-loading'));
const UserMessage = dynamic(() => import('./thread-components/user-message'));

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root
      className="aui-root aui-thread-root bg-background flex h-full w-full flex-col"
      style={{
        ['--thread-max-width' as string]: '44rem',
      }}
    >
      <ThreadPrimitive.Viewport
        turnAnchor="top"
        className="aui-thread-viewport flex-1 overflow-y-auto scroll-smooth px-4 pt-4"
      >
        <AssistantIf condition={({ thread }) => thread.isEmpty}>
          <ThreadWelcome />
        </AssistantIf>
        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            EditComposer,
            AssistantMessage,
          }}
        />
        <ThreadLoading />
        <div className="min-h-8 flex-shrink-0" /> {/* Spacer no final das mensagens */}
      </ThreadPrimitive.Viewport>

      <div className="bg-background relative z-10 px-4 pt-2 pb-4 flex-shrink-0">
        <ThreadScrollToBottom />
        <Composer />
      </div>
    </ThreadPrimitive.Root>
  );
};
