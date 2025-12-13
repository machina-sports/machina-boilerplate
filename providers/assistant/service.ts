import ClientBaseService from '@/libs/client/base.service';
import type { Workflow, Agent, Message } from './types';

class AssistantService extends ClientBaseService {
  prefix = '/api/assistant';

  /**
   * Fetch available workflows
   */
  async getWorkflows(): Promise<Workflow[]> {
    //@ts-ignore
    const response = await this.get<{ workflows: Workflow[] }>(this.prefix + '/workflows', {});
    return response.workflows;
  }

  /**
   * Fetch available agents
   */
  async getAgents(): Promise<Agent[]> {
    //@ts-ignore
    const response = await this.get<{ agents: Agent[] }>(this.prefix + '/agents', {});
    return response.agents;
  }

  /**
   * Fetch workflow details by ID
   */
  async getWorkflowDetails(workflowId: string): Promise<Workflow> {
    //@ts-ignore
    const response = await this.get<Workflow>(this.prefix + `/workflows/${workflowId}`, {});
    return response;
  }

  /**
   * Send a message to the assistant
   */
  async sendMessage(params: {
    message: string;
    workflowId: string;
    parameters: Record<string, string>;
    threadId?: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  }): Promise<{ message: Message; threadId: string }> {
    //@ts-ignore
    const response = await this.post<{ message: Message; threadId: string }>(
      params,
      this.prefix + '/chat',
      {}
    );
    return response;
  }

  /**
   * Create a new thread
   */
  async createThread(): Promise<{ threadId: string }> {
    //@ts-ignore
    const response = await this.post<{ threadId: string }>({}, this.prefix + '/thread', {});
    return response;
  }
}

export const assistantService = new AssistantService();

