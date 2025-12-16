# Environment Setup

## Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```bash
# Machina API Configuration (Server-side only)
MACHINA_API_URL=https://api-staging.machina.gg
MACHINA_API_KEY=KCPN6Y5mBL33QBjBQ7C9DWi2NfLyXjoedS6DXa44Z_VQbL3Sb5El7UgT9EvtVGeo3WVXCDsckPLXeLwOTbkOiQ
```

## Para Produção

```bash
# Machina API Configuration (Production)
MACHINA_API_URL=https://api.machina.gg
MACHINA_API_KEY=your_production_api_key_here
```

## Notas Importantes

1. **Segurança**: As variáveis sem `NEXT_PUBLIC_` são apenas server-side e não são expostas ao cliente
2. **API Key**: A API Key fornecida é para staging. Para produção, use uma key de produção
3. **Autenticação**: Este app usa `X-Api-Token` header para autenticação (não Authorization Bearer)
4. **Headers**: A Machina API espera `X-Api-Token` (não `Authorization: Bearer`)

## Testando a Configuração

Após configurar as variáveis, reinicie o servidor Next.js:

```bash
npm run dev
```

Verifique os logs do console para confirmar que a API está sendo acessada corretamente:

- `[Agent Search] Using API URL: https://api-staging.machina.gg`
