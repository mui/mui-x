import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { useGridApiMethod } from '@mui/x-data-grid';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridGetRowsParams, GridGetRowsResponse, GridDataSourceCache } from '../../../models';
import { GridDataSourceCacheApi } from './interfaces';
import { GridDataSourceDefaultCache } from './cache';

const getDefaultCache = (cacheInstance: GridDataSourceDefaultCache): GridDataSourceCache => ({
  getKey: cacheInstance.getKey,
  set: (key: string, value: GridGetRowsResponse) =>
    cacheInstance.set(key as string, value as GridGetRowsResponse),
  get: (key: string) => cacheInstance.get(key as string),
  clear: () => cacheInstance.clear(),
});

export const useGridDataSourceCache = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<DataGridProProcessedProps, 'unstable_dataSource' | 'unstable_dataSourceCache'>,
): void => {
  const defaultCache = useLazyRef<GridDataSourceCache, void>(() =>
    getDefaultCache(new GridDataSourceDefaultCache({})),
  );
  const cache = React.useRef<GridDataSourceCache | null>(
    props.unstable_dataSourceCache || defaultCache.current,
  );

  const getCacheData = React.useCallback((params: GridGetRowsParams) => {
    if (!cache.current) {
      return undefined;
    }
    const key = cache.current.getKey(params);
    return cache.current.get(key);
  }, []);

  const setCacheData = React.useCallback((params: GridGetRowsParams, data: GridGetRowsResponse) => {
    if (!cache.current) {
      return;
    }
    const key = cache.current.getKey(params);
    cache.current.set(key, data);
  }, []);

  const clearCache = React.useCallback(() => {
    if (!cache.current) {
      return;
    }
    cache.current.clear();
  }, []);

  const dataSourceCacheApi: GridDataSourceCacheApi = {
    getCacheData,
    setCacheData,
    clearCache,
  };

  useGridApiMethod(privateApiRef, dataSourceCacheApi, 'public');

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (props.unstable_dataSourceCache !== undefined) {
      cache.current = props.unstable_dataSourceCache;
    }
  }, [props.unstable_dataSourceCache]);
};
