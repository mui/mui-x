export interface GridCaches {}

export type GridCacheKey = keyof GridCaches;

type GridCachesUpdater<K extends GridCacheKey> = (prevValue: GridCaches[K]) => GridCaches[K];

export interface GridCachesApi {
  unstable_getCache: <K extends GridCacheKey>(cacheKey: K) => GridCaches[K];
  unstable_setCache: <K extends GridCacheKey>(cacheKey: K, updater: GridCachesUpdater<K>) => void;
}
