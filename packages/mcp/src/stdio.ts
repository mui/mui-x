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
import { fetchRemotePackages } from './docs-packages';
import { buildCombinedLogger } from './logger';
import { registerCodegenTool } from './register-codegen-tool';
import { registerDocsTools } from './register-docs-tools';

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

  // Restrict the docs fetchers to public hosts (plus the configured backends, which may be
  // localhost in dev), so a prompt-injected URL can't make this local server hit internal targets.
  const isUrlAllowed = createDocsUrlGuard([docsBaseUrl, recipesBackendBaseUrl, muiBackendBaseUrl]);

  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // The docs tools need the docs catalog at startup; registerDocsTools isolates them so a
  // docs-backend outage doesn't prevent `generateReactCode` (which doesn't need it) from registering.
  await registerDocsTools(server, {
    createUseMuiDocsTool,
    createFetchDocTool,
    getPackagesList: fetchRemotePackages,
    isUrlAllowed,
    logger,
    concurrency: DOCS_FETCH_CONCURRENCY,
    fetchDocsDescription: FETCH_DOCS_DESCRIPTION,
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

  registerCodegenTool(server, {
    codegenStatic,
    createPerCallTool: ({ onProgress }) =>
      createGenerateReactCodeTool({ ...baseCodegenOpts, onProgress }),
    formatText: formatCodegenText,
    logger,
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
};

main().catch((error: unknown) => {
  // Startup failure path: logger isn't constructed yet, so fall back to bare console.error.
  console.error(STARTUP_ERROR_MESSAGE);
  console.error(error);
  process.exit(1);
});
