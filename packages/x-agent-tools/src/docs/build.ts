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

// Per-attempt cap on the catalog fetch, so a hung connection (accepted, never answered) aborts and
// the retry can proceed instead of the promise never settling. Generous enough for a cold start.
const DEFAULT_CATALOG_TIMEOUT_MS = 30000;

type UseMuiDocsTool = Awaited<ReturnType<typeof createUseMuiDocsTool>>;
type FetchDocsTool = Awaited<ReturnType<typeof createFetchDocTool>>;

export interface DocsTools {
  /** Ready immediately: needs no catalog. */
  fetchDocsTool: FetchDocsTool;
  /**
   * Resolves once the catalog settles: the `useMuiDocs` tool, or `null` if the catalog was
   * unreachable after retries (`fetchDocs` still works). Never rejects (fail-soft), and `fetchDocs`
   * is available without awaiting it, so a slow or hung catalog never blocks it.
   */
  useMuiDocsReady: Promise<UseMuiDocsTool | null>;
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
  /** Per-attempt catalog-fetch timeout. Defaults to 30s; override in tests. */
  catalogTimeoutMs?: number;
  /** Override the `fetchDocs` tool description (its default lives in the tool factory). */
  fetchDocsDescription?: string;
}

/**
 * Build the docs tools behind the SSRF guard. `fetchDocs` needs no catalog, so it's built and
 * returned right away; `useMuiDocs` needs the catalog, so it loads in the background
 * (`useMuiDocsReady`) and settles to `null` on failure (fail-soft) instead of blocking `fetchDocs`.
 */
export async function createDocsTools(options: CreateDocsToolsOptions): Promise<DocsTools> {
  const {
    docsBaseUrl,
    logger,
    fetcher,
    retryDelaysMs = DEFAULT_RETRY_DELAYS_MS,
    catalogTimeoutMs = DEFAULT_CATALOG_TIMEOUT_MS,
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

  // Load the catalog + `useMuiDocs` in the background so `fetchDocs` never waits on it.
  const useMuiDocsReady = loadUseMuiDocs({
    docsBaseUrl,
    queue,
    cache,
    logger,
    fetcher,
    isUrlAllowed,
    retryDelaysMs,
    catalogTimeoutMs,
  });

  return { fetchDocsTool, useMuiDocsReady };
}

interface LoadUseMuiDocsDeps {
  docsBaseUrl: string;
  queue: ReturnType<typeof createDocsQueue>;
  cache: LRUCache;
  logger?: Logger;
  fetcher?: typeof fetch;
  isUrlAllowed: (url: string) => boolean;
  retryDelaysMs: number[];
  catalogTimeoutMs: number;
}

/**
 * Fetch the catalog (retried, per-attempt timeout) and build `useMuiDocs`. Resolves to `null` on
 * failure instead of rejecting, so a caller's `await` on it can never take `fetchDocs` down.
 */
async function loadUseMuiDocs(deps: LoadUseMuiDocsDeps): Promise<UseMuiDocsTool | null> {
  const {
    docsBaseUrl,
    queue,
    cache,
    logger,
    fetcher,
    isUrlAllowed,
    retryDelaysMs,
    catalogTimeoutMs,
  } = deps;
  try {
    const getPackagesList = () =>
      withRetry(
        () => fetchRemotePackages(docsBaseUrl, fetcher, catalogTimeoutMs),
        retryDelaysMs,
        (error, delayMs) =>
          logger?.(
            `MUI X Agent Tools: docs catalog fetch failed, retrying in ${delayMs}ms.`,
            error,
          ),
      );
    return await createUseMuiDocsTool({
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
    return null;
  }
}
