# AI Assistant Setup Guide

The chat UI sends every request through server-side Next.js routes to a Machina project pod. Generated apps do not call a hosted model provider directly.

## Configure the pod

Copy the example environment file:

```bash
cp .env.example .env.local
```

Set the pod URL, the agent that should answer chat requests, and one server-only credential:

```env
MACHINA_API_URL=https://your-project.org.machina.gg
MACHINA_AGENT=machina-assistant-executor

# Use a pod API key:
MACHINA_API_KEY=your_pod_api_key

# Or use the project token minted by `machina login`:
# MACHINA_PROJECT_TOKEN=your_project_token
```

`MACHINA_API_KEY` is sent as `X-Api-Token`. `MACHINA_PROJECT_TOKEN` is sent as `X-Project-Token` and takes precedence when both are set. No pod request carries an `Authorization` header — the Machina middleware does not read one. Never prefix either credential with `NEXT_PUBLIC_`.

## Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000/chat](http://localhost:3000/chat). The health endpoint at `/api/health` reports whether pod credentials are configured without returning their values.

## Architecture

```text
Browser chat
    -> Next.js BFF route
    -> Machina project pod /agent/stream/{MACHINA_AGENT}
    -> agent response streamed back to the browser
```

The browser never receives pod credentials. The shipped chat uses `/api/thread/stream`; `/api/assistant/chat` provides an AI SDK-compatible bridge for programmatic clients. Both routes use the same `lib/pod-auth.ts` authentication helper.

## Choose an agent

Set `MACHINA_AGENT` to the name of an agent installed in the selected project pod. The server chooses this value so a browser cannot redirect chat requests to an arbitrary pod agent.

The sidebar can also list agents and workflows through the server-side routes under `/api/assistant/*`.

## Allow a workflow to be streamed

`/api/thread/stream` signs every upstream call with the server's pod credential, so the target it reaches is decided on the server, never by the browser:

- `type=agent` always streams `MACHINA_AGENT`. A `?target=` sent by the browser is ignored.
- `type=workflow` streams only a name listed verbatim in `MACHINA_WORKFLOWS`, a comma-separated allowlist. An unset or empty list closes the workflow path, and any other name is refused with `403`.

```env
MACHINA_WORKFLOWS=match-recap,player-profile
```

Because matching is exact, a traversal attempt such as `../../agent/stream/other` — in any encoding, including `%2E%2E%2F` — is simply not a member of the list and is refused before the pod is contacted. The allowed name is then percent-encoded into the final path segment, so it can never widen the upstream path.

## Verification

After `npm run build`, run the deterministic local contract checks:

```bash
npm run verify:pod-contract
npm run verify:chat-bridge
```

The bridge verifier starts a local fake pod and launches the built app twice. It verifies both supported credentials, both chat proxy paths, the NDJSON stream, and the `context-agent` message mirror required by agent conditions.

## Troubleshooting

### Pod is not configured

- Confirm `MACHINA_API_URL` is set.
- Set either `MACHINA_API_KEY` or `MACHINA_PROJECT_TOKEN`.
- Set `MACHINA_AGENT` to an agent that exists in that pod.
- Restart the Next.js server after changing `.env.local`.

### 401 or 403 from the pod

- A pod API key must travel as `X-Api-Token`.
- A project token must travel as `X-Project-Token`, not on the `Authorization` header.
- Do not put a project token in `MACHINA_API_KEY`.
- Rotate the credential if it may have been committed or exposed.

### Stream ends without an answer

- Check the Next.js server logs and pod execution trace.
- Confirm the configured agent is active and accepts `messages` in its context.
- Verify the pod returns newline-delimited JSON from `/agent/stream/{agent}`.

## Security

- Keep all credentials server-side and out of browser bundles.
- Send browser requests only to same-origin `/api/*` routes.
- Use separate credentials per environment and rotate them independently.
- Review generated output before using it in production.
