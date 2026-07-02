import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { DocsTools, Logger } from '@mui/x-agent-tools';
import { buildDocsHandler } from './handler';

export interface RegisterDocsToolsDeps extends DocsTools {
  logger: Logger;
}

/**
 * Register the docs tools the toolset produced. `fetchDocs` always registers; `useMuiDocs` registers
 * only when the catalog was reachable (`null` otherwise). Called after `server.connect`, so both
 * reach clients via tools/listChanged.
 */
export function registerDocsTools(server: McpServer, deps: RegisterDocsToolsDeps): void {
  const { fetchDocsTool, useMuiDocsTool, logger } = deps;

  server.registerTool(
    fetchDocsTool.name,
    { description: fetchDocsTool.description, inputSchema: fetchDocsTool.inputSchema.shape },
    buildDocsHandler(fetchDocsTool, logger),
  );

  if (useMuiDocsTool) {
    server.registerTool(
      useMuiDocsTool.name,
      { description: useMuiDocsTool.description, inputSchema: useMuiDocsTool.inputSchema.shape },
      buildDocsHandler(useMuiDocsTool, logger),
    );
    return;
  }

  logger(
    'MUI MCP: useMuiDocs is unavailable (docs catalog was unreachable at startup). ' +
      'fetchDocs and generateReactCode still work; restart once the backend recovers.',
  );
}
