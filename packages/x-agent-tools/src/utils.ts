import type PQueueType from 'p-queue';
import type { LRUCache } from './cache';
import { ChatTool, ZodObjectAny } from './types';

export type Logger = (message: string, error?: unknown) => void;

const noopLogger: Logger = () => {};

/**
 * Hosts MUI serves docs / `llms.txt` from. Positive allowlist: only these (plus configured backends)
 * are fetchable, closing the SSRF class regardless of how an attacker host is spelled or resolves
 * (private IPs, IPv4-mapped, redirects, DNS rebinding).
 */
function isMuiDocsHost(host: string): boolean {
  return (
    host === 'mui.com' ||
    host.endsWith('.mui.com') ||
    // Netlify deploy previews: `<context>--material-ui-docs.netlify.app` (plus the base host).
    host === 'material-ui-docs.netlify.app' ||
    host.endsWith('--material-ui-docs.netlify.app')
  );
}

/**
 * Build a URL guard for the docs fetchers. Allows only http(s) URLs whose host is a MUI docs host
 * or one of the explicitly configured backend origins (which may be localhost during dev); rejects
 * everything else.
 */
export function createDocsUrlGuard(
  allowedOrigins: Iterable<string>,
  logger: Logger = noopLogger,
): (url: string) => boolean {
  const allowed = new Set<string>();
  for (const origin of allowedOrigins) {
    try {
      const parsed = new URL(origin);
      // Only http(s): opaque schemes (file:, data:, …) all serialize their origin to "null", so one
      // bad entry would let every other opaque-origin URL match and bypass the https-only check.
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        allowed.add(parsed.origin);
      } else {
        logger(`Ignoring configured docs origin with unsupported scheme: ${origin}`);
      }
    } catch {
      logger(`Ignoring malformed configured docs origin: ${origin}`);
    }
  }
  return (url) => {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return false;
    }
    // Explicitly configured backends are trusted as-is (they may be http://localhost in dev).
    if (allowed.has(parsed.origin)) {
      return true;
    }
    // Built-in MUI docs hosts must be https, so the first request can't be tampered with in transit.
    if (parsed.protocol !== 'https:') {
      return false;
    }
    const host = parsed.hostname.toLowerCase().replace(/\.$/, ''); // strip a trailing DNS dot
    return isMuiDocsHost(host);
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
  // When true, site-absolute markdown links in each response (e.g. `](/x/react-data-grid/foo.md)`,
  // as listed in MUI `llms.txt` indexes) are rewritten to absolute URLs against the source URL's
  // origin, so the agent can pass them straight to the next fetch without resolving paths itself.
  resolveDocLinks?: boolean;
}

// Rewrite site-absolute markdown links (`](/path)`) to absolute URLs against `baseUrl`'s origin, so
// the relative paths in `llms.txt` indexes stay fetchable. Absolute URLs, anchors, mailto are left as-is.
export function absolutizeDocLinks(markdown: string, baseUrl: string): string {
  let origin: string;
  try {
    origin = new URL(baseUrl).origin;
  } catch {
    return markdown;
  }
  return markdown.replace(/\]\((\/[^)]*)\)/g, (_match, path) => `](${origin}${path})`);
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
  // Caught internally and folded into the "Could not fetch …" string, so it never surfaces as a
  // standalone error: no need for an error code.
  throw /* minify-error-disabled */ new Error(`Exceeded ${MAX_REDIRECTS} redirects`);
}

export function urlListFetcher(
  queue: PQueueType,
  fetcher: typeof fetch,
  urlList: string[],
  options: UrlListFetcherOptions = {},
) {
  const { cache, logger = noopLogger, isUrlAllowed, resolveDocLinks } = options;
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
            // Caught just below and folded into the "Could not fetch …" string, so it never
            // surfaces standalone: no need for an error code.
            throw /* minify-error-disabled */ new Error(`HTTP error! status: ${response.status}`);
          }
          const rawText = await response.text();
          const responseText = resolveDocLinks ? absolutizeDocLinks(rawText, url) : rawText;

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
