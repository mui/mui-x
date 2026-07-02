import { createFetchDocTool, createUseMuiDocsTool } from './tools';
import { createDocsQueue } from './queue';
import { fetchRemotePackages } from './packages';
import { createDocsUrlGuard } from './url-guard';
import { withRetry } from '../utils/retry';
import { LRUCache } from '../utils/cache';
import type { Logger } from '../types';

// Backoff for the startup catalog fetch (~63s total), so a cold-starting backend (~30-60s spin-up)
// doesn't leave the docs tools disabled for the whole session.
const DEFAULT_RETRY_DELAYS_MS = [1000, 2000, 4000, 8000, 16000, 32000];

type UseMuiDocsTool = Awaited<ReturnType<typeof createUseMuiDocsTool>>;
type FetchDocsTool = Awaited<ReturnType<typeof createFetchDocTool>>;

export interface DocsTools {
  /** Always available; needs no catalog. */
  fetchDocsTool: FetchDocsTool;
  /** `null` when the docs catalog was unreachable after retries; `fetchDocs` still works. */
  useMuiDocsTool: UseMuiDocsTool | null;
}

export interface CreateDocsToolsOptions {
  /** Docs-catalog backend base URL; also added to the SSRF allowlist. */
  docsBaseUrl: string;
  /** Surfaces swallowed failures (catalog retries, blocked fetches). Silent by default. */
  logger?: Logger;
  /** Override `globalThis.fetch`. Useful for tests. */
  fetcher?: typeof fetch;
  /** Retry backoff for the catalog fetch. Defaults to a ~63s ramp; override in tests. */
  retryDelaysMs?: number[];
  /** Override the `fetchDocs` tool description (its default lives in the tool factory). */
  fetchDocsDescription?: string;
}

/**
 * Build the docs tools behind the SSRF guard. `fetchDocs` needs no catalog and is always returned;
 * `useMuiDocs` needs the catalog at startup, so it's retried and, on failure, left `null` (fail-soft)
 * rather than taking `fetchDocs` down.
 */
export async function createDocsTools(options: CreateDocsToolsOptions): Promise<DocsTools> {
  const {
    docsBaseUrl,
    logger,
    fetcher,
    retryDelaysMs = DEFAULT_RETRY_DELAYS_MS,
    fetchDocsDescription,
  } = options;

  // Docs fetchers may only reach MUI docs origins + the configured docs base URL.
  const isUrlAllowed = createDocsUrlGuard([docsBaseUrl], logger);

  // One queue and one raw-text cache shared across both docs tools.
  const queue = createDocsQueue();
  const cache = new LRUCache();

  const fetchDocsTool = await createFetchDocTool({
    ...(fetchDocsDescription ? { overrides: { description: fetchDocsDescription } } : {}),
    queue,
    cache,
    logger,
    fetcher,
    isUrlAllowed,
  });

  let useMuiDocsTool: UseMuiDocsTool | null = null;
  try {
    const getPackagesList = () =>
      withRetry(
        () => fetchRemotePackages(docsBaseUrl, fetcher),
        retryDelaysMs,
        (error, delayMs) =>
          logger?.(
            `MUI X Agent Tools: docs catalog fetch failed, retrying in ${delayMs}ms.`,
            error,
          ),
      );
    useMuiDocsTool = await createUseMuiDocsTool({
      getPackagesList,
      queue,
      cache,
      logger,
      fetcher,
      isUrlAllowed,
    });
  } catch (error) {
    logger?.(
      'MUI X Agent Tools: docs catalog unreachable at startup; useMuiDocs is unavailable ' +
        '(fetchDocs still works). Restart once the backend recovers.',
      error,
    );
  }

  return { fetchDocsTool, useMuiDocsTool };
}
