'use client';
import * as React from 'react';
import { createSelector } from '@base-ui/utils/store';
import { type Plugin, createPlugin } from '../../core/plugin';
import {
  type RowsState,
  type RowsApi,
  type RowsOptions,
  createRowsState,
  createRowsApi,
  type GridRowId,
} from './rowUtils';

export interface RowsPluginState {
  rows: RowsState;
}

export interface RowsPluginOptions<TRow = any> extends RowsOptions<TRow> {
  initialState?: {
    rows?: Partial<RowsState>;
  };
}

const selectRowIds = createSelector((state: RowsPluginState) => state.rows.dataRowIds);
const selectRowIdToModelLookup = createSelector(
  (state: RowsPluginState) => state.rows.dataRowIdToModelLookup,
);
const selectTree = createSelector((state: RowsPluginState) => state.rows.tree);
const selectTreeDepths = createSelector((state: RowsPluginState) => state.rows.treeDepths);
const selectTotalRowCount = createSelector((state: RowsPluginState) => state.rows.totalRowCount);
const selectTotalTopLevelRowCount = createSelector(
  (state: RowsPluginState) => state.rows.totalTopLevelRowCount,
);
const selectLoading = createSelector((state: RowsPluginState) => state.rows.loading);
const selectGroupingName = createSelector((state: RowsPluginState) => state.rows.groupingName);
const selectRow = createSelector(
  selectRowIdToModelLookup,
  (lookup, id: GridRowId) => lookup[id] ?? null,
);
const selectRowNode = createSelector(selectTree, (tree, id: GridRowId) => tree[id] ?? null);

const rowsSelectors = {
  rowIds: selectRowIds,
  rowIdToModelLookup: selectRowIdToModelLookup,
  tree: selectTree,
  treeDepths: selectTreeDepths,
  totalRowCount: selectTotalRowCount,
  totalTopLevelRowCount: selectTotalTopLevelRowCount,
  loading: selectLoading,
  groupingName: selectGroupingName,
  row: selectRow,
  rowNode: selectRowNode,
};

export interface RowsPluginApi<TRow = any> {
  rows: RowsApi<TRow>;
}

type RowsPlugin = Plugin<
  'rows',
  RowsPluginState,
  typeof rowsSelectors,
  RowsPluginApi,
  RowsPluginOptions
>;

const rowsPlugin = createPlugin<RowsPlugin>()({
  name: 'rows',
  selectors: rowsSelectors,
  getInitialState: (state, params) => ({
    ...state,
    rows: createRowsState(params.rows, params.getRowId, params.loading ?? false, params.rowCount),
  }),
  use: (store, params, _api) => {
    const rowsApi = createRowsApi(store, {
      rows: params.rows,
      getRowId: params.getRowId,
      loading: params.loading,
      rowCount: params.rowCount,
    });

    const prevDataRef = React.useRef(params.rows);
    const prevLoadingRef = React.useRef(params.loading);
    const prevRowCountRef = React.useRef(params.rowCount);

    React.useEffect(() => {
      if (prevDataRef.current !== params.rows) {
        prevDataRef.current = params.rows;
        rowsApi.setRows(params.rows);
      }
    }, [params.rows, rowsApi]);

    React.useEffect(() => {
      if (prevLoadingRef.current !== params.loading) {
        prevLoadingRef.current = params.loading;
        rowsApi.setLoading(params.loading ?? false);
      }
    }, [params.loading, rowsApi]);

    React.useEffect(() => {
      if (prevRowCountRef.current !== params.rowCount) {
        prevRowCountRef.current = params.rowCount;
        // Update totalRowCount in state when rowCount prop changes
        // We need to recalculate totalRowCount = Math.max(rowCount ?? 0, currentDataRowCount)
        const currentDataRowCount = store.state.rows.dataRowIds.length;
        const newTotalRowCount = Math.max(params.rowCount ?? 0, currentDataRowCount);

        store.setState({
          ...store.state,
          rows: {
            ...store.state.rows,
            totalRowCount: newTotalRowCount,
            totalTopLevelRowCount: newTotalRowCount,
          },
        });
      }
    }, [params.rowCount, store]);

    return { rows: rowsApi };
  },
});

export default rowsPlugin;
