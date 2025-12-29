'use client';
import * as React from 'react';
import { type Store } from '@base-ui/utils/store';
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

export interface RowsPluginApi {
  rows: RowsApi;
}

export interface RowsPluginOptions<TData = any> extends RowsOptions<TData> {
  initialState?: {
    rows?: Partial<RowsState>;
  };
}

const rowsPlugin = {
  name: 'rows',
  initialize: (params) => ({
    rows: createRowsState(params.rows, params.getRowId, params.loading ?? false, params.rowCount),
  }),
  use: (store, params, _api) => {
    const rowsApi = createRowsApi(store as Store<{ rows: RowsState }>, {
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
  selectors: {
    rows: {
      dataRowIds: (state) => state.rows.dataRowIds,
      dataRowIdToModelLookup: (state) => state.rows.dataRowIdToModelLookup,
      tree: (state) => state.rows.tree,
      treeDepths: (state) => state.rows.treeDepths,
      totalRowCount: (state) => state.rows.totalRowCount,
      totalTopLevelRowCount: (state) => state.rows.totalTopLevelRowCount,
      loading: (state) => state.rows.loading,
      groupingName: (state) => state.rows.groupingName,
      row: (state, id: GridRowId) => state.rows.dataRowIdToModelLookup[id] ?? null,
      rowNode: (state, id: GridRowId) => state.rows.tree[id] ?? null,
    },
  },
} satisfies Plugin<'rows', RowsPluginState, RowsPluginApi, RowsPluginOptions>;

export default rowsPlugin;
