import { createAsyncThunk } from '@reduxjs/toolkit';
import { assistantService } from './service';
import type { Message } from './types';

/**
 * Fetch available workflows
 */
export const fetchWorkflows = createAsyncThunk('assistant/fetchWorkflows', async () => {
  const workflows = await assistantService.getWorkflows();
  return workflows;
});

/**
 * Fetch available agents
 */
export const fetchAgents = createAsyncThunk('assistant/fetchAgents', async () => {
  const agents = await assistantService.getAgents();
  return agents;
});

/**
 * Fetch workflow details
 */
export const fetchWorkflowDetails = createAsyncThunk(
  'assistant/fetchWorkflowDetails',
  async (workflowId: string) => {
    const workflow = await assistantService.getWorkflowDetails(workflowId);
    return workflow;
  }
);

/**
 * Send a message to the assistant
 */
export const sendMessage = createAsyncThunk(
  'assistant/sendMessage',
  async (
    params: {
      message: string;
      workflowId: string;
      parameters: Record<string, string>;
      threadId?: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      // Get conversation history from current state
      const state = getState() as any;
      const messages = state.assistant.messages || [];
      
      // Build conversation history (last 10 messages for context)
      const conversationHistory = messages
        .slice(-10)
        .filter((msg: any) => msg.role === 'user' || msg.role === 'assistant')
        .map((msg: any) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }));

      const response = await assistantService.sendMessage({
        ...params,
        conversationHistory,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

/**
 * Create a new thread
 */
export const createThread = createAsyncThunk('assistant/createThread', async () => {
  const response = await assistantService.createThread();
  return response.threadId;
});

