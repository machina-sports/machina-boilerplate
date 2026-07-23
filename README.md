# {{APP_NAME}}

A production-ready Machina AI app starter. It ships a Next.js chat frontend, server-side proxy routes for a Machina project pod, and GitHub Actions for AWS or Azure.

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Set `MACHINA_API_URL` and `MACHINA_API_KEY` to the selected project's Client API. The key is only read by server routes and must never use a `NEXT_PUBLIC_` prefix.

Open [http://localhost:3000](http://localhost:3000). `/` redirects to the chat and `/api/health` reports whether pod credentials are configured without revealing them.

## Architecture

```text
Browser -> Next.js server routes -> Machina project pod
             (API key stays here)      -> agents/workflows/data
```

The starter includes:

- streaming agent chat under `/chat`;
- BFF routes for agents, workflows and threads;
- white-label brand tokens;
- a standalone Docker image;
- frontend staging and production pipelines;
- a production pod deployment workflow.

## Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md). Pipelines are configured through GitHub Environments, variables and secrets; generated repositories do not require workflow edits.

## Create from the CLI

```bash
machina create ai-app "{{APP_NAME}}"
```
