import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { withRetry, type Logger, type PackageData } from '@mui/x-agent-tools';
import { buildDocsHandler } from './handler';

type XAgentTools = typeof import('@mui/x-agent-tools');

// Backoff for the startup catalog fetch (~63s total), so a cold-starting backend (~30-60s spin-up)
// doesn't leave the docs tools disabled for the whole session.
const DEFAULT_RETRY_DELAYS_MS = [1000, 2000, 4000, 8000, 16000, 32000];

export interface RegisterDocsToolsDeps {
  createUseMuiDocsTool: XAgentTools['createUseMuiDocsTool'];
  createFetchDocTool: XAgentTools['createFetchDocTool'];
  getPackagesList: () => Promise<PackageData[]>;
  isUrlAllowed: (url: string) => boolean;
  logger: Logger;
  concurrency: number;
  fetchDocsDescription: string;
  /** Retry backoff for the catalog fetch. Defaults to `DEFAULT_RETRY_DELAYS_MS`; override in tests. */
  retryDelaysMs?: number[];
}

/**
 * Register the docs tools on the MCP server. `fetchDocs` needs no catalog and always registers;
 * `useMuiDocs` needs the catalog at startup, so if that fetch fails this logs and skips only
 * `useMuiDocs` (fetchDocs and generateReactCode stay available). Each registration is isolated so a
 * failure can't escape to `main().catch` and exit the server.
 *
 * @returns `true` if `useMuiDocs` registered, `false` if it was skipped due to a catalog error.
 */
export async function registerDocsTools(
  server: McpServer,
  deps: RegisterDocsToolsDeps,
): Promise<boolean> {
  // fetchDocs needs no catalog: register it first, in its own try so a setup failure logs rather
  // than crashing the server.
  try {
    const fetchDocsTool = await deps.createFetchDocTool({
      overrides: { description: deps.fetchDocsDescription },
      queue: { concurrency: deps.concurrency },
      cache: true,
      logger: deps.logger,
      isUrlAllowed: deps.isUrlAllowed,
    });
    server.registerTool(
      fetchDocsTool.name,
      {
        description: fetchDocsTool.description,
        inputSchema: fetchDocsTool.inputSchema.shape,
      },
      buildDocsHandler(fetchDocsTool, deps.logger),
    );
  } catch (error) {
    deps.logger('MUI MCP: Could not register fetchDocs.', error);
  }

  // useMuiDocs needs the catalog at startup; isolate its failure so it can't take fetchDocs down.
  try {
    const getPackagesList = () =>
      withRetry(
        deps.getPackagesList,
        deps.retryDelaysMs ?? DEFAULT_RETRY_DELAYS_MS,
        (error, delayMs) =>
          deps.logger(`MUI MCP: docs catalog fetch failed, retrying in ${delayMs}ms.`, error),
      );

    const useMuiDocsTool = await deps.createUseMuiDocsTool({
      getPackagesList,
      queue: { concurrency: deps.concurrency },
      cache: true,
      logger: deps.logger,
      isUrlAllowed: deps.isUrlAllowed,
    });

    server.registerTool(
      useMuiDocsTool.name,
      {
        description: useMuiDocsTool.description,
        inputSchema: useMuiDocsTool.inputSchema.shape,
      },
      buildDocsHandler(useMuiDocsTool, deps.logger),
    );

    return true;
  } catch (error) {
    deps.logger(
      'MUI MCP: Could not register useMuiDocs (the docs catalog was unreachable at startup). ' +
        'fetchDocs and generateReactCode are still available; restart once the docs backend recovers.',
      error,
    );
    return false;
  }
}
