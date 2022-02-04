import * as React from 'react';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { gridRowIdsSelector } from '../rows/gridRowsSelector';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { DataGridProProcessedProps } from '../../../models/props/DataGridProProps';
import { GridEvents } from '../../../models/events/gridEvents';

function cacheContentAndHeight(
  apiRef: GridApiRef,
  getDetailPanelContent: DataGridProProcessedProps['getDetailPanelContent'],
  getDetailPanelHeight: DataGridProProcessedProps['getDetailPanelHeight'],
) {
  if (typeof getDetailPanelContent !== 'function') {
    return {};
  }

  // TODO change to lazy approach using a Proxy
  // only call getDetailPanelContent when asked for an id
  const rowIds = gridRowIdsSelector(apiRef);
  const contentCache = rowIds.reduce((acc, id) => {
    const params = apiRef.current.getRowParams(id);
    acc[id] = getDetailPanelContent(params);
    return acc;
  }, {});

  const heightCache = rowIds.reduce((acc, id) => {
    if (contentCache[id] == null) {
      return acc;
    }
    const params = apiRef.current.getRowParams(id);
    acc[id] = getDetailPanelHeight(params);
    return acc;
  }, {});

  return { contentCache, heightCache };
}

export const useGridDetailPanelCache = (
  apiRef: GridApiRef,
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

  useGridApiEventHandler(apiRef, GridEvents.visibleRowsSet, updateCaches);

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
