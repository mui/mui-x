import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { GenerateReactCodeResult, GenerateReactCodeTool, Logger } from '@mui/x-agent-tools';
import { buildCodegenHandler } from './handler';

export interface RegisterCodegenToolDeps {
  tool: GenerateReactCodeTool;
  formatText: (result: GenerateReactCodeResult) => string;
  logger: Logger;
}

/**
 * Register the `generateReactCode` tool on the MCP server. Unlike the docs tools, this needs no
 * network at startup, so it always registers. Both the input and output schemas are advertised so
 * clients can discover and validate the structured result the handler returns.
 */
export function registerCodegenTool(server: McpServer, deps: RegisterCodegenToolDeps): void {
  const { tool, formatText, logger } = deps;

  server.registerTool(
    tool.publicName,
    {
      description: tool.description,
      inputSchema: tool.inputSchema.shape,
      // Advertise the structured output (files, threadId, muiPairing) so clients can discover and
      // validate it; the handler returns a matching `structuredContent` on success.
      outputSchema: tool.outputSchema.shape,
    },
    buildCodegenHandler({ tool, formatText, log: logger }),
  );
}
