'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { useMachinaRuntime } from '@/hooks/use-machina-runtime';

interface AssistantRuntimeProviderWrapperProps {
  children: ReactNode;
}

/**
 * AssistantRuntimeProviderWrapper
 *
 * Provides the Machina-integrated runtime to all assistant-ui components
 * Uses Redux for state management and Machina streaming API
 */
export function AssistantRuntimeProviderWrapper({
  children,
}: AssistantRuntimeProviderWrapperProps) {
  const runtime = useMachinaRuntime();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>;
}

export default AssistantRuntimeProviderWrapper;
