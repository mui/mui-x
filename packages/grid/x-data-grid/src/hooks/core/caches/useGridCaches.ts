import * as React from 'react';
import { GridCacheKey, GridCachesApi } from './gridCachesInterfaces';
import { GridApiCommon } from '../../../models/api/gridApiCommon';
import { useGridApiMethod } from '../../utils/useGridApiMethod';

export const useGridCaches = (apiRef: React.MutableRefObject<GridApiCommon>) => {
  const caches = React.useRef<{ [K in GridCacheKey]?: any }>({});

  const setCache = React.useCallback<GridCachesApi['unstable_setCache']>((cacheKey, updater) => {
    const currentValue = caches.current[cacheKey];
    caches.current[cacheKey] = updater(currentValue);
  }, []);

  const getCache = React.useCallback<GridCachesApi['unstable_getCache']>(
    (cacheKey) => caches.current[cacheKey],
    [],
  );

  const cachesApi: GridCachesApi = {
    unstable_setCache: setCache,
    unstable_getCache: getCache,
  };

  useGridApiMethod(apiRef, cachesApi, 'GridCachesApi');
};
