# Machina API Integration Guide

Este documento descreve como foi implementada a integração com a Machina API no frontend.

## 📋 Visão Geral

A integração permite:

- ✅ Buscar agents e workflows da API Machina
- ✅ Executar agents com streaming em tempo real (NDJSON)
- ✅ Receber objetos (markets, bets, etc) estruturados
- ✅ Mostrar progresso de workflows
- ✅ Status updates durante execução
- ✅ Sugestões de próximas ações

## 🏗️ Arquitetura

```
Frontend (Next.js) → Proxy Routes → Machina API (Staging)
                         ↓
                  NDJSON Streaming
                         ↓
                  Redux State Management
```

### Componentes Principais

#### 1. **Types** (`providers/assistant/types.ts`)

Define todos os tipos TypeScript para a integração:

- `Agent` - Definição de agent da API
- `Workflow` - Definição de workflow
- `StreamMessage` - Mensagens do stream NDJSON
- `AssistantObject` - Objetos retornados (markets, etc)
- `AssistantState` - Estado Redux completo

#### 2. **Machina API Client** (`libs/client/machina-api.client.ts`)

Cliente HTTP para comunicação com a API:

- Métodos REST: `get()`, `post()`, `put()`, `delete()`
- Stream NDJSON: `stream()` - Async generator
- Autenticação automática via API Key
- Tratamento de erros

#### 3. **Service** (`providers/assistant/service.ts`)

Camada de serviço com métodos de alto nível:

- `getAgents()` - Buscar agents
- `getWorkflows()` - Buscar workflows
- `streamAgent()` - Executar agent com streaming
- `executeAgent()` - Executar agent (não-streaming)

#### 4. **Proxy Routes** (`app/api/assistant/`)

Rotas Next.js que fazem proxy para Machina API:

**`/api/assistant/agents`** (POST)

```typescript
// Busca agents
POST /api/assistant/agents
Body: { filters: {}, page: 1, page_size: 100 }
→ Proxy para: POST /agent/search
```

**`/api/assistant/workflows`** (POST)

```typescript
// Busca workflows
POST /api/assistant/workflows
Body: { filters: {}, page: 1, page_size: 100 }
→ Proxy para: POST /workflow/search
```

**`/api/assistant/stream/[agent]`** (POST)

```typescript
// Stream de execução do agent
POST /api/assistant/stream/assistant-thread-agent
Body: {
  messages: [{role: 'user', content: '...'}],
  stream_workflows: true,
  'context-agent': { thread_id: 'uuid' }
}
→ Proxy para: POST /agent/stream/assistant-thread-agent
→ Retorna: NDJSON stream
```

#### 5. **Redux (State Management)**

**Reducer** (`providers/assistant/reducer.ts`):

- Gerencia estado global do assistant
- `handleStreamMessage()` - Processa mensagens do stream
- Controla progresso de workflows
- Armazena objetos e sugestões

**Actions** (`providers/assistant/actions.ts`):

- `fetchAgents()` - Thunk para buscar agents
- `fetchWorkflows()` - Thunk para buscar workflows
- `streamAgentExecution()` - Thunk para streaming

## 🚀 Como Usar

### 1. Configurar Variáveis de Ambiente

Crie `.env.local`:

```bash
MACHINA_API_URL=https://api-staging.machina.gg
MACHINA_API_KEY=KCPN6Y5mBL33QBjBQ7C9DWi2NfLyXjoedS6DXa44Z_VQbL3Sb5El7UgT9EvtVGeo3WVXCDsckPLXeLwOTbkOiQ

NEXT_PUBLIC_MACHINA_API_URL=https://api-staging.machina.gg
NEXT_PUBLIC_MACHINA_API_KEY=KCPN6Y5mBL33QBjBQ7C9DWi2NfLyXjoedS6DXa44Z_VQbL3Sb5El7UgT9EvtVGeo3WVXCDsckPLXeLwOTbkOiQ
```

### 2. Buscar Agents

```typescript
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchAgents } from '@/providers/assistant/actions';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { agents, status } = useAppSelector(state => state.assistant);

  useEffect(() => {
    dispatch(fetchAgents());
  }, []);

  return (
    <div>
      {agents.map(agent => (
        <div key={agent._id}>{agent.name}</div>
      ))}
    </div>
  );
}
```

### 3. Executar Agent com Streaming

```typescript
import { streamAgentExecution } from '@/providers/assistant/actions';

function ChatComponent() {
  const dispatch = useAppDispatch();
  const {
    messages,
    streamingStatus,
    workflowProgress,
    currentObjects,
    currentSuggestions
  } = useAppSelector(state => state.assistant);

  const handleSendMessage = async (message: string) => {
    await dispatch(streamAgentExecution({
      agentName: 'assistant-thread-agent',
      message,
      threadId: threadId || undefined,
      streamWorkflows: true,
    }));
  };

  return (
    <div>
      {/* Status atual */}
      {streamingStatus && (
        <div className="status">{streamingStatus}</div>
      )}

      {/* Progresso de workflows */}
      {workflowProgress.total > 0 && (
        <div className="progress">
          Step {workflowProgress.current}/{workflowProgress.total}
          {workflowProgress.currentWorkflowName}
        </div>
      )}

      {/* Mensagens */}
      {messages.map(msg => (
        <div key={msg.id}>
          <strong>{msg.role}:</strong> {msg.content}

          {/* Objetos (markets, bets, etc) */}
          {msg.objects && msg.objects.length > 0 && (
            <div className="objects">
              {msg.objects.map((obj, i) => (
                <div key={i}>{JSON.stringify(obj)}</div>
              ))}
            </div>
          )}

          {/* Sugestões */}
          {msg.suggestions && msg.suggestions.length > 0 && (
            <div className="suggestions">
              {msg.suggestions.map((sug, i) => (
                <button key={i} onClick={() => handleSendMessage(sug)}>
                  {sug}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 4. Usar Service Diretamente (sem Redux)

```typescript
import { assistantService } from '@/providers/assistant/service';

