# Lista de Perguntas para Teste - Machina Assistant

Esta lista contém perguntas organizadas por categoria para testar a integração com a Machina API.

## 🎯 Perguntas Básicas (Teste Inicial)

1. **Olá, como você está?**
   - **Esperado:** Resposta amigável do assistente
   - **Valida:** Conexão básica, streaming funcionando

2. **Qual é o seu nome?**
   - **Esperado:** Nome do agent (ex: "SportingBOT", "assistant-thread-agent")
   - **Valida:** Identificação do agent

3. **O que você pode fazer?**
   - **Esperado:** Lista de capacidades do agent
   - **Valida:** Descrição do agent

## 📊 Perguntas sobre Documentos/Conteúdo

4. **Quais documentos você tem acesso?**
   - **Esperado:** Lista de documentos disponíveis
   - **Valida:** Integração com sistema de documentos

5. **Me mostre o documento sobre [tema específico]**
   - **Esperado:** Conteúdo do documento solicitado
   - **Valida:** Busca e recuperação de documentos

6. **Resuma o documento [ID ou nome]**
   - **Esperado:** Resumo do documento
   - **Valida:** Processamento de documentos

## 🔍 Perguntas sobre Workflows

7. **Quais workflows estão disponíveis?**
   - **Esperado:** Lista de workflows
   - **Valida:** Integração com `/workflow/search`

8. **Execute o workflow [nome]**
   - **Esperado:** Execução do workflow com progresso
   - **Valida:** Streaming de workflows, status updates

9. **Qual é o status do workflow [nome]?**
   - **Esperado:** Status atual do workflow
   - **Valida:** Consulta de status

## 💬 Perguntas de Conversação (Thread)

10. **Meu nome é João. Qual é o seu nome?**
    - **Esperado:** Resposta com nome do agent
    - **Valida:** Thread mantém contexto

11. **Você lembra qual é o meu nome?**
    - **Esperado:** "Seu nome é João"
    - **Valida:** Memória do thread, contexto mantido

12. **O que conversamos antes?**
    - **Esperado:** Resumo da conversa anterior
    - **Valida:** Histórico de mensagens no thread

## 🎲 Perguntas que Geram Objetos (Markets, Bets, etc)

13. **Me mostre os mercados disponíveis**
    - **Esperado:** Lista de objetos (markets) estruturados
    - **Valida:** Retorno de `objects[]` no metadata

14. **Quais são as odds para [evento]?**
    - **Esperado:** Objetos com odds estruturadas
    - **Valida:** Formatação de objetos complexos

15. **Crie uma aposta para [evento]**
    - **Esperado:** Objeto de bet criado
    - **Valida:** Criação de objetos via API

## 🔄 Perguntas que Testam Streaming

16. **Conte uma história longa sobre futebol**
    - **Esperado:** Texto aparecendo chunk por chunk
    - **Valida:** Streaming em tempo real, chunks `content`

17. **Faça uma busca detalhada sobre [tema]**
    - **Esperado:** Status updates durante busca, depois resultado
    - **Valida:** `status_update`, `workflow_start`, `workflow_complete`

18. **Processe esta informação: [texto longo]**
    - **Esperado:** Processamento com múltiplos workflows
    - **Valida:** Progresso de workflows (`Step 1/3`, etc)

## ❓ Perguntas que Geram Sugestões

19. **O que você pode fazer?**
    - **Esperado:** Resposta + sugestões de próximas ações
    - **Valida:** Retorno de `suggestions[]` no metadata

20. **Me ajude com [tarefa]**
    - **Esperado:** Resposta + sugestões relacionadas
    - **Valida:** Sugestões contextuais

## 🐛 Perguntas para Testar Erros

21. **Execute um workflow que não existe**
    - **Esperado:** Mensagem de erro amigável
    - **Valida:** Tratamento de erros, tipo `error`

22. **Busque um documento inexistente**
    - **Esperado:** Mensagem informando que não foi encontrado
    - **Valida:** Erros 404 tratados corretamente

23. **Faça algo impossível**
    - **Esperado:** Resposta educada explicando limitações
    - **Valida:** Tratamento de casos edge

