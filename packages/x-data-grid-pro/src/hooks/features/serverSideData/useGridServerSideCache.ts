import * as React from 'react';
import { useGridApiMethod } from '@mui/x-data-grid';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridGetRowsParams, GridGetRowsResponse, GridServerSideCache } from '../../../models';
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

const getDefaultCache = (cacheInstance: SimpleServerSideCache): GridServerSideCache => ({
  getKey: SimpleServerSideCache.getKey,
  set: (key: string, value: GridGetRowsResponse) =>
    cacheInstance.set(key as string, value as GridGetRowsResponse),
  get: (key: string) => cacheInstance.get(key as string),
  clear: () => cacheInstance.clear(),
});

export const useGridServerSideCache = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'unstable_dataSource' | 'disableDataSourceCache' | 'unstable_dataSourceCache'
  >,
): void => {
  const defaultCache = React.useRef(getDefaultCache(new SimpleServerSideCache()));
  const cache = React.useRef<GridServerSideCache>(
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
    if (props.disableDataSourceCache) {
      cache.current = props.disableDataSourceCache;
    }
  }, [props.disableDataSourceCache]);
};
