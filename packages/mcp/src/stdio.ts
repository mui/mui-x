#!/usr/bin/env node
import { join } from 'node:path';
import { homedir } from 'node:os';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SERVER_VERSION } from './version';
import { registerCodegenTool } from './codegen/register';
import { registerFetchDocsTool, registerUseMuiDocsTool } from './docs/register';

const SERVER_NAME = 'mui-mcp';

/** Local log file; ~/.mui-mcp.log. Tail with `tail -f ~/.mui-mcp.log`. */
const DEFAULT_LOG_PATH = join(homedir(), '.mui-mcp.log');

const main = async () => {
  // Loaded here, not at top level, so a failure loading the lib hits main().catch below
  // (friendly startup error) instead of an uncaught crash at module load.
  const { resolveAgentToolsConfig, createMuiAgentToolset, buildCombinedLogger, formatCodegenText } =
    await import('@mui/x-agent-tools');

  const logger = buildCombinedLogger(DEFAULT_LOG_PATH);

  // Cancel the background catalog load when the client disconnects, so a pending retry backoff can't
  // keep the process alive after the transport closes.
  const shutdown = new AbortController();

  // The lib owns backend config, the SSRF guard, catalog retry, and the fail-soft policy; this host
  // only maps the tools onto MCP.
  const toolset = await createMuiAgentToolset(resolveAgentToolsConfig(), {
    logger,
    signal: shutdown.signal,
    fetchDocsDescription: `Fetch documentation for one or more URLs extracted from previous tool calls responses. The URLs should be passed as an array in the "urls" argument.`,
  });

  const server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });

  // Codegen and fetchDocs need no catalog, so register both and connect right away.
  registerCodegenTool(server, {
    tool: toolset.codegenTool,
    formatText: formatCodegenText,
    logger,
  });
  registerFetchDocsTool(server, toolset.fetchDocsTool, logger);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // On disconnect, cancel the background catalog load and tear down the docs cache/queue,
  // chained so the SDK's own close handling still runs.
  const sdkOnClose = transport.onclose;
  transport.onclose = () => {
    shutdown.abort();
    toolset.dispose();
    sdkOnClose?.();
  };

  // useMuiDocs needs the catalog; register it when that settles (or log if unreachable), announced
  // via tools/listChanged so a slow or hung backend never blocks startup, codegen, or fetchDocs.
  registerUseMuiDocsTool(server, await toolset.useMuiDocsReady, logger);
};

main().catch((error: unknown) => {
  // Startup failure: the combined logger may not exist yet, so fall back to bare console.error.
  console.error(
    '\n\x1b[1mAn error was encountered while starting the MCP server.\x1b[0m\n\nPlease share the error details and your setup information in the "docs-feedback" channel of the official Discord server: \x1b[1mhttps://mui.com/r/discord\x1b[0m.\n',
  );
  console.error(error);
  process.exit(1);
});
