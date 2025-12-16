'use client';

import { TooltipIconButton } from '@/components/assistant-ui/tooltip-icon-button';
import { ThreadPrimitive } from '@assistant-ui/react';
import { ArrowDownIcon } from 'lucide-react';
import { memo } from 'react';
import type { FC } from 'react';

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="aui-thread-scroll-to-bottom bg-background hover:bg-muted absolute -top-14 left-1/2 z-10 -translate-x-1/2 rounded-full border p-2 shadow-md disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

export default memo(ThreadScrollToBottom);
