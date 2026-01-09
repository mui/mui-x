'use client';
import * as React from 'react';
import { type Store, useStore } from '@base-ui/utils/store';
import { type Plugin } from '../../core/plugin';
import {
  type RowsState,
  type RowsApi,
  type RowsOptions,
  createRowsState,
  createRowsApi,
  GridRowId,
} from './rowUtils';

export interface RowsPluginState {
  rows: RowsState;
}

export interface RowsPluginApi<TRow = any> {
  rows: RowsApi<TRow>;
}

export interface RowsPluginOptions<TRow = any> extends RowsOptions<TRow> {
  initialState?: {
    rows?: Partial<RowsState>;
  };
}

const createRowsHooks = (store: Store<RowsPluginState>) => ({
  rows: {
    useRowIds: () => useStore(store, (state) => state.rows.dataRowIds),
    useRowIdToModelLookup: () => useStore(store, (state) => state.rows.dataRowIdToModelLookup),
    useTree: () => useStore(store, (state) => state.rows.tree),
    useTreeDepths: () => useStore(store, (state) => state.rows.treeDepths),
    useTotalRowCount: () => useStore(store, (state) => state.rows.totalRowCount),
    useTotalTopLevelRowCount: () => useStore(store, (state) => state.rows.totalTopLevelRowCount),
    useLoading: () => useStore(store, (state) => state.rows.loading),
    useGroupingName: () => useStore(store, (state) => state.rows.groupingName),
    useRow: (id: GridRowId) =>
      useStore(store, (state) => state.rows.dataRowIdToModelLookup[id] ?? null),
    useRowNode: (id: GridRowId) => useStore(store, (state) => state.rows.tree[id] ?? null),
  },
});

export type RowsPluginHooks = ReturnType<typeof createRowsHooks>;

const rowsPlugin = {
  name: 'rows',
  initialize: (params) => ({
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
  createHooks: createRowsHooks,
} satisfies Plugin<'rows', RowsPluginState, RowsPluginApi, RowsPluginOptions, RowsPluginHooks>;

export default rowsPlugin;
