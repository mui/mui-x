import * as React from 'react';
import {
  GridEventListener,
  GridRowId,
  useGridSelector,
  useGridApiEventHandler,
  useGridApiMethod,
  GridCellParams,
  gridRowIdsSelector,
} from '@mui/x-data-grid';
import {
  useGridRegisterPipeProcessor,
  GridPipeProcessor,
  GridStateInitializer,
} from '@mui/x-data-grid/internals';
import { GridApiPro } from '../../../models/gridApiPro';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from './gridDetailPanelToggleColDef';
import {
  gridDetailPanelExpandedRowIdsSelector,
  gridDetailPanelExpandedRowsContentCacheSelector,
  gridDetailPanelExpandedRowsHeightCacheSelector,
} from './gridDetailPanelSelector';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridDetailPanelApi } from './gridDetailPanelInterface';

export const detailPanelStateInitializer: GridStateInitializer<
  Pick<DataGridProProcessedProps, 'initialState' | 'detailPanelExpandedRowIds'>
> = (state, props) => {
  return {
    ...state,
    detailPanel: {
      expandedRowIds:
        props.detailPanelExpandedRowIds ?? props.initialState?.detailPanel?.expandedRowIds ?? [],
    },
  };
};

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

export const useGridDetailPanel = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'initialState'
    | 'getDetailPanelContent'
    | 'getDetailPanelHeight'
    | 'detailPanelExpandedRowIds'
    | 'onDetailPanelExpandedRowIdsChange'
    | 'pagination'
    | 'paginationMode'
  >,
): void => {
  const expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  const contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);

  const handleCellClick = React.useCallback<GridEventListener<'cellClick'>>(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (params.field !== GRID_DETAIL_PANEL_TOGGLE_FIELD || props.getDetailPanelContent == null) {
        return;
      }

      const content = contentCache[params.id];
      if (!React.isValidElement(content)) {
        return;
      }

      // Ignore if the user didn't click specifically in the "i" button
      if (event.target === event.currentTarget) {
        return;
      }

      apiRef.current.toggleDetailPanel(params.id);
    },
    [apiRef, contentCache, props.getDetailPanelContent],
  );

  const handleCellKeyDown = React.useCallback<GridEventListener<'cellKeyDown'>>(
    (params, event) => {
      if (props.getDetailPanelContent == null) {
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        // TODO v6: only support Space on the detail toggle
        apiRef.current.toggleDetailPanel(params.id);
        return;
      }

      if (params.field === GRID_DETAIL_PANEL_TOGGLE_FIELD && event.key === ' ') {
        apiRef.current.toggleDetailPanel(params.id);
      }
    },
    [apiRef, props.getDetailPanelContent],
  );

  useGridApiEventHandler(apiRef, 'cellClick', handleCellClick);
  useGridApiEventHandler(apiRef, 'cellKeyDown', handleCellKeyDown);

  apiRef.current.unstable_registerControlState({
    stateId: 'detailPanels',
    propModel: props.detailPanelExpandedRowIds,
    propOnChange: props.onDetailPanelExpandedRowIdsChange,
    stateSelector: gridDetailPanelExpandedRowIdsSelector,
    changeEvent: 'detailPanelsExpandedRowIdsChange',
  });

  const toggleDetailPanel = React.useCallback<GridDetailPanelApi['toggleDetailPanel']>(
    (id: GridRowId) => {
      if (props.getDetailPanelContent == null) {
        return;
      }

      const content = contentCache[id];
      if (!React.isValidElement(content)) {
        return;
      }

      const ids = apiRef.current.getExpandedDetailPanels();
      apiRef.current.setExpandedDetailPanels(
        ids.includes(id) ? ids.filter((rowId) => rowId !== id) : [...ids, id],
      );
    },
    [apiRef, contentCache, props.getDetailPanelContent],
  );

  const getExpandedDetailPanels = React.useCallback<GridDetailPanelApi['getExpandedDetailPanels']>(
    () => gridDetailPanelExpandedRowIdsSelector(apiRef.current.state),
    [apiRef],
  );

  const setExpandedDetailPanels = React.useCallback<GridDetailPanelApi['setExpandedDetailPanels']>(
    (ids) => {
      apiRef.current.setState((state) => {
        return {
          ...state,
          detailPanel: {
            ...state.detailPanel,
            expandedRowIds: ids,
          },
        };
      });
      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  const detailPanelApi: GridDetailPanelApi = {
    toggleDetailPanel,
    getExpandedDetailPanels,
    setExpandedDetailPanels,
  };
  useGridApiMethod(apiRef, detailPanelApi, 'detailPanelApi');

  React.useEffect(() => {
    if (props.detailPanelExpandedRowIds) {
      const currentModel = gridDetailPanelExpandedRowIdsSelector(apiRef.current.state);
      if (currentModel !== props.detailPanelExpandedRowIds) {
        apiRef.current.setExpandedDetailPanels(props.detailPanelExpandedRowIds);
      }
    }
  }, [apiRef, props.detailPanelExpandedRowIds]);

  const updateCachesAndForceUpdate = React.useCallback(() => {
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

  useGridApiEventHandler(apiRef, 'sortedRowsSet', updateCachesAndForceUpdate);

  const previousGetDetailPanelContentProp =
    React.useRef<DataGridProProcessedProps['getDetailPanelContent']>();
  const previousGetDetailPanelHeightProp =
    React.useRef<DataGridProProcessedProps['getDetailPanelHeight']>();

  const updateCachesIfNeeded = React.useCallback(() => {
    if (
      props.getDetailPanelContent === previousGetDetailPanelContentProp.current &&
      props.getDetailPanelHeight === previousGetDetailPanelHeightProp.current
    ) {
      return;
    }

    apiRef.current.setState((state) => {
      return {
        ...state,
        detailPanel: {
          ...state.detailPanel,
          ...cacheContentAndHeight(apiRef, props.getDetailPanelContent, props.getDetailPanelHeight),
        },
      };
    });

    previousGetDetailPanelContentProp.current = props.getDetailPanelContent;
    previousGetDetailPanelHeightProp.current = props.getDetailPanelHeight;
  }, [apiRef, props.getDetailPanelContent, props.getDetailPanelHeight]);

  const addDetailHeight = React.useCallback<GridPipeProcessor<'rowHeight'>>(
    (initialValue, row) => {
      if (!expandedRowIds || expandedRowIds.length === 0 || !expandedRowIds.includes(row.id)) {
        return { ...initialValue, detail: 0 };
      }

      updateCachesIfNeeded();

      const heightCache = gridDetailPanelExpandedRowsHeightCacheSelector(apiRef.current.state);

      return {
        ...initialValue,
        detail: heightCache[row.id] ?? 0, // Fallback to zero because the cache might not be ready yet (e.g. page was changed)
      };
    },
    [apiRef, expandedRowIds, updateCachesIfNeeded],
  );

  useGridRegisterPipeProcessor(apiRef, 'rowHeight', addDetailHeight);

  const isFirstRender = React.useRef(true);
  if (isFirstRender.current) {
    isFirstRender.current = false;
    updateCachesIfNeeded();
  }
};
