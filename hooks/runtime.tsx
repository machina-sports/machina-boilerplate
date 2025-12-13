'use client';


import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";

export function useRuntime() {
  return useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/assistant/chat",
    })
  });
}