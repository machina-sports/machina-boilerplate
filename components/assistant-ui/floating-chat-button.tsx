'use client';

import { useChatOpen } from '@/contexts/chat-open-context';
import { Button } from '@/components/ui/button';
import { MessageCircleIcon, XIcon } from 'lucide-react';
import type { FC } from 'react';

export const FloatingChatButton: FC = () => {
  const { isOpen, toggleOpen } = useChatOpen();

  return (
    <Button
      onClick={toggleOpen}
      className="aui-floating-chat-button fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all p-0 z-40"
      aria-label={isOpen ? 'Chat is opened' : 'Open chat'}
    >
      <MessageCircleIcon className="h-6 w-6" />
    </Button>
  );
};

