export interface GridCaches {}

export type GridCacheKey = keyof GridCaches;

type GridCachesUpdater<K extends GridCacheKey> = (
  prevValue: GridCaches[K] | undefined,
) => GridCaches[K];

export interface GridCachesApi {
  /**
   * @ignore - do not document.
   */
  unstable_getCache: <K extends GridCacheKey>(cacheKey: K) => GridCaches[K];
  /**
   * @ignore - do not document.
   */
  unstable_setCache: <K extends GridCacheKey>(cacheKey: K, updater: GridCachesUpdater<K>) => void;
}
