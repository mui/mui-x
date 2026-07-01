# `@mui/mcp`

MUI's [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server. Exposes MUI documentation and code-generation tools to any MCP-capable AI client (Claude Code, Cursor, Zed, Continue, etc.) so an agent can answer MUI questions with real, up-to-date docs and generate React + Material UI code.

## What it exposes

Three stdio-based tools, backed by [@mui/x-agent-tools](../x-agent-tools/):

- `useMuiDocs(sources)` : returns the docs catalog (URLs + summaries) for one or more MUI packages (for example `@mui/material`, `@mui/x-data-grid`). Each source is an llms.txt URL or a bare package name. Agents typically use this first to find the right docs page.
- `fetchDocs(urls)` : fetches the full content of one or more docs URLs (typically taken from a `useMuiDocs` response).
- `generateReactCode({ prompt, threadId?, designContext?, muiPairing?, model?, mode?, images? })` : generates React + Material UI code from a natural-language prompt (optionally grounded in a Figma frame). Returns the generated files plus a short explanation. Requires `MUI_RECIPES_API_KEY`. Pass `threadId` back on subsequent calls to keep multi-turn conversations on the same chat. Pass `muiPairing` to target a specific MUI / MUI X major (see [Targeting a MUI version](#targeting-a-mui-version)). `mode` and `images` are experimental and may change.

## Quick start

```bash
pnpm install                          # once, from repo root
pnpm --filter @mui/mcp build:local    # builds @mui/x-agent-tools first, then @mui/mcp -> build/stdio.js
```

Smoke test:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"0.1"}}}' \
  | node packages/mcp/build/stdio.js
```

Expected: `serverInfo: { name: "mui-mcp", version: "0.x.0" }` and the supported `capabilities`.

## Connecting an MCP client

**Available env vars** (all set via your client's config below):

- `MUI_DOCS_BASE_URL` (optional, default `https://chat-backend.mui.com`): docs-catalog API base URL. Override when developing against a local backend.
- `MUI_RECIPES_API_KEY` (required for `generateReactCode`): API key created at console.mui.com/products/recipes/api-keys. The server exchanges it for a short-lived JWT on the first call and caches the JWT in memory. The docs tools above keep working without it; only codegen requires it.
- `MUI_BACKEND_BASE_URL` (optional, default `https://api.mui.com`): mui-backend base URL (where API-key → JWT exchange happens). Override for local dev, typically `http://localhost:5002`.
- `MUI_RECIPES_BACKEND_BASE_URL` (optional, default `https://chat-backend.mui.com`): recipes-backend base URL (where codegen runs). Override for local dev, typically `http://localhost:5003`.

### Claude Code CLI (simplest)

```bash
claude mcp add mui-local \
  -e MUI_RECIPES_API_KEY=recipes_cli_... \
  -e MUI_BACKEND_BASE_URL=http://localhost:5002 \
  -e MUI_RECIPES_BACKEND_BASE_URL=http://localhost:5003 \
  -e MUI_DOCS_BASE_URL=http://localhost:5003 \
  -- node /absolute/path/to/mui-x/packages/mcp/build/stdio.js
```

Drop any `-e` line you don't need (codegen is the only tool that requires an API key). The `--` separator is required when passing env vars. Verify with `claude mcp list`; remove with `claude mcp remove mui-local`. Writes to your personal `~/.claude.json`, never to the repo's shared `.mcp.json`.

Test prompts:

- Docs lookup:
  > Use `useMuiDocs` to look up the docs catalog for `@mui/material`. Then fetch the most relevant URL and summarize the `Button` component API.
- Codegen (requires `MUI_RECIPES_API_KEY`):
  > Use `generateReactCode` to build a Tomato product card with image, title, price, and an Add-to-cart button.

### Claude Desktop / Cursor / other JSON-config clients

