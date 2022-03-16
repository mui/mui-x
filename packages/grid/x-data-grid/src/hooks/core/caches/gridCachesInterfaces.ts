export interface GridCaches {}

export type GridCacheKey = keyof GridCaches;

export interface GridCachesApi {
  unstable_getCache: <K extends GridCacheKey>(cacheKey: K) => GridCaches[K] | undefined;
  unstable_setCache: <K extends GridCacheKey>(cacheKey: K, value: GridCaches[K]) => void;
}
