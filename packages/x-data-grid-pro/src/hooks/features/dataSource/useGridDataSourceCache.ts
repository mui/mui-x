import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { useGridApiMethod } from '@mui/x-data-grid';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridDataSourceCache } from '../../../models';
import { GridDataSourceCacheApi } from './interfaces';
import { GridDataSourceCacheDefault } from './cache';

const noopCache = {
  clear: () => {},
  get: () => undefined,
  set: () => {},
};

export const useGridDataSourceCache = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<DataGridProProcessedProps, 'unstable_dataSource' | 'unstable_dataSourceCache'>,
): void => {
  const defaultCache = useLazyRef<GridDataSourceCache, void>(
    () => new GridDataSourceCacheDefault({}),
  ).current;

  const [cache, setCache] = React.useState<GridDataSourceCache | null>(
    props.unstable_dataSourceCache !== undefined ? props.unstable_dataSourceCache : defaultCache,
  );

  const dataSourceCacheApi: GridDataSourceCacheApi = {
    unstable_dataSourceCache: cache ?? noopCache,
  };

  useGridApiMethod(apiRef, dataSourceCacheApi, 'public');

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (props.unstable_dataSourceCache !== undefined) {
      setCache(props.unstable_dataSourceCache);
    }
  }, [props.unstable_dataSourceCache]);
};
