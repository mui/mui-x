import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { DocsTools, Logger } from '@mui/x-agent-tools';
import { buildDocsHandler } from './handler';

type FetchDocsTool = DocsTools['fetchDocsTool'];
type UseMuiDocsTool = NonNullable<Awaited<DocsTools['useMuiDocsReady']>>;

/** Register `fetchDocs` (no catalog needed), so it's in the initial tools list before `connect`. */
export function registerFetchDocsTool(
  server: McpServer,
  tool: FetchDocsTool,
  logger: Logger,
): void {
  server.registerTool(
    tool.name,
    { description: tool.description, inputSchema: tool.inputSchema.shape },
    buildDocsHandler(tool, logger),
  );
}

/**
 * Register `useMuiDocs` once the catalog settles (announced via tools/listChanged), or log that it's
 * unavailable when the catalog was unreachable. `fetchDocs` and `generateReactCode` work regardless.
 */
export function registerUseMuiDocsTool(
  server: McpServer,
  tool: UseMuiDocsTool | null,
  logger: Logger,
): void {
  if (!tool) {
    logger(
      'MUI MCP: useMuiDocs is unavailable (docs catalog was unreachable at startup). ' +
        'fetchDocs and generateReactCode still work; restart once the backend recovers.',
    );
    return;
  }

  server.registerTool(
    tool.name,
    { description: tool.description, inputSchema: tool.inputSchema.shape },
    buildDocsHandler(tool, logger),
  );
}
