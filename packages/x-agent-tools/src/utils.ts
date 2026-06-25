import type PQueueType from 'p-queue';
import ipaddr from 'ipaddr.js';
import type { LRUCache } from './cache';
import { ChatTool, ZodObjectAny } from './types';

export type Logger = (message: string, error?: unknown) => void;

const noopLogger: Logger = () => {};

/**
 * Best-effort check for hostnames that point at the local machine or a private network. Used to
 * block SSRF: a prompt-injected URL must not let the model reach localhost / internal services.
 * IP classification is delegated to `ipaddr.js`. This is hostname-based only (no DNS resolution),
 * so it's a guard, not a complete SSRF defense.
 */
export function isPrivateHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, ''); // strip IPv6 brackets
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal')
  ) {
    return true;
  }
  if (!ipaddr.isValid(host)) {
    return false; // a regular public hostname (DNS-based rebinding is out of scope for this guard)
  }
  // `process` converts IPv4-mapped IPv6 (e.g. ::ffff:127.0.0.1) to IPv4 first. Allow only normal
  // public unicast; everything else (loopback, private, link-local, unique-local, reserved, CGNAT)
  // is treated as private.
  return ipaddr.process(host).range() !== 'unicast';
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

// Fetch `startUrl`, following redirects manually so the URL guard runs on every hop. Without this a
// public URL could 30x-redirect to localhost / metadata and slip past the guard, since `fetch`
// follows redirects by default. With no guard set, defers to the fetcher's default behavior.
async function fetchFollowingGuardedRedirects(
  fetcher: typeof fetch,
  startUrl: string,
  isUrlAllowed?: (url: string) => boolean,
): Promise<Response> {
  if (!isUrlAllowed) {
    return fetcher(startUrl);
  }
  let target = startUrl;
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    if (!isUrlAllowed(target)) {
      throw new BlockedUrlError(target);
    }
    // eslint-disable-next-line no-await-in-loop -- redirects are sequential by nature.
    const response = await fetcher(target, { redirect: 'manual' });
    const location = REDIRECT_STATUSES.has(response.status)
      ? response.headers.get('location')
      : null;
    if (!location) {
      return response;
    }
    target = new URL(location, target).toString();
  }
  throw new Error(`Exceeded ${MAX_REDIRECTS} redirects`);
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
        if (cache) {
          const cachedContent = cache.get(url);
          if (cachedContent !== null) {
            return cachedContent;
          }
        }

        try {
          const response = await fetchFollowingGuardedRedirects(fetcher, url, isUrlAllowed);
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
          if (error instanceof BlockedUrlError) {
            logger(`Blocked fetch for disallowed URL: ${error.url}`);
            return `Could not fetch ${url}: URL is not an allowed docs source (blocked for security).`;
          }
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
