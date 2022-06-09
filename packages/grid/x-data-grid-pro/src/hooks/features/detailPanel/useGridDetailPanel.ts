import * as React from 'react';
import {
  GridEventListener,
  GridRowId,
  useGridSelector,
  useGridApiEventHandler,
  useGridApiMethod,
  GridCellParams,
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
  gridDetailPanelRawHeightCacheSelector,
} from './gridDetailPanelSelector';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GridDetailPanelApi } from './gridDetailPanelInterface';

export const detailPanelStateInitializer: GridStateInitializer<
  Pick<DataGridProProcessedProps, 'initialState' | 'detailPanelExpandedRowIds'>
> = (state, props) => {
  return {
    ...state,
    detailPanel: {
      heightCache: {},
      expandedRowIds:
        props.detailPanelExpandedRowIds ?? props.initialState?.detailPanel?.expandedRowIds ?? [],
    },
  };
};

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

  const addDetailHeight = React.useCallback<GridPipeProcessor<'rowHeight'>>(
    (initialValue, row) => {
      if (expandedRowIds.length === 0 || !expandedRowIds.includes(row.id)) {
        return { ...initialValue, detail: 0 };
      }
      const heightCache = gridDetailPanelExpandedRowsHeightCacheSelector(
        apiRef.current.state,
        apiRef.current.instanceId,
      );
      return {
        ...initialValue,
        detail: heightCache[row.id] ?? 0, // Fallback to zero because the cache might not be ready yet (e.g. page was changed)
      };
    },
    [apiRef, expandedRowIds],
  );

  useGridRegisterPipeProcessor(apiRef, 'rowHeight', addDetailHeight);

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

  const storeDetailPanelHeight = React.useCallback<
    GridDetailPanelApi['unstable_storeDetailPanelHeight']
  >(
    (id, height) => {
      const heightCache = gridDetailPanelRawHeightCacheSelector(apiRef.current.state);

      if (!heightCache[id] || heightCache[id].height === height) {
        return;
      }

      apiRef.current.setState((state) => {
        return {
          ...state,
          detailPanel: {
            ...state.detailPanel,
            heightCache: { ...heightCache, [id]: { ...heightCache[id], height } },
          },
        };
      });

      apiRef.current.unstable_requestPipeProcessorsApplication('rowHeight');
    },
    [apiRef],
  );

  const detailPanelHasAutoHeight = React.useCallback(
    (id) => {
      const heightCache = gridDetailPanelRawHeightCacheSelector(apiRef.current.state);
      return heightCache[id] ? heightCache[id].autoHeight : false;
    },
    [apiRef],
  );

  const detailPanelApi: GridDetailPanelApi = {
    toggleDetailPanel,
    getExpandedDetailPanels,
    setExpandedDetailPanels,
    unstable_storeDetailPanelHeight: storeDetailPanelHeight,
    unstable_detailPanelHasAutoHeight: detailPanelHasAutoHeight,
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
};