Edit the client's config file (`~/Library/Application Support/Claude/claude_desktop_config.json` for Claude Desktop, `~/.cursor/mcp.json` for Cursor, etc.):

```json
{
  "mcpServers": {
    "mui-local": {
      "command": "node",
      "args": ["/absolute/path/to/mui-x/packages/mcp/build/stdio.js"],
      "env": {
        "MUI_RECIPES_API_KEY": "recipes_cli_...",
        "MUI_BACKEND_BASE_URL": "http://localhost:5002",
        "MUI_RECIPES_BACKEND_BASE_URL": "http://localhost:5003",
        "MUI_DOCS_BASE_URL": "http://localhost:5003"
      }
    }
  }
}
```

Drop any `env` key you don't need (only codegen requires `MUI_RECIPES_API_KEY`). Restart the client.

### MCP Inspector (debug, no client setup needed)

​`bash
pnpm --filter @mui/mcp mcp-inspector
​`

Builds the server, then opens a web UI to call tools and inspect responses in isolation.

## Targeting a MUI version

`generateReactCode` accepts a `muiPairing` field to target a specific MUI / MUI X major. The shape mirrors the version picker on recipes.mui.com:

```ts
muiPairing: {
  material: 'v5' | 'v6' | 'v7' | 'v9',     // Material UI core; v8 was skipped
  muiX: 'v5' | 'v6' | 'v7' | 'v8' | 'v9'   // MUI X products (DataGrid, DatePickers, etc.)
}
```

**Default when omitted**: latest stable pairing (`{ material: 'v9', muiX: 'v9' }` today). Generation stays current with whatever the backend treats as latest.

**Agents should detect and pass** `muiPairing` **for projects pinned to older majors.** Read the project's `package.json`, look at `@mui/material` and `@mui/x-data-grid` ranges, and forward the matching pair. A project pinned to `@mui/material ^7.x` + `@mui/x-data-grid ^8.x` should send `{ material: 'v7', muiX: 'v8' }`. Without this, the agent will silently get v9 code on a v7 codebase.

Example MCP client prompt the host can ship as a guideline:

> Before calling `generateReactCode`, read `package.json` and look up `@mui/material` and `@mui/x-data-grid` (or `@mui/x-data-grid-premium` / `@mui/x-date-pickers`). Pass the detected majors as `muiPairing`. Omit it only if no MUI dependencies are present.

### Response footer

Every successful call returns the **effective pairing** on the result (and in the rendered text footer), even when the caller omitted `muiPairing`. Use this to confirm what the backend actually applied:

```text
threadId: `chat-abc123` (pass on follow-up calls to continue this conversation).
muiPairing: `v7` + `v8` (effective targeting)
```

- Caller provided a pairing → echoes it back.
- Caller omitted on a follow-up → returns the thread's locked pairing.
- Caller omitted on a new thread → returns the resolver's default (currently `v9` + `v9`).

## Tips for best results

### Boost agent tool selection in your project

