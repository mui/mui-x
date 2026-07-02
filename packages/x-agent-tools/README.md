# `@mui/x-agent-tools`

The building blocks behind MUI's AI agent integrations. It implements the MUI documentation and code-generation tools that host packages expose to AI clients, plus the shared infrastructure they run on: JWT auth, SSRF-guarded fetching, caching, retry, and logging.

This is a library used by host packages such as [@mui/mcp](../mcp/), not something end users install directly.

## What's inside

- **Composition layer**: `resolveAgentToolsConfig` reads the backend config from env vars, and `createMuiAgentToolset` assembles the full toolset (SSRF guard, catalog retry, fail-soft, shared cache/queue baked in). The recommended entry point for a host.
- **Docs tools**: `createDocsTools` builds the `useMuiDocs` / `fetchDocs` tools that look up and fetch MUI docs (`createUseMuiDocsTool` / `createFetchDocTool` are the lower-level factories). `fetchRemotePackages` loads the docs catalog.
- **Codegen**: `createCodegenTool` generates React + Material UI code from a prompt (POST + buffered SSE). `formatCodegenText` renders the result for a text client.
- **Auth**: `ApiKeyJwtClient` exchanges a `MUI_RECIPES_API_KEY` for a short-lived JWT (in-memory cache, refresh window, concurrent-call dedup).
- **Utils**: `LRUCache`, `buildCombinedLogger`, and `createDocsUrlGuard` (the SSRF allowlist for docs fetches).

## Usage

A host composes the toolset and adapts it to its protocol. Minimal sketch:

```ts
import { resolveAgentToolsConfig, createMuiAgentToolset } from '@mui/x-agent-tools';

const toolset = createMuiAgentToolset(resolveAgentToolsConfig(), { logger });

// Ready immediately; needs no network at startup.
const result = await toolset.codegenTool.execute({ prompt: 'Build a product card' }, { signal });

// Resolves once the docs catalog fetch settles; never rejects (fail-soft).
const { fetchDocsTool, useMuiDocsTool } = await toolset.docsToolsReady;
// useMuiDocsTool is null when the catalog was unreachable; fetchDocsTool always works.
```

Every tool exposes `{ name, description, inputSchema, outputSchema, execute(input, ctx?) }`, where `ctx` carries an optional `signal` and `onProgress`. `execute` validates its input against `inputSchema`, so hosts don't need a validation layer of their own. See [@mui/mcp](../mcp/src/) for a full host wiring.

## Development

```bash
pnpm test:unit --project "@mui/x-agent-tools" --run
pnpm --filter "@mui/x-agent-tools" run typescript
```

Source layout:

```text
src/
├── auth/       ApiKeyJwtClient + authed fetch (JWT exchange, 401 retry)
├── codegen/    generateReactCode: schemas, SSE stream, error mapping, tool, builder
├── docs/       useMuiDocs / fetchDocs, package catalog, SSRF url guard, fetcher, builder
├── utils/      cache (LRU), retry, logger, wrapTool
├── config.ts   env var names, backend defaults, resolveAgentToolsConfig
├── toolset.ts  createMuiAgentToolset (composes the codegen + docs builders)
├── types.ts    shared types (AgentTool, ToolExecutionContext, ...)
└── index.ts    public barrel
```

Built with the standard `code-infra` toolchain and published to npm as `@mui/x-agent-tools`.
