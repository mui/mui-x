import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { useGridApiMethod } from '@mui/x-data-grid';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridGetRowsParams, GridGetRowsResponse, GridDataSourceCache } from '../../../models';
import { GridDataSourceCacheApi } from './interfaces';

class SimpleServerSideCache {
  private cache: Record<string, GridGetRowsResponse>;

  constructor() {
    this.cache = {};
  }

  static getKey(params: GridGetRowsParams) {
    return JSON.stringify([
      params.paginationModel,
      params.filterModel,
      params.sortModel,
      params.groupKeys,
    ]);
  }

  set(key: string, value: GridGetRowsResponse) {
    this.cache[key] = value;
  }

  get(key: string) {
    return this.cache[key];
  }

  clear() {
    this.cache = {};
  }
}

const getDefaultCache = (cacheInstance: SimpleServerSideCache): GridDataSourceCache => ({
  getKey: SimpleServerSideCache.getKey,
  set: (key: string, value: GridGetRowsResponse) =>
    cacheInstance.set(key as string, value as GridGetRowsResponse),
  get: (key: string) => cacheInstance.get(key as string),
  clear: () => cacheInstance.clear(),
});

export const useGridDataSourceCache = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'unstable_dataSource' | 'disableDataSourceCache' | 'unstable_dataSourceCache'
  >,
): void => {
  const defaultCache = useLazyRef<GridDataSourceCache, void>(() =>
    getDefaultCache(new SimpleServerSideCache()),
  );
  const cache = React.useRef<GridDataSourceCache>(
    props.unstable_dataSourceCache || defaultCache.current,
  );

  const getCacheData = React.useCallback(
    (params: GridGetRowsParams) => {
      if (props.disableDataSourceCache) {
        return undefined;
      }
      const key = cache.current.getKey(params);
      return cache.current.get(key);
    },
    [props.disableDataSourceCache],
  );

  const setCacheData = React.useCallback(
    (params: GridGetRowsParams, data: GridGetRowsResponse) => {
      if (props.disableDataSourceCache) {
        return;
      }
      const key = cache.current.getKey(params);
      cache.current.set(key, data);
    },
    [props.disableDataSourceCache],
  );

  const clearCache = React.useCallback(() => {
    if (props.disableDataSourceCache) {
      return;
    }
    cache.current.clear();
  }, [props.disableDataSourceCache]);

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
    if (props.unstable_dataSourceCache) {
      cache.current = props.unstable_dataSourceCache;
    }
  }, [props.unstable_dataSourceCache]);
};
