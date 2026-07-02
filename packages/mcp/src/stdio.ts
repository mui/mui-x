#!/usr/bin/env node
import { join } from 'node:path';
import { homedir } from 'node:os';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SERVER_VERSION } from './version';
import { registerCodegenTool } from './codegen/register';
import { registerDocsTools } from './docs/register';

const SERVER_NAME = 'mui-mcp';

/** Local log file; ~/.mui-mcp.log. Tail with `tail -f ~/.mui-mcp.log`. */
const DEFAULT_LOG_PATH = join(homedir(), '.mui-mcp.log');

const main = async () => {
  const { resolveAgentToolsConfig, createMuiAgentToolset, buildCombinedLogger, formatCodegenText } =
    await import('@mui/x-agent-tools');

  const logger = buildCombinedLogger(DEFAULT_LOG_PATH);

  // The lib owns backend config, the SSRF guard, catalog retry, and the fail-soft policy; this host
  // only maps the tools onto MCP.
  const toolset = createMuiAgentToolset(resolveAgentToolsConfig(), {
    logger,
    fetchDocsDescription: `Fetch documentation for one or more URLs extracted from previous tool calls responses. The URLs should be passed as an array in the "urls" argument.`,
  });

  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

  // Codegen needs no network at startup, so register it first and connect right away.
  registerCodegenTool(server, {
    tool: toolset.codegenTool,
    formatText: formatCodegenText,
    logger,
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Docs tools arrive after the catalog fetch (fetchDocs always; useMuiDocs only if the catalog was
  // reachable), announced via tools/listChanged so a slow backend never blocks startup or codegen.
  const { fetchDocsTool, useMuiDocsTool } = await toolset.docsToolsReady;
  registerDocsTools(server, { fetchDocsTool, useMuiDocsTool, logger });
};

main().catch((error: unknown) => {
  // Startup failure: the combined logger may not exist yet, so fall back to bare console.error.
  console.error(
    '\n\x1b[1mAn error was encountered while starting the MCP server.\x1b[0m\n\nPlease share the error details and your setup information in the "docs-feedback" channel of the official Discord server: \x1b[1mhttps://mui.com/r/discord\x1b[0m.\n',
  );
  console.error(error);
  process.exit(1);
});
