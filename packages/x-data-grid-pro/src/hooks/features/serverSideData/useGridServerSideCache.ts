import * as React from 'react';
import { useGridApiMethod } from '@mui/x-data-grid';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridGetRowsParams, GridGetRowsResponse, GridDataSourceCache } from '../../../models';
import { GridServerSideCacheApi } from './serverSideInterfaces';

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

const cacheInstance = new SimpleServerSideCache();

const defaultCache: GridDataSourceCache = {
  getKey: SimpleServerSideCache.getKey,
  set: (key, value) => cacheInstance.set(key as string, value as GridGetRowsResponse),
  get: (key) => cacheInstance.get(key as string),
  clear: () => cacheInstance.clear(),
};

export const useGridServerSideCache = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'unstable_dataSource' | 'disableServerSideCache' | 'unstable_dataSourceCache'
  >,
): void => {
  const cache = React.useRef<GridDataSourceCache>(props.unstable_dataSourceCache || defaultCache);

  const getCacheData = React.useCallback(
    (params: GridGetRowsParams) => {
      if (props.disableServerSideCache) {
        return undefined;
      }
      const key = cache.current.getKey(params);
      return cache.current.get(key);
    },
    [props.disableServerSideCache],
  );

  const setCacheData = React.useCallback(
    (params: GridGetRowsParams, data: GridGetRowsResponse) => {
      if (props.disableServerSideCache) {
        return;
      }
      const key = cache.current.getKey(params);
      cache.current.set(key, data);
    },
    [props.disableServerSideCache],
  );

  const clearCache = React.useCallback(() => {
    if (props.disableServerSideCache) {
      return;
    }
    cache.current.clear();
  }, [props.disableServerSideCache]);

  const serverSideCacheApi: GridServerSideCacheApi = {
    getCacheData,
    setCacheData,
    clearCache,
  };

  useGridApiMethod(privateApiRef, serverSideCacheApi, 'public');

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
