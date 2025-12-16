# Guia de Teste - Integração Machina API

## 🚀 Como Testar

### 1. Configure as Variáveis de Ambiente

Crie `.env.local` na raiz do projeto:

```bash
MACHINA_API_URL=https://api-staging.machina.gg
MACHINA_API_KEY=KCPN6Y5mBL33QBjBQ7C9DWi2NfLyXjoedS6DXa44Z_VQbL3Sb5El7UgT9EvtVGeo3WVXCDsckPLXeLwOTbkOiQ
```

### 2. Inicie o Servidor

```bash
npm run dev
```

### 3. Abra a Aplicação

Acesse: http://localhost:3000

### 4. Teste o Assistente

1. **Clique no botão flutuante** no canto inferior direito (ícone de chat)
2. **O modal vai abrir** com a interface do assistente
3. **Digite uma mensagem** no input "Send a message..."
4. **Pressione Enter** ou clique no botão de enviar

### 5. O Que Esperar

✅ **Streaming em tempo real:**
- Mensagem do usuário aparece instantaneamente
- Status updates aparecem (ex: "⏳ Interpretando sua pergunta...")
- Resposta do assistente aparece chunk por chunk
- Objetos (markets, bets) aparecem ao final (se houver)
- Sugestões de próximas perguntas (se houver)

✅ **Progresso de Workflows:**
- "Step 1/3: Chat Reasoning"
- "Step 2/3: Market Search"
- etc.

### 6. Verificar Logs

No terminal onde está rodando `npm run dev`, você verá:

```
[Agent Search] Using API URL: https://api-staging.machina.gg
[Stream Proxy] Starting stream for agent: assistant-thread-agent
[Stream Proxy] Task ID: uuid-aqui
[Stream Proxy] Stream completed
```

### 7. Verificar no Console do Navegador

Abra o DevTools (F12) e vá na aba Console. Você verá:

```
Stream message: {type: 'start', content: '⚡ Processing...', metadata: {...}}
Stream message: {type: 'workflow_start', content: 'Step 1/3...', metadata: {...}}
Stream message: {type: 'content', content: 'Olá...', metadata: {...}}
Stream message: {type: 'done', content: '', metadata: {objects: [...], suggestions: [...]}}
```

## 🐛 Troubleshooting

### Erro 404 nos endpoints

**Problema:** 
```
POST /api/assistant/agents 404
POST /api/assistant/workflows 404
```

**Solução:**
- Verifique se `.env.local` está configurado
- Verifique se o `MACHINA_API_KEY` está correto
- Reinicie o servidor `npm run dev`

### Erro "X-Api-Token required"

**Problema:**
```
{"error": {"code": 401, "message": "Authentication failed"}}
```

**Solução:**
- Verifique se a API Key está correta
- A API espera header `X-Api-Token` (não `Authorization: Bearer`)

### Modal não abre

**Problema:** Botão flutuante não abre o modal

**Solução:**
- Verifique se `AssistantRuntimeProviderWrapper` está no layout
- Verifique console do navegador para erros React
- Verifique se `ChatOpenProvider` está envolvendo os componentes

### Streaming não funciona

**Problema:** Mensagem não aparece em tempo real

**Solução:**
- Verifique se o endpoint `/api/assistant/stream/[agent]` está funcionando
- Verifique logs do servidor
- Verifique se há erros no console do navegador
- Teste com `curl`:

```bash
curl -X POST http://localhost:3000/api/assistant/stream/assistant-thread-agent \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Olá!"}],
    "stream_workflows": true
  }'
```

## 📍 Onde Está o Componente

O assistente está configurado em:

1. **Layout**: `app/layout.tsx`
   - Provê o `AssistantRuntimeProviderWrapper`
   - Renderiza `FloatingChatButton` e `ChatModal`

2. **Thread UI**: `components/assistant-ui/thread.tsx`
   - Componente principal da interface de chat
   - Usa `assistant-ui` library

3. **Runtime**: `hooks/use-machina-runtime.tsx`
   - Integra Redux com assistant-ui
   - Faz streaming da Machina API

4. **Redux Store**: `providers/assistant/`
   - Gerencia estado (messages, objects, suggestions)
   - Actions para streaming (`streamAgentExecution`)

## 🔧 Testando Manualmente

### Testar Busca de Agents

```bash
curl -X POST http://localhost:3000/api/assistant/agents \
  -H "Content-Type: application/json" \
  -d '{"filters": {}, "page": 1, "page_size": 10}'
```

### Testar Busca de Workflows

```bash
curl -X POST http://localhost:3000/api/assistant/workflows \
  -H "Content-Type: application/json" \
  -d '{"filters": {}, "page": 1, "page_size": 10}'
```

### Testar Streaming

```bash
curl -N -X POST http://localhost:3000/api/assistant/stream/assistant-thread-agent \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Olá, como você está?"}
    ],
    "stream_workflows": true
  }'
```

Você deve ver output NDJSON em tempo real:

```json
{"type":"start","content":"⚡ Processing...","metadata":{...}}
{"type":"workflow_start","content":"Step 1/3: Chat","metadata":{...}}
{"type":"content","content":"Olá!","metadata":{"partial":true}}
{"type":"done","content":"","metadata":{"objects":[],"suggestions":[]}}
```

## ✅ Checklist de Teste

- [ ] `.env.local` configurado com `MACHINA_API_KEY`
- [ ] Servidor rodando (`npm run dev`)
- [ ] Botão flutuante aparece na tela
- [ ] Modal abre ao clicar no botão
- [ ] Input de mensagem funciona
- [ ] Mensagem do usuário aparece ao enviar
- [ ] Status updates aparecem durante processamento
- [ ] Resposta do assistente aparece chunk por chunk
- [ ] Logs no terminal mostram comunicação com API
- [ ] Console do navegador não mostra erros
- [ ] Objetos aparecem (se houver)
- [ ] Sugestões aparecem (se houver)

---

**Última atualização:** 2025-01-13
**Autor:** Machina Team
