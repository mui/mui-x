import type PQueueType from 'p-queue';
import type { LRUCache } from '../utils/cache';
import type { Logger } from '../types';
import { combineAbortSignals } from '../utils/abort-signal';

const noopLogger: Logger = () => {};

// Per-request timeout for a doc-page fetch (covering all redirect hops), so one hung origin can't
// hold a queue slot until the whole tool call is cancelled.
const DEFAULT_PAGE_TIMEOUT_MS = 30000;

export interface UrlListFetcherOptions {
  /** Reads/writes responses here when set; omit to skip caching. The host owns the instance. */
  cache?: LRUCache;
  /** Surfaces swallowed fetch/cache failures. Silent by default. */
  logger?: Logger;
  /**
   * SSRF guard, checked on every hop (initial + each redirect). Returning false blocks the URL with
   * an error string. Required: these tools fetch model-supplied URLs, so there is no safe default.
   * @param {string} url The absolute URL about to be fetched (initial or redirect hop).
   * @returns {boolean} Whether the URL may be fetched.
   */
  isUrlAllowed: (url: string) => boolean;
  /**
   * When true, rewrites site-absolute markdown links (e.g. `](/x/.../foo.md)` from `llms.txt`) to
   * absolute URLs so the agent can pass them straight to the next fetch.
   */
  resolveDocLinks?: boolean;
  /** Aborts the in-flight fetches when the host cancels the request. */
  signal?: AbortSignal;
  /** Per-request timeout (ms) for each URL's fetch, including redirects. Defaults to 30s. */
  timeoutMs?: number;
}

// Rewrite site-absolute markdown links (`](/path)`) to absolute URLs against `baseUrl`'s origin, so
// relative `llms.txt` links stay fetchable. Absolute URLs, anchors, and mailto are left alone.
export function absolutizeDocLinks(markdown: string, baseUrl: string): string {
  let origin: string;
  try {
    origin = new URL(baseUrl).origin;
  } catch {
    return markdown;
  }
  return markdown.replace(/\]\((\/[^)]*)\)/g, (_match, path) => `](${origin}${path})`);
}

const MAX_REDIRECTS = 5;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

class BlockedUrlError extends Error {
  url: string;

  constructor(url: string) {
    super(`Blocked URL: ${url}`);
    this.name = 'BlockedUrlError';
    this.url = url;
  }
}

// Fetch `startUrl`, following redirects by hand so the guard runs on every hop. Otherwise a public
// URL could redirect to localhost/metadata and slip past it.
async function fetchFollowingGuardedRedirects(
  fetcher: typeof fetch,
  startUrl: string,
  isUrlAllowed: (url: string) => boolean,
  signal?: AbortSignal,
): Promise<Response> {
  let target = startUrl;
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    if (!isUrlAllowed(target)) {
      throw new BlockedUrlError(target);
    }
    // eslint-disable-next-line no-await-in-loop -- redirects are sequential by nature.
    const response = await fetcher(target, { redirect: 'manual', signal });
    const location = REDIRECT_STATUSES.has(response.status)
      ? response.headers.get('location')
      : null;
    if (!location) {
      return response;
    }
    // We only need the Location header; release the hop's connection instead of leaking it.
    // `cancel()` on an already-errored body rejects, so swallow it (an unhandled rejection would
    // otherwise crash the process).
    void response.body?.cancel().catch(() => {});
    target = new URL(location, target).toString();
  }
  // Caught below and folded into the "Could not fetch …" string, so it never surfaces alone.
  throw new Error(`Exceeded ${MAX_REDIRECTS} redirects`);
}

export function urlListFetcher(
  queue: PQueueType,
  fetcher: typeof fetch,
  urlList: string[],
  options: UrlListFetcherOptions,
) {
  const {
    cache,
    logger = noopLogger,
    isUrlAllowed,
    resolveDocLinks,
    signal,
    timeoutMs = DEFAULT_PAGE_TIMEOUT_MS,
  } = options;
  return Promise.all(
    urlList.map((url) =>
      queue
        .add(async () => {
          // Cache holds raw text; apply the link-rewriting view on read so one cache serves both tools.
          const render = (raw: string) => (resolveDocLinks ? absolutizeDocLinks(raw, url) : raw);

          if (cache) {
            const cachedRaw = cache.get(url);
            if (cachedRaw !== null) {
              return render(cachedRaw);
            }
          }

          // Bound this URL's fetch (all redirect hops) with a timeout, plus the host's cancellation.
          const requestSignal = combineAbortSignals(AbortSignal.timeout(timeoutMs), signal);
          try {
            const response = await fetchFollowingGuardedRedirects(
              fetcher,
              url,
              isUrlAllowed,
              requestSignal,
            );
            if (!response.ok) {
              // Caught below and folded into the "Could not fetch …" string, so it never surfaces alone.
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawText = await response.text();

            if (cache) {
              queueMicrotask(() => {
                try {
                  cache.set(url, rawText);
                } catch (error) {
                  logger('Failed to update cache:', error);
                }
              });
            }

            return render(rawText);
          } catch (error) {
            if (error instanceof BlockedUrlError) {
              logger(`Blocked fetch for disallowed URL: ${error.url}`);
              return `Could not fetch ${url}: URL is not an allowed docs source (blocked for security).`;
            }
            logger(`Failed to fetch ${url}:`, error);
            // Name the URL that failed (and why) so the agent isn't left with a generic blob.
            return `Could not fetch ${url}: ${error instanceof Error ? error.message : String(error)}`;
          }
        })
        .catch(
          // A queue-level rejection (e.g. p-queue timeout) escapes the task's try/catch; fold it in too.
          (error: unknown) =>
            `Could not fetch ${url}: ${error instanceof Error ? error.message : String(error)}`,
        ),
    ),
  ).then((docs) => {
    const validDocs = docs.filter(Boolean) as string[];
    return validDocs.length > 0 ? validDocs.join('\n') : 'No documentation could be retrieved';
  });
}
