'use client';

import { MarkdownText } from '@/components/assistant-ui/markdown-text';
import { ToolFallback } from '@/components/assistant-ui/tool-fallback';
import { MessagePrimitive } from '@assistant-ui/react';
import { memo } from 'react';
import type { FC } from 'react';
import AssistantActionBar from './assistant-action-bar';
import BranchPicker from './branch-picker';
import MessageError from './message-error';

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      className="aui-assistant-message-root fade-in slide-in-from-bottom-1 animate-in relative mx-auto w-full max-w-[var(--thread-max-width)] py-3 duration-150"
      data-role="assistant"
    >
      <div className="aui-assistant-message-content text-foreground max-h-[60vh] overflow-auto px-2 leading-relaxed wrap-break-word">
        <MessagePrimitive.Parts
          components={{
            Text: MarkdownText,
            tools: { Fallback: ToolFallback },
          }}
        />
        <MessageError />
      </div>

      <div className="aui-assistant-message-footer mt-1 ml-2 flex">
        <BranchPicker />
        <AssistantActionBar />
      </div>
    </MessagePrimitive.Root>
  );
};

export default memo(AssistantMessage);
