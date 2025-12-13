import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AssistantState, Message } from './types';
import { fetchWorkflows, fetchAgents, sendMessage, createThread, fetchWorkflowDetails } from './actions';

const initialState: AssistantState = {
  messages: [],
  workflows: [],
  agents: [],
  selectedWorkflow: null,
  workflowParameters: {},
  threadId: null,
  status: 'idle',
};

const AssistantReducer = createSlice({
  name: 'assistant',
  initialState,
  reducers: {
    setSelectedWorkflow: (state, action: PayloadAction<string>) => {
      state.selectedWorkflow = action.payload;
      state.workflowParameters = {};
    },
    setWorkflowParameter: (state, action: PayloadAction<{ key: string; value: string }>) => {
      state.workflowParameters[action.payload.key] = action.payload.value;
    },
    addUserMessage: (state, action: PayloadAction<string>) => {
      const message: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: action.payload,
        timestamp: Date.now(),
      };
      state.messages.push(message);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.threadId = null;
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Workflows
      .addCase(fetchWorkflows.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchWorkflows.fulfilled, (state, action) => {
        state.workflows = action.payload;
        state.status = 'idle';
      })
      .addCase(fetchWorkflows.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch Agents
      .addCase(fetchAgents.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.agents = action.payload;
        state.status = 'idle';
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Fetch Workflow Details
      .addCase(fetchWorkflowDetails.fulfilled, (state, action) => {
        const existingIndex = state.workflows.findIndex((w) => w.id === action.payload.id);
        if (existingIndex >= 0) {
          state.workflows[existingIndex] = action.payload;
        } else {
          state.workflows.push(action.payload);
        }
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.status = 'streaming';
        state.error = undefined;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload.message);
        state.threadId = action.payload.threadId;
        state.status = 'idle';
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        const errorMessage = action.payload as string || action.error.message || 'Failed to send message';
        state.error = errorMessage;
        console.error('Send message failed:', errorMessage, action);
      })
      // Create Thread
      .addCase(createThread.fulfilled, (state, action) => {
        state.threadId = action.payload;
      });
  },
});

export const {
  setSelectedWorkflow,
  setWorkflowParameter,
  addUserMessage,
  clearMessages,
  clearError,
} = AssistantReducer.actions;

export default AssistantReducer;

