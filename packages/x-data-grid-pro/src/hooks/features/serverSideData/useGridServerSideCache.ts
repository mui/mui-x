import * as React from 'react';
import { useGridApiMethod } from '@mui/x-data-grid';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridGetRowsParams, GridGetRowsResponse, GridDataSourceCache } from '../../../models';
import { GridServerSideCacheApi } from './serverSideInterfaces';

const noop = () => undefined;

const defaultCache: GridDataSourceCache = {
  // TODO: Implement an internal cache
  set: noop,
  get: noop,
  clear: noop,
};

const getQueryKey = (params: GridGetRowsParams) => {
  return [params.paginationModel, params.sortModel, params.filterModel, params.groupKeys];
};

export const useGridServerSideCache = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'unstable_dataSource' | 'disableServerSideCache' | 'unstable_dataSourceCache'
  >,
): void => {
  const cacheRef = React.useRef<GridDataSourceCache>(
    props.unstable_dataSourceCache || defaultCache,
  );

  const getCacheData = React.useCallback(
    (params: GridGetRowsParams) => {
      if (props.disableServerSideCache) {
        return undefined;
      }
      const queryKey = getQueryKey(params);
      return cacheRef.current.get(queryKey);
    },
    [props.disableServerSideCache],
  );

  const setCacheData = React.useCallback(
    (params: GridGetRowsParams, data: GridGetRowsResponse) => {
      if (props.disableServerSideCache) {
        return;
      }
      const queryKey = getQueryKey(params);
      cacheRef.current.set(queryKey, data);
    },
    [props.disableServerSideCache],
  );

  const clearCache = React.useCallback(() => {
    if (props.disableServerSideCache) {
      return;
    }
    cacheRef.current.clear();
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
      cacheRef.current = props.unstable_dataSourceCache;
    }
  }, [props.unstable_dataSourceCache]);
};