## 🔐 Perguntas para Testar Autenticação

24. **Acesse informações privadas**
    - **Esperado:** Resposta respeitando permissões
    - **Valida:** Autenticação via `X-Api-Token`

## 📝 Perguntas Complexas (Múltiplos Workflows)

25. **Analise este texto e me dê um resumo: [texto]**
    - **Esperado:** Múltiplos workflows executando em sequência
    - **Valida:** Progresso (`Step 1/3`, `Step 2/3`, etc)

26. **Busque informações sobre [tema] e me mostre os resultados**
    - **Esperado:** Workflow de busca + workflow de formatação
    - **Valida:** Sequência de workflows

## 🎨 Perguntas para Testar Formatação

27. **Me mostre uma lista formatada de [itens]**
    - **Esperado:** Lista formatada com markdown ou HTML
    - **Valida:** Renderização de conteúdo formatado

28. **Crie uma tabela com [dados]**
    - **Esperado:** Tabela estruturada
    - **Valida:** Objetos estruturados

## 🔄 Perguntas Sequenciais (Teste de Thread)

29. **Primeira pergunta: Qual é a capital do Brasil?**
    - **Esperado:** "Brasília"

30. **Segunda pergunta: E do estado de São Paulo?**
    - **Esperado:** "São Paulo" (mantendo contexto)

31. **Terceira pergunta: E qual é a população de ambas?**
    - **Esperado:** Informações sobre Brasília e São Paulo
    - **Valida:** Thread mantém contexto de múltiplas mensagens

## 📋 Checklist de Validação

Ao testar, verifique:

- [ ] **Streaming funciona:** Texto aparece em tempo real (chunk por chunk)
- [ ] **Status updates aparecem:** Mensagens como "⏳ Processando..." aparecem
- [ ] **Progresso de workflows:** "Step 1/3", "Step 2/3" aparecem
- [ ] **Objetos são retornados:** `objects[]` aparece no metadata quando aplicável
- [ ] **Sugestões aparecem:** `suggestions[]` aparece no final da resposta
- [ ] **Thread mantém contexto:** Conversas anteriores são lembradas
- [ ] **Erros são tratados:** Mensagens de erro amigáveis aparecem
- [ ] **Logs no console:** Mensagens `[MachinaStreamAdapter]` aparecem
- [ ] **Logs no servidor:** Mensagens `[Thread Stream]` aparecem no terminal
- [ ] **Performance:** Resposta começa em < 2 segundos

## 🎯 Ordem Recomendada de Teste

1. **Comece com perguntas básicas** (#1-3)
2. **Teste streaming** (#16-18)
3. **Teste objetos** (#13-15)
4. **Teste thread/contexto** (#10-12, #29-31)
5. **Teste workflows** (#7-9, #25-26)
6. **Teste erros** (#21-23)
7. **Teste sugestões** (#19-20)

## 📊 O Que Observar nos Logs

### Console do Navegador:

```
[MachinaStreamAdapter] Messages received: 1
[MachinaStreamAdapter] Last message: {...}
[MachinaStreamAdapter] Request body: {...}
[MachinaStreamAdapter] Received chunk: {type: 'start', ...}
[MachinaStreamAdapter] Received chunk: {type: 'content', ...}
[MachinaStreamAdapter] ✓✓✓ DONE signal received!
```

### Terminal (Servidor):

```
[Thread Stream] Target: assistant-thread-agent Type: agent
[Thread Stream] Calling endpoint: https://api-staging.machina.gg/agent/stream/assistant-thread-agent
```

### Resposta Esperada (NDJSON):

```json
{"type":"start","content":"⚡ Processing...","metadata":{...}}
{"type":"workflow_start","content":"Step 1/3: Chat Reasoning","metadata":{...}}
{"type":"status_update","content":"⏳ Processando...","metadata":{...}}
{"type":"content","content":"Olá!","metadata":{"partial":true}}
{"type":"content","content":" Como posso","metadata":{"partial":true}}
{"type":"done","content":"","metadata":{"content":"...","objects":[],"suggestions":[]}}
```

---

**Última atualização:** 2025-01-13
**Autor:** Machina Team
