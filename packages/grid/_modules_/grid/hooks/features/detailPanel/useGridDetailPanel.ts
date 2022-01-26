import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridPreProcessingGroup, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { useGridStateInit } from '../../utils/useGridStateInit';
import {
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
} from './gridDetailPanelToggleColDef';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEvents } from '../../../models/events/gridEvents';
import { GridEventListener } from '../../../models/events/gridEventListener';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  gridDetailPanelExpandedRowIdsSelector,
  gridDetailPanelExpandedRowsContentCacheSelector,
  gridDetailPanelExpandedRowsHeightCacheSelector,
} from './gridDetailPanelSelector';
import { DataGridProProcessedProps } from '../../../models/props/DataGridProProps';
import { GridRowId } from '../../../models/gridRows';
import { useGridSelector } from '../../utils/useGridSelector';
import { GridDetailPanelApi } from '../../../models/api/gridDetailPanelApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridRowIdsSelector } from '../rows/gridRowsSelector';
import { GridState } from '../../../models/gridState';
import { GridPreProcessor } from '../../core/preProcessing/gridPreProcessingApi';

function cacheContentAndHeight(
  apiRef: GridApiRef,
  state: GridState,
  getDetailPanelContent: DataGridProProcessedProps['getDetailPanelContent'],
  getDetailPanelHeight: DataGridProProcessedProps['getDetailPanelHeight'],
) {
  if (typeof getDetailPanelContent !== 'function') {
    return {};
  }

  // TODO change to lazy approach using a Proxy
  // only call getDetailPanelContent when asked for an id
  const rowIds = gridRowIdsSelector(state);
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

export const useGridDetailPanel = (
  apiRef: GridApiRef,
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
  useGridStateInit(apiRef, (state) => {
    return {
      ...state,
      detailPanel: {
        expandedRowIds:
          props.detailPanelExpandedRowIds ?? props.initialState?.detailPanel?.expandedRowIds ?? [],
      },
    };
  });

  const expandedRowIds = useGridSelector(apiRef, gridDetailPanelExpandedRowIdsSelector);
  const contentCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsContentCacheSelector);
  const heightCache = useGridSelector(apiRef, gridDetailPanelExpandedRowsHeightCacheSelector);

  const { getDetailPanelContent, getDetailPanelHeight } = props; // To avoid listing `props` as dependency

  const handleCellClick = React.useCallback<GridEventListener<GridEvents.cellClick>>(
    (params: GridCellParams, event: React.MouseEvent) => {
      if (params.field !== GRID_DETAIL_PANEL_TOGGLE_FIELD || getDetailPanelContent == null) {
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
    [apiRef, contentCache, getDetailPanelContent],
  );

  const handleCellKeyDown = React.useCallback<GridEventListener<GridEvents.cellKeyDown>>(
    (params, event) => {
      if (!event.ctrlKey || event.key !== 'Enter' || props.getDetailPanelContent == null) {
        return;
      }
      apiRef.current.toggleDetailPanel(params.id);
    },
    [apiRef, props.getDetailPanelContent],
  );

  useGridApiEventHandler(apiRef, GridEvents.cellClick, handleCellClick);
  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);

  const addToggleColumn = React.useCallback<
    GridPreProcessor<GridPreProcessingGroup.hydrateColumns>
  >(
    (columnsState) => {
      if (props.getDetailPanelContent == null) {
        // Remove the toggle column, when it exists
        if (columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD]) {
          delete columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD];
          columnsState.all = columnsState.all.filter(
            (field) => field !== GRID_DETAIL_PANEL_TOGGLE_FIELD,
          );
        }
        return columnsState;
      }

      // Don't add the toggle column if there's already one
      // The user might have manually added it to have it in a custom position
      if (columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD]) {
        return columnsState;
      }

      // Othewise, add the toggle column at the beginning
      columnsState.all = [GRID_DETAIL_PANEL_TOGGLE_FIELD, ...columnsState.all];
      columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD] = GRID_DETAIL_PANEL_TOGGLE_COL_DEF;
      return columnsState;
    },
    [props.getDetailPanelContent],
  );

  const addDetailHeight = React.useCallback<GridPreProcessor<GridPreProcessingGroup.rowHeight>>(
    (initialValue, row) => {
      if (expandedRowIds.length === 0 || !expandedRowIds.includes(row.id)) {
        return { ...initialValue, detail: 0 };
      }
      return {
        ...initialValue,
        detail: heightCache[row.id] ?? 0, // Fallback to zero because the cache might not be ready yet (e.g. page was changed)
      };
    },
    [expandedRowIds, heightCache],
  );

  useGridRegisterPreProcessor(apiRef, GridPreProcessingGroup.hydrateColumns, addToggleColumn);
  useGridRegisterPreProcessor(apiRef, GridPreProcessingGroup.rowHeight, addDetailHeight);

  apiRef.current.unstable_updateControlState({
    stateId: 'detailPanels',
    propModel: props.detailPanelExpandedRowIds,
    propOnChange: props.onDetailPanelExpandedRowIdsChange,
    stateSelector: gridDetailPanelExpandedRowIdsSelector,
    changeEvent: GridEvents.detailPanelsExpandedRowIdsChange,
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

  const updateCaches = React.useCallback(() => {
    apiRef.current.setState((state) => {
      return {
        ...state,
        detailPanel: {
          ...state.detailPanel,
          ...cacheContentAndHeight(apiRef, state, getDetailPanelContent, getDetailPanelHeight),
        },
      };
    });
    apiRef.current.forceUpdate();
  }, [apiRef, getDetailPanelContent, getDetailPanelHeight]);

  useGridApiEventHandler(apiRef, GridEvents.visibleRowsSet, updateCaches);

  React.useEffect(() => {
    updateCaches();
  }, [apiRef, updateCaches]);
};
