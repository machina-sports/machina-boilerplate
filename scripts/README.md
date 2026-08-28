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
- chat messages are mirrored under `context-agent`.

For manual debugging, the script also supports separate modes:

```bash
node scripts/verify-chat-bridge.mjs serve
node scripts/verify-chat-bridge.mjs check
```

## Adding scripts

1. Add the script under `scripts/`.
2. Register a command in `package.json` when it is part of the supported workflow.
3. Document its inputs, side effects, and expected result here.
