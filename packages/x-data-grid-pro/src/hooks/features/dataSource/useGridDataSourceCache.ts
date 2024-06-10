import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { useGridApiMethod } from '@mui/x-data-grid';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridDataSourceCache } from '../../../models';
import { GridDataSourceCacheApi } from './interfaces';
import { GridDataSourceDefaultCache } from './cache';

export const useGridDataSourceCache = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<DataGridProProcessedProps, 'unstable_dataSource' | 'unstable_dataSourceCache'>,
): void => {
  const defaultCache = useLazyRef<GridDataSourceCache, void>(
    () => new GridDataSourceDefaultCache({}),
  ).current;

  const [cache, setCache] = React.useState<GridDataSourceCache | null>(
    props.unstable_dataSourceCache !== undefined ? props.unstable_dataSourceCache : defaultCache,
  );

  const dataSourceCacheApi: GridDataSourceCacheApi = {
    unstable_dataSourceCache: cache,
  };

  useGridApiMethod(privateApiRef, dataSourceCacheApi, 'public');

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
