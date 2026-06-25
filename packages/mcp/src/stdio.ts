#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { z } from 'zod';
import {
  DEFAULT_MUI_BACKEND_BASE_URL,
  DEFAULT_RECIPES_BACKEND_BASE_URL,
  DOCS_FETCH_CONCURRENCY,
  FETCH_DOCS_DESCRIPTION,
  MUI_BACKEND_BASE_URL_ENV,
  RECIPES_BACKEND_BASE_URL_ENV,
  SERVER_NAME,
  SERVER_VERSION,
  STARTUP_ERROR_MESSAGE,
} from './constants';
import { buildCodegenHandler } from './codegen-handler';
import { buildDocsHandler } from './docs-handler';
import { fetchRemotePackages } from './docs-packages';
import { buildCombinedLogger } from './logger';

const main = async () => {
  const {
    createUseMuiDocsTool,
    createFetchDocTool,
    createGenerateReactCodeTool,
    CliJwtClient,
    formatCodegenText,
  } = await import('@mui/x-agent-tools');

  const logger = buildCombinedLogger();

  const useMuiDocsTool = await createUseMuiDocsTool({
    getPackagesList: fetchRemotePackages,
    queue: {
      concurrency: DOCS_FETCH_CONCURRENCY,
    },
    cache: true,
    logger,
  });

  const fetchDocsTool = await createFetchDocTool({
    overrides: {
      description: FETCH_DOCS_DESCRIPTION,
    },
    cache: true,
    logger,
  });

  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  server.registerTool(
    useMuiDocsTool.publicName,
    {
      description: useMuiDocsTool.description,
      inputSchema: (useMuiDocsTool.inputSchema as z.AnyZodObject).shape,
    },
    buildDocsHandler(useMuiDocsTool),
  );

  server.registerTool(
    fetchDocsTool.publicName,
    {
      description: fetchDocsTool.description,
      inputSchema: (fetchDocsTool.inputSchema as z.AnyZodObject).shape,
    },
    buildDocsHandler(fetchDocsTool),
  );

  // JWT client is eager; API key only resolved on first `getToken()`.
  const muiBackendBaseUrl = process.env[MUI_BACKEND_BASE_URL_ENV] ?? DEFAULT_MUI_BACKEND_BASE_URL;
  const recipesBackendBaseUrl =
    process.env[RECIPES_BACKEND_BASE_URL_ENV] ?? DEFAULT_RECIPES_BACKEND_BASE_URL;
  const jwtClient = new CliJwtClient({ muiBackendBaseUrl });
  const baseCodegenOpts = {
    recipesBackendBaseUrl,
    getToken: () => jwtClient.getToken(),
    invalidateToken: () => jwtClient.invalidate(),
    logger,
  };
  // Static tool only for registration metadata; per-call tool is built per request below.
  const codegenStatic = createGenerateReactCodeTool(baseCodegenOpts);

  server.registerTool(
    codegenStatic.publicName,
    {
      description: codegenStatic.description,
      inputSchema: (codegenStatic.inputSchema as z.AnyZodObject).shape,
    },
    buildCodegenHandler({
      codegenStatic,
      createPerCallTool: ({ onProgress }) =>
        createGenerateReactCodeTool({ ...baseCodegenOpts, onProgress }),
      formatText: formatCodegenText,
      log: logger,
    }),
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
};

main().catch((error: unknown) => {
  // Startup failure path: logger isn't constructed yet, so fall back to bare console.error.
  console.error(STARTUP_ERROR_MESSAGE);
  console.error(error);
  process.exit(1);
});
