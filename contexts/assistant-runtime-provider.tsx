'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useRuntime } from '@/hooks/runtime';

interface AssistantRuntimeProviderWrapperProps {
  children: ReactNode;
}

export function AssistantRuntimeProviderWrapper({ children }: AssistantRuntimeProviderWrapperProps) {
  const runtime = useRuntime();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}

export default AssistantRuntimeProviderWrapper;