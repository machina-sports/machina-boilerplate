'use client';

import { Button } from '@/components/ui/button';
import { ThreadPrimitive } from '@assistant-ui/react';
import { memo } from 'react';
import type { FC } from 'react';
import { SUGGESTIONS } from '@/components/assistant-ui/utils/suggestions';

const ThreadSuggestions: FC = () => {
  return (
    <div className="aui-thread-welcome-suggestions grid w-full gap-2 pb-4 @md:grid-cols-2">
      {SUGGESTIONS.map((suggestion, index) => (
        <div
          key={suggestion.prompt}
          className="aui-thread-welcome-suggestion-display fade-in slide-in-from-bottom-2 animate-in fill-mode-both duration-200"
          style={{ animationDelay: `${100 + index * 50}ms` }}
        >
          <ThreadPrimitive.Suggestion prompt={suggestion.prompt} send asChild>
            <Button
              variant="ghost"
              className="aui-thread-welcome-suggestion hover:bg-muted h-auto w-full flex-wrap items-start justify-start gap-1 rounded-2xl border px-4 py-3 text-left text-sm transition-colors @md:flex-col"
              aria-label={suggestion.prompt}
            >
              <span className="aui-thread-welcome-suggestion-text-1 font-medium">
                {suggestion.title}
              </span>
              <span className="aui-thread-welcome-suggestion-text-2 text-muted-foreground">
                {suggestion.label}
              </span>
            </Button>
          </ThreadPrimitive.Suggestion>
        </div>
      ))}
    </div>
  );
};

export default memo(ThreadSuggestions);
