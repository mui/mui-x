import type PQueueType from 'p-queue';
import type { LRUCache } from './cache';
import { ChatTool, ZodObjectAny } from './types';

export type Logger = (message: string, error?: unknown) => void;

const noopLogger: Logger = () => {};

const PRIVATE_IPV4 = [
  /^127\./, // loopback
  /^10\./, // private
  /^192\.168\./, // private
  /^169\.254\./, // link-local (includes the 169.254.169.254 cloud-metadata endpoint)
  /^172\.(1[6-9]|2\d|3[0-1])\./, // 172.16.0.0/12
  /^0\./, // 0.0.0.0/8
];

/**
 * Best-effort check for hostnames that point at the local machine or a private network. Used to
 * block SSRF: a prompt-injected URL must not let the model reach localhost / internal services.
 * Hostname-based only (no DNS resolution), so it is a guard, not a complete SSRF defense.
 */
export function isPrivateHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, ''); // strip IPv6 brackets
  if (host === 'localhost' || host.endsWith('.localhost')) {
    return true;
  }
  if (host.endsWith('.local') || host.endsWith('.internal')) {
    return true;
  }
  // IPv6 loopback (::1), unspecified (::), unique-local (fc00::/7), link-local (fe80::/10)
  if (host === '::1' || host === '::' || /^f[cd]/.test(host) || host.startsWith('fe80')) {
    return true;
  }
  return PRIVATE_IPV4.some((re) => re.test(host));
}

/**
 * Build a URL guard for the docs fetchers. Allows http(s) URLs on any public host, plus the
 * explicitly trusted origins (the configured backends, which may be localhost during dev), and
 * rejects everything else, in particular private/internal hosts.
 */
export function createDocsUrlGuard(allowedOrigins: Iterable<string>): (url: string) => boolean {
  const allowed = new Set<string>();
  for (const origin of allowedOrigins) {
    try {
      allowed.add(new URL(origin).origin);
    } catch {
      // Ignore malformed configured origins rather than crashing the guard.
    }
  }
  return (url) => {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return false;
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }
    if (allowed.has(parsed.origin)) {
      return true;
    }
    return !isPrivateHostname(parsed.hostname);
  };
}

export interface UrlListFetcherOptions {
  // When provided, responses are read from / written to this cache. Omit to disable caching.
  // The host owns the cache instance (and its lifecycle) instead of the library holding global state.
  cache?: LRUCache;
  // Surfaces swallowed fetch/cache failures. Silent by default so the library never logs on its own.
  logger?: Logger;
  // Validates each URL before it is fetched. Returning false blocks the request (SSRF guard); the
  // result for that URL is an error string. Omit to allow any URL (the host should set this).
  isUrlAllowed?: (url: string) => boolean;
}

export function wrapTool<SchemaInputT extends ZodObjectAny, SchemaOutputT extends ZodObjectAny>(
  obj: ChatTool<SchemaInputT, SchemaOutputT>,
) {
  return obj;
}

export function urlListFetcher(
  queue: PQueueType,
  fetcher: typeof fetch,
  urlList: string[],
  options: UrlListFetcherOptions = {},
) {
  const { cache, logger = noopLogger, isUrlAllowed } = options;
  return Promise.all(
    urlList.map((url) =>
      queue.add(async () => {
        if (isUrlAllowed && !isUrlAllowed(url)) {
          logger(`Blocked fetch for disallowed URL: ${url}`);
          return `Could not fetch ${url}: URL is not an allowed docs source (blocked for security).`;
        }

        if (cache) {
          const cachedContent = cache.get(url);
          if (cachedContent !== null) {
            return cachedContent;
          }
        }

        try {
          const response = await fetcher(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const responseText = await response.text();

          if (cache) {
            queueMicrotask(() => {
              try {
                cache.set(url, responseText);
              } catch (error) {
                logger('Failed to update cache:', error);
              }
            });
          }

          return responseText;
        } catch (error) {
          logger(`Failed to fetch ${url}:`, error);
          // Self-identifying failure so the agent can tell which URL failed (and why) instead of
          // a generic blob mixed in with real docs.
          return `Could not fetch ${url}: ${error instanceof Error ? error.message : String(error)}`;
        }
      }),
    ),
  ).then((docs) => {
    // Filter out any failed fetches and join with newlines
    const validDocs = docs.filter(Boolean) as string[];
    return validDocs.length > 0 ? validDocs.join('\n') : 'No documentation could be retrieved';
  });
}
