# `@mui/x-agent-tools`

The building blocks behind MUI's AI agent integrations. It implements the MUI documentation and code-generation tools that host packages expose to AI clients, plus the shared infrastructure they run on: JWT auth, SSRF-guarded fetching, caching, retry, and logging.

## What's inside

- **Docs tools**: `createUseMuiDocsTool` / `createFetchDocTool` build the `useMuiDocs` / `fetchDocs` tools that look up and fetch MUI docs. `fetchRemotePackages` loads the docs catalog.
- **Codegen**: `createGenerateReactCodeTool` generates React + Material UI code from a prompt (POST + buffered SSE). `formatCodegenText` renders the result for a text client.
- **Auth**: `CliJwtClient` exchanges a `MUI_RECIPES_API_KEY` for a short-lived JWT (in-memory cache, refresh window, concurrent-call dedup).
- **Utils**: `LRUCache`, `withRetry`, `buildCombinedLogger`, and `createDocsUrlGuard` (the SSRF allowlist for docs fetches).

## Usage

A host wires the pieces together. Minimal sketch:

```ts
import { CliJwtClient, createGenerateReactCodeTool } from '@mui/x-agent-tools';

const jwt = new CliJwtClient({ muiBackendBaseUrl });

const codegen = createGenerateReactCodeTool({
  recipesBackendBaseUrl,
  getToken: (opts) => jwt.getToken(opts),
  invalidateToken: () => jwt.invalidate(),
});

const result = await codegen.execute({ prompt: 'Build a product card' }, { signal });
```

Every tool exposes `{ name, publicName, description, inputSchema, outputSchema, execute(input, ctx?) }`, where `ctx` carries an optional `signal` and `onProgress`. See [@mui/mcp](../mcp/src/) for a full host wiring.

## Development

```bash
pnpm test:unit --project "@mui/x-agent-tools" --run
pnpm --filter "@mui/x-agent-tools" run typescript
```

Source layout:

```text
src/
├── auth/       CliJwtClient + authed fetch (JWT exchange, 401 retry)
├── codegen/    generateReactCode: schemas, SSE stream, error mapping, tool
├── docs/       useMuiDocs / fetchDocs, package catalog, SSRF url guard, fetcher
├── utils/      cache (LRU), retry, logger, wrapTool
├── types.ts    shared types (ChatTool, ToolExecutionContext, ...)
└── index.ts    public barrel
```

Built with the standard `code-infra` toolchain and published to npm as `@mui/x-agent-tools`.
