'use client';

import { useChatOpen } from '@/contexts/chat-open-context';
import { Thread } from '@/components/assistant-ui/thread';
import { ThreadList } from '@/components/assistant-ui/thread-list';
import type { FC } from 'react';

export const ChatModal: FC = () => {
  const { isOpen } = useChatOpen();

  if (!isOpen) {
    return null;
  }

  return (
    <div className="aui-chat-modal fixed inset-0 z-30 flex items-end justify-end p-4 md:items-center md:justify-center">
      {/* Backdrop */}
      <div className="aui-chat-modal-backdrop absolute inset-0 bg-black/50 transition-opacity" />

      {/* Modal Content */}
      <div className="aui-chat-modal-content relative z-10 flex h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-background shadow-2xl md:h-[600px]">
        {/* Header with Thread List */}
        <div className="aui-chat-modal-header flex-shrink-0 border-b border-border bg-muted p-4">
          <h2 className="text-lg font-semibold mb-3">Threads</h2>
          <ThreadList />
        </div>

        {/* Main Thread Area */}
        <div className="aui-chat-modal-body flex-1 overflow-hidden">
          <Thread />
        </div>
      </div>
    </div>
  );
};

