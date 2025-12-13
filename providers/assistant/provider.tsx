'use client';

import { useEffect, type ReactNode } from 'react';
import { useAppSelector } from '@/store/useState';
import { useAppDispatch } from '@/store/dispatch';
import { fetchWorkflows, fetchAgents } from './actions';

interface AssistantProviderProps {
  children: ReactNode;
}

/**
 * AssistantProvider - Loads initial data for the assistant
 */
export function AssistantProvider({ children }: AssistantProviderProps) {
  const dispatch = useAppDispatch();
  const { workflows, agents } = useAppSelector((state) => state.assistant);

  useEffect(() => {
    // Load workflows and agents on mount if not already loaded
    if (workflows.length === 0) {
      dispatch(fetchWorkflows());
    }
    if (agents.length === 0) {
      dispatch(fetchAgents());
    }
  }, [dispatch, workflows.length, agents.length]);

  return <>{children}</>;
}

