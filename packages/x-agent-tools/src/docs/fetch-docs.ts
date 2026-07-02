import type PQueueType from 'p-queue';
import type { LRUCache } from '../utils/cache';
import type { Logger } from '../types';

const noopLogger: Logger = () => {};

export interface UrlListFetcherOptions {
  // Reads/writes responses here when set; omit to skip caching. The host owns the instance.
  cache?: LRUCache;
  // Surfaces swallowed fetch/cache failures. Silent by default.
  logger?: Logger;
  // Checks each URL before fetching. Returning false blocks it (SSRF guard) with an error string.
  // Omit to allow any URL (hosts should set this).
  isUrlAllowed?: (url: string) => boolean;
  // When true, rewrites site-absolute markdown links (e.g. `](/x/.../foo.md)` from `llms.txt`) to
  // absolute URLs so the agent can pass them straight to the next fetch.
  resolveDocLinks?: boolean;
  // Aborts the in-flight fetches when the host cancels the request.
  signal?: AbortSignal;
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
// URL could redirect to localhost/metadata and slip past it. No guard set: use the default fetch.
async function fetchFollowingGuardedRedirects(
  fetcher: typeof fetch,
  startUrl: string,
  isUrlAllowed?: (url: string) => boolean,
  signal?: AbortSignal,
): Promise<Response> {
  if (!isUrlAllowed) {
    return signal ? fetcher(startUrl, { signal }) : fetcher(startUrl);
  }
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
    target = new URL(location, target).toString();
  }
  // Caught below and folded into the "Could not fetch …" string, so it never surfaces alone.
  throw /* minify-error-disabled */ new Error(`Exceeded ${MAX_REDIRECTS} redirects`);
}

export function urlListFetcher(
  queue: PQueueType,
  fetcher: typeof fetch,
  urlList: string[],
  options: UrlListFetcherOptions = {},
) {
  const { cache, logger = noopLogger, isUrlAllowed, resolveDocLinks, signal } = options;
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
          const response = await fetchFollowingGuardedRedirects(fetcher, url, isUrlAllowed, signal);
          if (!response.ok) {
            // Caught below and folded into the "Could not fetch …" string, so it never surfaces alone.
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
          // Name the URL that failed (and why) so the agent isn't left with a generic blob.
          return `Could not fetch ${url}: ${error instanceof Error ? error.message : String(error)}`;
        }
      }),
    ),
  ).then((docs) => {
    const validDocs = docs.filter(Boolean) as string[];
    return validDocs.length > 0 ? validDocs.join('\n') : 'No documentation could be retrieved';
  });
}
