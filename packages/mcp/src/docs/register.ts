import type { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { PackageData } from '@mui/x-agent-tools';
import { buildDocsHandler } from './handler';

type XAgentTools = typeof import('@mui/x-agent-tools');
type Logger = (message: string, error?: unknown) => void;

export interface RegisterDocsToolsDeps {
  createUseMuiDocsTool: XAgentTools['createUseMuiDocsTool'];
  createFetchDocTool: XAgentTools['createFetchDocTool'];
  getPackagesList: () => Promise<PackageData[]>;
  isUrlAllowed: (url: string) => boolean;
  logger: Logger;
  concurrency: number;
  fetchDocsDescription: string;
}

/**
 * Build and register the docs tools (`useMuiDocs`, `fetchDocs`) on the MCP server.
 *
 * They need the docs catalog at startup, so this is isolated from the rest of registration: if the
 * catalog is unreachable, it logs and returns `false` instead of throwing, leaving
 * `generateReactCode` (which doesn't need the catalog) free to register.
 *
 * @returns `true` if both docs tools registered, `false` if they were skipped due to an error.
 */
export async function registerDocsTools(
  server: McpServer,
  deps: RegisterDocsToolsDeps,
): Promise<boolean> {
  try {
    const useMuiDocsTool = await deps.createUseMuiDocsTool({
      getPackagesList: deps.getPackagesList,
      queue: { concurrency: deps.concurrency },
      cache: true,
      logger: deps.logger,
      isUrlAllowed: deps.isUrlAllowed,
    });

    const fetchDocsTool = await deps.createFetchDocTool({
      overrides: { description: deps.fetchDocsDescription },
      cache: true,
      logger: deps.logger,
      isUrlAllowed: deps.isUrlAllowed,
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

    return true;
  } catch (error) {
    deps.logger(
      'MUI MCP: Could not register the docs tools (the docs catalog was unreachable at startup). ' +
        'generateReactCode is still available; restart the server once the docs backend recovers.',
      error,
    );
    return false;
  }
}
