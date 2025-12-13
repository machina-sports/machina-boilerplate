// Types for Assistant Provider

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  parameters: WorkflowParameter[];
}

export interface WorkflowParameter {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  description?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
}

export interface AssistantState {
  messages: Message[];
  workflows: Workflow[];
  agents: Agent[];
  selectedWorkflow: string | null;
  workflowParameters: Record<string, string>;
  threadId: string | null;
  status: 'idle' | 'loading' | 'streaming' | 'failed';
  error?: string;
}

