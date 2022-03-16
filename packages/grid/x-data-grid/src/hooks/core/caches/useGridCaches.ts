import * as React from 'react';
import { GridCaches, GridCachesApi } from './gridCachesInterfaces';
import { GridApiCommon } from '../../../models/api/gridApiCommon';
import { useGridApiMethod } from '../../utils/useGridApiMethod';

export const useGridCaches = (apiRef: React.MutableRefObject<GridApiCommon>) => {
  const caches = React.useRef<Partial<GridCaches>>({});

  const setCache = React.useCallback<GridCachesApi['unstable_setCache']>((cacheKey, value) => {
    caches.current[cacheKey] = value;
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
