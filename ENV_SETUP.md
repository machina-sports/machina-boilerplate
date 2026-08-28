# Environment Setup

## Variaveis obrigatorias

Copie `.env.example` para `.env.local` e configure o pod, o agente e uma credencial server-side:

```bash
MACHINA_API_URL=https://your-project.org.machina.gg
MACHINA_AGENT=machina-assistant-executor

# Use uma API key do pod:
MACHINA_API_KEY=your_pod_api_key

# Ou use o project token gerado por `machina login`:
# MACHINA_PROJECT_TOKEN=your_project_token
```

Use apenas uma credencial. Se ambas estiverem configuradas, `MACHINA_PROJECT_TOKEN` tem precedencia.

## Contrato de autenticacao

- `MACHINA_API_KEY` e enviado no header `X-Api-Token`.
- `MACHINA_PROJECT_TOKEN` e enviado no header `Authorization: Bearer <token>`.
- Nenhuma credencial pode usar o prefixo `NEXT_PUBLIC_`.
- Use valores e credenciais separados para staging e producao.

## Testando a configuracao

Reinicie o servidor apos alterar `.env.local`:

```bash
npm run dev
```

Abra `/api/health` e confirme que `podConfigured` e `true`. Depois envie uma mensagem em `/chat` e confira os logs do servidor Next.js se o pod rejeitar a requisicao.
