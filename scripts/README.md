# Scripts

Utility scripts for the Machina Frontend Boilerplate.

## Production and development mode

### `prepare-production.js`

Prepares the boilerplate for production use by removing example files and optional dependencies.

```bash
npm run prepare:production
npm install
```

### `prepare-development.js`

Restores example files and dependencies for development or contribution.

```bash
npm run prepare:development
npm install
```

The files and dependencies managed by both commands are declared in `boilerplate-config.json`.

## Pod contract verification

### `verify-pod-contract.mjs`

Scans tracked setup and runtime files for removed direct-model setup, checks the required environment variables in supported setup docs, and verifies both pod authentication mappings.

It also enforces build-time credential containment, so a pod credential can never end up in a published image layer. The command fails if any tracked file — including the CI snippets the deploy guide hands a reader — writes a pod credential into a dotenv file or passes it as a Docker build arg, if the `Dockerfile` declares one as a build-time `ARG`/`ENV`, or if `.dockerignore` is missing or stops excluding `.env` and its variants from the build context.

```bash
npm run verify:pod-contract
```

### `verify-chat-bridge.mjs`

Starts a local fake Machina pod and the built Next.js app. It checks the shipped `/api/thread/stream` path and the AI SDK-compatible `/api/assistant/chat` path once with each supported credential type.

```bash
npm run build
npm run verify:chat-bridge
```

The command fails unless:

- an API key reaches the pod only as `X-Api-Token`;
- a project token reaches the pod only as `X-Project-Token`;
- neither credential mode sends an `Authorization` header;
- both proxy paths preserve the pod stream;
- chat messages are mirrored under `context-agent`;
- `/api/thread/stream` pins the agent target server-side and refuses every workflow target outside `MACHINA_WORKFLOWS`.

That last group is an exploit regression. The route signs its upstream call with the server's pod credential, so the probes assert that traversal attempts (`%2E%2E%2F`, `..%2F`, and their double-encoded form), absolute URLs, and unlisted workflow names are all refused before the pod is contacted, while the pod still receives exactly the allowlisted workflow and the pinned agent.

For manual debugging, the script also supports separate modes:

```bash
node scripts/verify-chat-bridge.mjs serve
node scripts/verify-chat-bridge.mjs check
```

## Adding scripts

1. Add the script under `scripts/`.
2. Register a command in `package.json` when it is part of the supported workflow.
3. Document its inputs, side effects, and expected result here.
