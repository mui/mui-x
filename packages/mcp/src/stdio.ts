#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  DEFAULT_DOCS_BASE_URL,
  DEFAULT_MUI_BACKEND_BASE_URL,
  DEFAULT_RECIPES_BACKEND_BASE_URL,
  DOCS_BASE_URL_ENV,
  DOCS_FETCH_CONCURRENCY,
  FETCH_DOCS_DESCRIPTION,
  MUI_BACKEND_BASE_URL_ENV,
  RECIPES_BACKEND_BASE_URL_ENV,
  SERVER_NAME,
  SERVER_VERSION,
  STARTUP_ERROR_MESSAGE,
} from './constants';
import { fetchRemotePackages } from './docs/packages';
import { buildCombinedLogger } from './logger';
import { registerCodegenTool } from './codegen/register';
import { registerDocsTools } from './docs/register';

const main = async () => {
  const {
    createUseMuiDocsTool,
    createFetchDocTool,
    createGenerateReactCodeTool,
    createDocsUrlGuard,
    CliJwtClient,
    formatCodegenText,
  } = await import('@mui/x-agent-tools');

  const logger = buildCombinedLogger();

  const docsBaseUrl = process.env[DOCS_BASE_URL_ENV] ?? DEFAULT_DOCS_BASE_URL;
  const muiBackendBaseUrl = process.env[MUI_BACKEND_BASE_URL_ENV] ?? DEFAULT_MUI_BACKEND_BASE_URL;
  const recipesBackendBaseUrl =
    process.env[RECIPES_BACKEND_BASE_URL_ENV] ?? DEFAULT_RECIPES_BACKEND_BASE_URL;

  // Docs fetchers may only reach MUI docs origins + the configured docs base URL. The auth/codegen
  // backends are excluded on purpose: the docs tools never fetch from them.
  const isUrlAllowed = createDocsUrlGuard([docsBaseUrl], logger);

  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // JWT client is eager; API key only resolved on first `getToken()`.
  const jwtClient = new CliJwtClient({ muiBackendBaseUrl });
  const baseCodegenOpts = {
    recipesBackendBaseUrl,
    getToken: () => jwtClient.getToken(),
    invalidateToken: () => jwtClient.invalidate(),
    logger,
  };
  // Static tool only for registration metadata; per-call tool is built per request below.
  const codegenStatic = createGenerateReactCodeTool(baseCodegenOpts);

  // Codegen needs no network at startup, so register it first and connect right away.
  registerCodegenTool(server, {
    codegenStatic,
    createPerCallTool: ({ onProgress, signal }) =>
      createGenerateReactCodeTool({ ...baseCodegenOpts, onProgress, signal }),
    formatText: formatCodegenText,
    logger,
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Register the docs tools after connecting. They depend on the docs catalog, so a slow, cold, or
  // unreachable backend now delays only the docs tools (they appear via tools/listChanged once
  // ready) instead of blocking startup or `generateReactCode`.
  await registerDocsTools(server, {
    createUseMuiDocsTool,
    createFetchDocTool,
    getPackagesList: fetchRemotePackages,
    isUrlAllowed,
    logger,
    concurrency: DOCS_FETCH_CONCURRENCY,
    fetchDocsDescription: FETCH_DOCS_DESCRIPTION,
  });
};

main().catch((error: unknown) => {
  // Startup failure path: logger isn't constructed yet, so fall back to bare console.error.
  console.error(STARTUP_ERROR_MESSAGE);
  console.error(error);
  process.exit(1);
});
