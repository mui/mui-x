'use client';
import * as React from 'react';
import { type Plugin, createPlugin } from '../../core/plugin';
import { Pipeline } from '../../core/pipeline';
import { rowsSelectors } from './selectors';
import { createRowsState, GRID_ROOT_GROUP_ID, getRowIdFromRowModel } from './rowUtils';
import type {
  GridRowId,
  GridRowModel,
  GridGroupNode,
  GridLeafNode,
  RowsPluginState,
  RowsPluginOptions,
  RowsPluginApi,
  RowsApi,
} from './types';

type RowsPlugin = Plugin<
  'rows',
  RowsPluginState,
  typeof rowsSelectors,
  RowsPluginApi,
  RowsPluginOptions
>;

const rowsPlugin = createPlugin<RowsPlugin>()({
  name: 'rows',
  order: 10,
  selectors: rowsSelectors,
  initialize: (state, params) => ({
    ...state,
    rows: createRowsState(params.rows, params.getRowId, params.loading ?? false, params.rowCount),
  }),
  use: (store, params, _api) => {
    const rowIdsPipeline = React.useMemo(
      () =>
        new Pipeline<GridRowId[]>({
          getInitialValue: () => store.state.rows.dataRowIds,
          onRecompute: (processedRowIds) => {
            store.setState({
              ...store.state,
              rows: {
                ...store.state.rows,
                processedRowIds,
              },
            });
          },
        }),
      [store],
    );

    const prevDataRef = React.useRef(params.rows);
    const prevLoadingRef = React.useRef(params.loading);
    const prevRowCountRef = React.useRef(params.rowCount);

    const getRow = React.useCallback(
      (id: GridRowId) => store.state.rows.dataRowIdToModelLookup[id] ?? null,
      [store],
    );

    const getRowId = React.useCallback(
      <T extends GridRowModel>(row: T): GridRowId =>
        getRowIdFromRowModel(row, params.getRowId as ((model: T) => GridRowId) | undefined),
      [params.getRowId],
    );

    const getRowModels = React.useCallback(() => {
      const { dataRowIds, dataRowIdToModelLookup } = store.state.rows;
      return new Map(dataRowIds.map((id: GridRowId) => [id, dataRowIdToModelLookup[id] ?? {}]));
    }, [store]);

    const getRowsCount = React.useCallback(() => store.state.rows.totalRowCount, [store]);

    const getAllRowIds = React.useCallback(() => store.state.rows.dataRowIds, [store]);

    const setRows = React.useCallback(
      (rows: GridRowModel[]) => {
        const newRowsState = createRowsState(
          rows,
          params.getRowId as ((row: GridRowModel) => GridRowId) | undefined,
          store.state.rows.loading,
          params.rowCount,
        );
        store.setState({ ...store.state, rows: newRowsState });
        rowIdsPipeline.recompute();
      },
      [params.getRowId, params.rowCount, store, rowIdsPipeline],
    );

    const updateRows = React.useCallback<RowsApi['updateRows']>(
      (updates) => {
        const { dataRowIds, dataRowIdToModelLookup, tree, treeDepths } = store.state.rows;

        const newDataRowIds = [...dataRowIds];
        const newLookup = { ...dataRowIdToModelLookup };
        const newTree = { ...tree };
        const rootGroup = { ...(newTree[GRID_ROOT_GROUP_ID] as GridGroupNode) };
        rootGroup.children = [...rootGroup.children];

        for (const update of updates) {
          const id = getRowIdFromRowModel(
            update as GridRowModel,
            params.getRowId as ((row: GridRowModel) => GridRowId) | undefined,
            'A row was provided without id when calling updateRows():',
          );

          // eslint-disable-next-line no-underscore-dangle
          if ('_action' in update && update._action === 'delete') {
            delete newLookup[id];
            delete newTree[id];
            const dataIndex = newDataRowIds.indexOf(id);
            if (dataIndex > -1) {
              newDataRowIds.splice(dataIndex, 1);
            }
            const childIndex = rootGroup.children.indexOf(id);
            if (childIndex > -1) {
              rootGroup.children.splice(childIndex, 1);
            }
          } else if (newLookup[id]) {
            newLookup[id] = { ...newLookup[id], ...update };
          } else {
            newDataRowIds.push(id);
            newLookup[id] = update;
            rootGroup.children.push(id);

            const leafNode: GridLeafNode = {
              id,
              type: 'leaf',
              depth: 0,
              parent: GRID_ROOT_GROUP_ID,
              groupingKey: null,
            };
            newTree[id] = leafNode;
          }
        }

        newTree[GRID_ROOT_GROUP_ID] = rootGroup;

        const totalRowCount =
          params.rowCount === -1 ? -1 : Math.max(params.rowCount ?? 0, newDataRowIds.length);

        store.setState({
          ...store.state,
          rows: {
            ...store.state.rows,
            dataRowIds: newDataRowIds,
            dataRowIdToModelLookup: newLookup,
            tree: newTree,
            treeDepths: { ...treeDepths, 0: newDataRowIds.length },
            totalRowCount,
            totalTopLevelRowCount: totalRowCount,
          },
        });
        rowIdsPipeline.recompute();
      },
      [params.getRowId, params.rowCount, store, rowIdsPipeline],
    );

    const getRowNode = React.useCallback(
      (id: GridRowId) => store.state.rows.tree[id] ?? null,
      [store],
    );

    const setLoading = React.useCallback(
      (loading: boolean) => {
        store.setState({
          ...store.state,
          rows: { ...store.state.rows, loading },
        });
      },
      [store],
    );

    React.useEffect(() => {
      if (prevDataRef.current !== params.rows) {
        prevDataRef.current = params.rows;
        setRows(params.rows);
      }
    }, [params.rows, setRows]);

    React.useEffect(() => {
      if (prevLoadingRef.current !== params.loading) {
        prevLoadingRef.current = params.loading;
        setLoading(params.loading ?? false);
      }
    }, [params.loading, setLoading]);

    React.useEffect(() => {
      if (prevRowCountRef.current !== params.rowCount) {
        prevRowCountRef.current = params.rowCount;
        // Update totalRowCount in state when rowCount prop changes
        const currentDataRowCount = store.state.rows.dataRowIds.length;
        const newTotalRowCount =
          params.rowCount === -1 ? -1 : Math.max(params.rowCount ?? 0, currentDataRowCount);

        store.setState({
          ...store.state,
          rows: {
            ...store.state.rows,
            totalRowCount: newTotalRowCount,
            totalTopLevelRowCount: newTotalRowCount,
          },
        });

        rowIdsPipeline.recompute();
      }
    }, [params.rowCount, store, rowIdsPipeline]);

    return {
      rows: {
        getRow,
        getRowId,
        getRowModels,
        getRowsCount,
        getAllRowIds,
        setRows,
        updateRows,
        getRowNode,
        setLoading,
        rowIdsPipeline,
      },
    };
  },
});

export default rowsPlugin;
