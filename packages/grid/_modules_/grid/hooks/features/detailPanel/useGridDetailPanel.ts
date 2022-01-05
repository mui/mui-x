import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridPreProcessingGroup, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { useGridStateInit } from '../../utils/useGridStateInit';
import { GridColumnsRawState } from '../columns/gridColumnsState';
import {
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
} from './gridDetailPanelToggleColDef';
import { useGridState } from '../../utils/useGridState';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEvents } from '../../../models/events/gridEvents';
import { GridEventListener } from '../../../models/events/gridEventListener';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  gridExpandedRowIdsSelector,
  gridExpandedRowsContentCacheSelector,
  gridExpandedRowsHeightCacheSelector,
} from './gridDetailPanelSelector';
import { DataGridProProcessedProps } from '../../../models/props/DataGridProProps';
import { GridRowEntry, GridRowId } from '../../../models/gridRows';
import { useGridSelector } from '../../utils/useGridSelector';
import { GridDetailPanelApi } from '../../../models/api/gridDetailPanelApi';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { gridRowIdsSelector } from '../rows/gridRowsSelector';
import { GridState } from '../../../models/gridState';

function cacheContentAndHeight(
  apiRef: GridApiRef,
  state: GridState,
  getDetailPanelContent: DataGridProProcessedProps['getDetailPanelContent'],
  getDetailPanelHeight: DataGridProProcessedProps['getDetailPanelHeight'],
) {
  if (typeof getDetailPanelContent !== 'function') {
    return {};
  }

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
        expandedRowIds: props.initialState?.detailPanel?.expandedRowIds || [],
      },
    };
  });

  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const expandedRowIds = useGridSelector(apiRef, gridExpandedRowIdsSelector);
  const contentCache = useGridSelector(apiRef, gridExpandedRowsContentCacheSelector);
  const heightCache = useGridSelector(apiRef, gridExpandedRowsHeightCacheSelector);

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

  const addToggleColumn = React.useCallback(
    (columnsState: GridColumnsRawState) => {
      if (
        columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD] !== undefined ||
        props.getDetailPanelContent == null
      ) {
        return columnsState;
      }

      return {
        ...columnsState,
        all: [GRID_DETAIL_PANEL_TOGGLE_FIELD, ...columnsState.all],
        lookup: {
          [GRID_DETAIL_PANEL_TOGGLE_FIELD]: {
            ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
          },
          ...columnsState.lookup,
        },
      };
    },
    [props.getDetailPanelContent],
  );

  const addDetailHeight = React.useCallback(
    (initialValue: Record<string, number>, row: GridRowEntry) => {
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
    stateSelector: gridExpandedRowIdsSelector,
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

      setGridState((state) => {
        return {
          ...state,
          detailPanel: {
            ...state.detailPanel,
            expandedRowIds: state.detailPanel.expandedRowIds.includes(id)
              ? state.detailPanel.expandedRowIds.filter((rowId) => rowId !== id)
              : [...state.detailPanel.expandedRowIds, id],
          },
        };
      });
      forceUpdate();
    },
    [contentCache, forceUpdate, props.getDetailPanelContent, setGridState],
  );

  const getExpandedRowIds = React.useCallback<GridDetailPanelApi['getExpandedRowIds']>(
    () => gridExpandedRowIdsSelector(apiRef.current.state),
    [apiRef],
  );

  const setExpandedRowIds = React.useCallback<GridDetailPanelApi['setExpandedRowIds']>(
    (ids) => {
      setGridState((state) => {
        return {
          ...state,
          detailPanel: {
            ...state.detailPanel,
            expandedRowIds: ids,
          },
        };
      });
      forceUpdate();
    },
    [forceUpdate, setGridState],
  );

  const detailPanelApi: GridDetailPanelApi = {
    toggleDetailPanel,
    getExpandedRowIds,
    setExpandedRowIds,
  };
  useGridApiMethod(apiRef, detailPanelApi, 'detailPanelApi');

  React.useEffect(() => {
    if (props.detailPanelExpandedRowIds) {
      apiRef.current.setExpandedRowIds(props.detailPanelExpandedRowIds);
    }
  }, [apiRef, props.detailPanelExpandedRowIds]);

  const updateCaches = React.useCallback(() => {
    setGridState((state) => {
      return {
        ...state,
        detailPanel: {
          ...state.detailPanel,
          ...cacheContentAndHeight(apiRef, state, getDetailPanelContent, getDetailPanelHeight),
        },
      };
    });
    forceUpdate();
  }, [apiRef, forceUpdate, getDetailPanelContent, getDetailPanelHeight, setGridState]);

  useGridApiEventHandler(apiRef, GridEvents.rowsSet, updateCaches);

  React.useEffect(() => {
    updateCaches();
  }, [updateCaches]);
};
