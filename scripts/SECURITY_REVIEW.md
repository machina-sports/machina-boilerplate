# Security Review - Machina Frontend Boilerplate

## Security controls

### Server-side pod credentials

- API routes read `MACHINA_API_KEY` or `MACHINA_PROJECT_TOKEN` only on the server.
- `MACHINA_API_KEY` is sent to the pod as `X-Api-Token`.
- `MACHINA_PROJECT_TOKEN` is sent as `X-Project-Token`.
- No pod request carries an `Authorization` header; the Machina middleware reads only the two headers above.
- Sensitive values never use a `NEXT_PUBLIC_` prefix.
- `.env` and `.env*.local` are ignored by git.

### BFF boundary

External calls are proxied through Next.js routes:

- `/api/assistant/*` proxies agent and workflow requests.
- `/api/thread/*` proxies chat streams and thread data.
- `/api/article/*` proxies article data.

The browser calls same-origin `/api/*` routes and never receives pod credentials.

## Verification checklist

Before deployment, verify:

- [ ] `MACHINA_API_URL` points to the intended project pod.
- [ ] `MACHINA_AGENT` names an agent installed in that pod.
- [ ] Exactly one of `MACHINA_API_KEY` or `MACHINA_PROJECT_TOKEN` is configured.
- [ ] No sensitive variable uses a `NEXT_PUBLIC_` prefix.
- [ ] No credentials are committed in source, docs, images, or logs.
- [ ] Client-side code does not call the pod directly.
- [ ] `npm run verify:pod-contract` passes.
- [ ] `npm run verify:chat-bridge` passes after the production build.

## Production environment

```bash
MACHINA_API_URL=https://your-project.org.machina.gg
MACHINA_AGENT=machina-assistant-executor

# Choose one:
MACHINA_API_KEY=your_pod_api_key
# MACHINA_PROJECT_TOKEN=your_project_token
```

Use separate credentials for each environment and rotate them independently. If a credential appears in a committed file, revoke it instead of only deleting the text.
