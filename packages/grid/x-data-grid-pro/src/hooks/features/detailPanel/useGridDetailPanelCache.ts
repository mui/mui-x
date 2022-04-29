import * as React from 'react';
import { useGridApiEventHandler, gridRowIdsSelector, GridRowId } from '@mui/x-data-grid';
import { GridApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

function cacheContentAndHeight(
  apiRef: React.MutableRefObject<GridApiPro>,
  getDetailPanelContent: DataGridProProcessedProps['getDetailPanelContent'],
  getDetailPanelHeight: DataGridProProcessedProps['getDetailPanelHeight'],
) {
  if (typeof getDetailPanelContent !== 'function') {
    return {};
  }

  // TODO change to lazy approach using a Proxy
  // only call getDetailPanelContent when asked for an id
  const rowIds = gridRowIdsSelector(apiRef);
  const contentCache = rowIds.reduce<Record<GridRowId, ReturnType<typeof getDetailPanelContent>>>(
    (acc, id) => {
      const params = apiRef.current.getRowParams(id);
      acc[id] = getDetailPanelContent(params);
      return acc;
    },
    {},
  );

  const heightCache = rowIds.reduce<Record<GridRowId, ReturnType<typeof getDetailPanelHeight>>>(
    (acc, id) => {
      if (contentCache[id] == null) {
        return acc;
      }
      const params = apiRef.current.getRowParams(id);
      acc[id] = getDetailPanelHeight(params);
      return acc;
    },
    {},
  );

  return { contentCache, heightCache };
}

export const useGridDetailPanelCache = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<DataGridProProcessedProps, 'getDetailPanelContent' | 'getDetailPanelHeight'>,
) => {
  const updateCaches = React.useCallback(() => {
    apiRef.current.setState((state) => {
      return {
        ...state,
        detailPanel: {
          ...state.detailPanel,
          ...cacheContentAndHeight(apiRef, props.getDetailPanelContent, props.getDetailPanelHeight),
        },
      };
    });
    apiRef.current.forceUpdate();
  }, [apiRef, props.getDetailPanelContent, props.getDetailPanelHeight]);

  useGridApiEventHandler(apiRef, 'sortedRowsSet', updateCaches);

  const isFirstRender = React.useRef(true);
  if (isFirstRender.current) {
    isFirstRender.current = false;
    updateCaches();
  }

  React.useEffect(() => {
    if (isFirstRender.current) {
      return;
    }
    updateCaches();
  }, [updateCaches]);
};