When prompts don't explicitly name `generateReactCode`, hosts like Claude Code Agent (WebStorm/Cursor) sometimes pick built-in file-edit tools instead of the MCP, even on prompts that are clearly about Material UI. To nudge selection in your project, drop the following into your repo's `CLAUDE.md` (or your host's equivalent project-config file):

```markdown
## Generating Material UI components

When the user asks to create, scaffold, or implement a Material UI / MUI component or page, prefer the `generateReactCode` MCP tool over writing the component from scratch with `Edit` / `Write`. It stays current with MUI v7 idioms (Grid not Grid2, current MUI X DataGrid props) and grounds in Figma context when available.

Before calling `generateReactCode`, read `package.json` to detect the project's MUI majors (`@mui/material`, `@mui/x-data-grid`) and pass them as `muiPairing` so the generated code matches the installed versions.
```

This compounds with the tool's prescriptive description: the per-project hint reaches the agent in places the global description doesn't.

### What the agent will do with the output

Across the MCP-host UIs we've tested (Claude Code Agent in WebStorm), the host agent treats `generateReactCode`'s output as a structured suggestion rather than a verbatim file dump. Expect:

- `App.tsx` **is usually discarded or replaced.** The MCP emits an entry-file wrapper alongside the component. Host agents drop it when the project already has a host shell (Next.js page, Vite `main.tsx`, Storybook story, etc.).
- **Component filenames get renamed to match project conventions.** `components/ContactForm.tsx` may become `contact-form.tsx`; PascalCase may become kebab-case. The `filename` we emit is advisory.
- **Component bodies stay intact.** When the agent does adapt, it adjusts wrappers and paths, not the React code itself.
- **Stack-mismatch warnings surface before writing.** On non-MUI projects (Radix, Tailwind-only, etc.) the agent typically asks before writing MUI-importing code, or surfaces a caveat. This is correct, conservative behavior.

If you're building an integration around `generateReactCode`, design for "the agent will adapt the shell, keep the body" rather than "write all returned files verbatim."

## Development

Tool implementations live in [@mui/x-agent-tools](../x-agent-tools/). This package is a thin SDK wrapper that registers them over the MCP protocol.

Dev loop: edit `src/`, rebuild, restart your MCP client (Inspector reloads automatically). `build:local`
also rebuilds `@mui/x-agent-tools` when you change it (skipped when unchanged).

```bash
pnpm --filter @mui/mcp build:local
```

Source layout:

```text
packages/mcp/
├── src/
│   ├── stdio.ts            # entry: builds the server and registers the tools
│   ├── constants.ts        # shared constants (name, version, env vars, defaults)
│   ├── logger.ts           # combined stderr + ~/.mui-mcp.log logger
│   ├── docs/
│   │   ├── packages.ts     # fetchRemotePackages: the MUI docs catalog source
│   │   ├── handler.ts      # adapts the docs tools to MCP handlers
│   │   └── register.ts     # builds + registers useMuiDocs / fetchDocs
│   └── codegen/
│       ├── handler.ts      # adapts generateReactCode to an MCP handler
│       ├── progress.ts     # forwards codegen progress as MCP notifications
│       └── register.ts     # builds + registers generateReactCode
├── build/                  # code-infra build output, gitignored; build/stdio.js is what clients spawn
├── package.json
└── tsconfig.json
```

Built with the standard `code-infra` toolchain. The docs/codegen logic lives in [@mui/x-agent-tools](../x-agent-tools/), a published dependency that pnpm links from its `build/` output, so it must be built first: the `build:local` script (`pnpm --filter @mui/mcp build:local`, which expands to `pnpm --filter "@mui/mcp..." build`) handles that.

## Publishing

Published to npm as [@mui/mcp](https://www.npmjs.com/package/@mui/mcp). End users consume it via `npx` (no local build), pointing at the published version:

```json
{ "mcpServers": { "mui": { "command": "npx", "args": ["-y", "@mui/mcp"] } } }
```

## Troubleshooting

- **Client doesn't see the server.** Verify the path in your client's config is absolute and points at the actual built file. Restart the client after editing config.
- `MUI_DOCS_BASE_URL` **errors.** Default backend may be cold-starting (Render free tier). Wait a few seconds and retry, or point at a local backend via env var.
- `Missing API key` **from** `generateReactCode`**.** Set `MUI_RECIPES_API_KEY` in your client's env. Create a key at console.mui.com/products/recipes/api-keys.
- `Token exchange failed` **/ 401 on codegen.** Check `MUI_BACKEND_BASE_URL`. Default is `https://api.mui.com`; for local mui-backend, set it to `http://localhost:5002`. A 401 also means the API key was revoked: create a new one.
- `Generation stream ended unexpectedly` **on codegen.** The recipes-backend SSE was truncated mid-stream (transient proxy hangup, backend restart, etc.). Retry.
