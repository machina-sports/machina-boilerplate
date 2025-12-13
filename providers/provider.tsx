'use client';

import { useMemo, type ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from '@/components/theme-provider';
import { PosthogProvider } from '@/components/analytics/posthog-provider';
import { SampleProvider } from '@/providers/sample/provider';
import { AssistantProvider } from '@/providers/assistant/provider';
import { getStore } from '@/store';

export function Providers({ children }: { children: ReactNode }) {
  const store = useMemo(() => getStore(), []);

  return (
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="dark">
        <PosthogProvider>
          <SampleProvider>
            <AssistantProvider>{children}</AssistantProvider>
          </SampleProvider>
        </PosthogProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