async function streamExample() {
  const stream = assistantService.streamAgent({
    agentName: 'assistant-thread-agent',
    messages: [{ role: 'user', content: 'Olá!' }],
    streamWorkflows: true,
  });

  for await (const message of stream) {
    console.log('Stream message:', message);

    switch (message.type) {
      case 'start':
        console.log('Iniciando:', message.content);
        break;
      case 'workflow_start':
        console.log('Workflow:', message.content);
        break;
      case 'content':
        console.log('Chunk:', message.content);
        break;
      case 'done':
        console.log('Finalizado!');
        console.log('Objetos:', message.metadata?.objects);
        console.log('Sugestões:', message.metadata?.suggestions);
        break;
    }
  }
}
```

## 📡 Stream Message Types

### Tipos de Mensagem do Stream

```typescript
// 1. start - Início da execução
{
  type: 'start',
  content: '⚡ Processing your request...',
  metadata: {
    agent_name: 'SportingBOT',
    agent_id: '...',
    task_id: 'uuid'
  }
}

// 2. workflow_start - Início de workflow
{
  type: 'workflow_start',
  content: 'Step 1/3: Chat Reasoning',
  metadata: {
    workflow_name: 'chat-reasoning',
    workflow_index: 1,
    total_workflows: 3,
    progress_percent: 0
  }
}

// 3. status_update - Status intermediário
{
  type: 'status_update',
  content: '⏳ Interpretando a sua pergunta...',
  metadata: {
    workflow_name: 'chat-reasoning',
    status_message: '...'
  }
}

// 4. content - Chunk de conteúdo
{
  type: 'content',
  content: 'Olá! Eu sou o',
  metadata: {
    partial: true
  }
}

// 5. workflow_objects - Objetos do workflow
{
  type: 'workflow_objects',
  content: '',
  metadata: {
    objects: [
      { id: '123', type: 'market', title: 'Benfica vs Porto' }
    ]
  }
}

// 6. workflow_complete - Fim de workflow
{
  type: 'workflow_complete',
  content: '✓ Completed: Chat Reasoning',
  metadata: {
    success: true,
    progress_percent: 33
  }
}

// 7. done - Finalização
{
  type: 'done',
  content: '',
  metadata: {
    content: 'resposta final completa',
    objects: [...],
    suggestions: ['Próxima pergunta 1', 'Próxima pergunta 2']
  }
}

// 8. error - Erro
{
  type: 'error',
  content: 'Error message',
  metadata: {}
}
```

## 🎨 Exemplo de Renderização de Objetos

```typescript
function ObjectRenderer({ objects }: { objects: AssistantObject[] }) {
  return (
    <div className="objects-grid">
      {objects.map((obj, i) => {
        // Exemplo: renderizar market
        if (obj.type === 'market') {
          return (
            <div key={i} className="market-card">
              <h3>{obj.title}</h3>
              <p>{obj.description}</p>
              {obj.odds && <span>Odds: {obj.odds}</span>}
            </div>
          );
        }

        // Fallback: renderizar JSON
        return (
          <pre key={i}>
            {JSON.stringify(obj, null, 2)}
          </pre>
        );
      })}
    </div>
  );
}
```

## 🔧 Troubleshooting

### Erro: "Failed to fetch agents"

- Verificar se `MACHINA_API_KEY` está configurada
- Verificar se API está acessível: `curl https://api-staging.machina.gg/system/core-health-check`

### Stream não funciona

- Verificar logs do console do navegador
- Verificar logs do servidor Next.js
- Verificar se headers `Content-Type: application/x-ndjson` estão corretos

### CORS Error

- API proxy routes em `/app/api/assistant/` devem resolver CORS
- Verificar se está acessando via proxy (`/api/assistant/...`) e não diretamente

## 📚 Referências

- [Machina API Documentation](https://api-staging.machina.gg/docs)
- [Streaming Architecture](../machina-client-api/docs/STREAMING_ARCHITECTURE.md)
- [Implementation Summary](../machina-client-api/docs/IMPLEMENTATION_SUMMARY.md)

## 🚀 Próximos Passos

- [ ] Adicionar retry automático em caso de falha
- [ ] Implementar cache de agents/workflows
- [ ] Adicionar suporte a WebSocket (futuro)
- [ ] Melhorar componentes de UI para objetos
- [ ] Adicionar testes unitários
- [ ] Adicionar storybook para componentes

---

**Última atualização:** 2025-01-13
**Autor:** Machina Team
