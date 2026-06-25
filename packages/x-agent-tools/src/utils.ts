import type PQueueType from 'p-queue';
import type { LRUCache } from './cache';
import { ChatTool, ZodObjectAny } from './types';

export type Logger = (message: string, error?: unknown) => void;

const noopLogger: Logger = () => {};

export interface UrlListFetcherOptions {
  // When provided, responses are read from / written to this cache. Omit to disable caching.
  // The host owns the cache instance (and its lifecycle) instead of the library holding global state.
  cache?: LRUCache;
  // Surfaces swallowed fetch/cache failures. Silent by default so the library never logs on its own.
  logger?: Logger;
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
  const { cache, logger = noopLogger } = options;
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
