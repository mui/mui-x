import * as React from 'react';
import {
  GridServerSideGroupNode,
  GridRowModel,
  useGridApiMethod,
  GRID_ROOT_GROUP_ID,
  useGridApiEventHandler,
  GridFilterModel,
  GridEventListener,
  GridSortModel,
  GridRowTreeConfig,
  GridRowId,
} from '@mui/x-data-grid';
import { GridTreeDataLazyLoadingApi } from './gridTreeDataLazyLoadingApi';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { GetRowsParams, GridDataSource } from '../../../models/gridDataSource';

interface GridTreeDataLazyLoadHelpers {
  success: (rows: GridRowModel[]) => void;
  error: () => void;
}

export interface GridFetchRowChildrenParams {
  row?: GridRowModel | undefined;
  helpers: GridTreeDataLazyLoadHelpers;
  filterModel?: GridFilterModel;
  sortModel?: GridSortModel;
}

export const getLazyLoadingHelpers = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  rowNode: GridServerSideGroupNode,
  updateType: 'partial' | 'full' = 'partial',
) => ({
  success: (rows: GridRowModel[]) => {
    if (updateType === 'full') {
      apiRef.current.setRows(rows);
    } else {
      apiRef.current.updateRows(rows);
      const previousNode = apiRef.current.getRowNode(rowNode.id) as GridServerSideGroupNode;
      const id = rowNode!.id;

      const newNode: GridServerSideGroupNode = {
        ...previousNode,
        isLoading: false,
        childrenFetched: true,
      };
      apiRef.current.setState((state) => {
        return {
          ...state,
          rows: {
            ...state.rows,
            tree: { ...state.rows.tree, [id]: newNode },
          },
        };
      });
      apiRef.current.setRowChildrenExpansion(rowNode!.id, true);
    }
  },
  error: () => {
    apiRef.current.setRowLoadingStatus(rowNode!.id, false);
  },
});

const getTopLevelRows = async (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  getRows: GridDataSource['getRows'],
  getRowsParams: GetRowsParams,
) => {
  const rows = await getRows(getRowsParams);
  apiRef.current.setRows(rows);
};

type GetGroupKey = (row: GridRowModel) => any;

const computeGroupKeys = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  tree: GridRowTreeConfig,
  nodeId: GridRowId,
  getGroupKey: GetGroupKey,
): string[] => {
  const groupKeys: string[] = [];
  const currentNode = tree[nodeId] as GridServerSideGroupNode;
  const traverseParents = (node: GridServerSideGroupNode) => {
    const row = apiRef.current.getRow(node.id);
    groupKeys.push(getGroupKey(row));
    if (node.parent && node.parent !== GRID_ROOT_GROUP_ID) {
      traverseParents(tree[node.parent] as GridServerSideGroupNode);
    }
  };

  traverseParents(currentNode);
  return groupKeys.reverse();
};

const getGroupKey = (row: GridRowModel) => row.name;

export const useGridTreeDataLazyLoading = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<DataGridProProcessedProps, 'treeData' | 'unstable_dataSource'>,
) => {
  const fetchNodeChildren = React.useCallback(
    async (nodeId: string | number) => {
      if (props.unstable_dataSource?.getRows == null) {
        return;
      }
      const node = apiRef.current.getRowNode(nodeId) as GridServerSideGroupNode;
      apiRef.current.setRowLoadingStatus(nodeId, true);
      const groupKeys = computeGroupKeys(
        apiRef,
        apiRef.current.state.rows.tree,
        nodeId,
        getGroupKey,
      );
      const getRowsParams = {
        filterModel: apiRef.current.state.filter.filterModel,
        sortModel: apiRef.current.state.sorting.sortModel,
        groupKeys,
      };
      try {
        const rows = await props.unstable_dataSource!.getRows(getRowsParams);

        // TODO: Handle this (path generation) internally in `createRowTreeForTreeData`
        apiRef.current.updateRows(
          rows.map((row: GridRowModel) => ({ ...row, path: [...groupKeys, getGroupKey(row)] })),
        );
        const newNode: GridServerSideGroupNode = {
          ...node,
          isLoading: false,
          childrenFetched: true,
        };
        apiRef.current.setState((state) => {
          return {
            ...state,
            rows: {
              ...state.rows,
              tree: { ...state.rows.tree, [nodeId]: newNode },
            },
          };
        });
        apiRef.current.setRowChildrenExpansion(nodeId, true);
      } catch (error) {
        apiRef.current.setRowLoadingStatus(nodeId, false);
        throw error;
      }
    },
    [apiRef, props.unstable_dataSource],
  );

  const setRowLoadingStatus = React.useCallback<GridTreeDataLazyLoadingApi['setRowLoadingStatus']>(
    (id, isLoading) => {
      const currentNode = apiRef.current.getRowNode(id) as GridServerSideGroupNode;
      if (!currentNode) {
        throw new Error(`MUI: No row with id #${id} found`);
      }

      const newNode: GridServerSideGroupNode = { ...currentNode, isLoading };
      apiRef.current.setState((state) => {
        return {
          ...state,
          rows: {
            ...state.rows,
            tree: { ...state.rows.tree, [id]: newNode },
          },
        };
      });
      apiRef.current.forceUpdate();
    },
    [apiRef],
  );

  const onFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (filterModel: GridFilterModel) => {
      if (props.treeData && props.unstable_dataSource) {
        const getRowsParams = {
          filterModel,
          sortModel: apiRef.current.state.sorting.sortModel,
          groupKeys: [], // fetch root nodes
        };
        getTopLevelRows(apiRef, props.unstable_dataSource.getRows, getRowsParams);
      }
    },
    [apiRef, props.unstable_dataSource, props.treeData],
  );

  const onSortModelChange = React.useCallback<GridEventListener<'sortModelChange'>>(
    (sortModel: GridSortModel) => {
      if (props.treeData && props.unstable_dataSource) {
        const getRowsParams = {
          filterModel: apiRef.current.state.filter.filterModel,
          sortModel,
          groupKeys: [], // fetch root nodes
        };
        getTopLevelRows(apiRef, props.unstable_dataSource.getRows, getRowsParams);
      }
    },
    [apiRef, props.unstable_dataSource, props.treeData],
  );

  const treeDataLazyLoadingApi: GridTreeDataLazyLoadingApi = {
    setRowLoadingStatus,
    fetchNodeChildren,
  };

  useGridApiMethod(apiRef, treeDataLazyLoadingApi, 'public');
  useGridApiEventHandler(apiRef, 'filterModelChange', onFilterModelChange);
  useGridApiEventHandler(apiRef, 'sortModelChange', onSortModelChange);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.treeData && props.unstable_dataSource) {
      const filterModel = apiRef.current.state.filter?.filterModel;
      const sortModel = apiRef.current.state.sorting?.sortModel;
      const getRowsParams = {
        filterModel,
        sortModel,
        groupKeys: [], // fetch root nodes
      };
      getTopLevelRows(apiRef, props.unstable_dataSource.getRows, getRowsParams);
    }
  }, [apiRef, props.treeData, props.unstable_dataSource]);
};
