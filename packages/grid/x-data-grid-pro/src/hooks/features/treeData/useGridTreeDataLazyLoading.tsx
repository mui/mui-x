import * as React from 'react';
import {
  GridServerSideGroupNode,
  GridRowModel,
  useGridApiMethod,
  GRID_ROOT_GROUP_ID,
  useGridApiOptionHandler,
} from '@mui/x-data-grid';
import { GridTreeDataLazyLoadingApi } from './gridTreeDataLazyLoadingApi';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

interface GridTreeDataLazyLoadHelpers {
  success: (rows: GridRowModel[]) => void;
  error: () => void;
}

export interface GridFetchRowChildrenParams {
  row: GridRowModel | undefined;
  helpers: GridTreeDataLazyLoadHelpers;
}

export const getLazyLoadingHelpers = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  rowNode: GridServerSideGroupNode,
) => ({
  success: (rows: GridRowModel[]) => {
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
  },
  error: () => {
    apiRef.current.setRowLoadingStatus(rowNode!.id, false);
  },
});

export const useGridTreeDataLazyLoading = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<DataGridProProcessedProps, 'treeData' | 'rowsLoadingMode' | 'onFetchRowChildren'>,
) => {
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

  const treeDataLazyLoadingApi: GridTreeDataLazyLoadingApi = {
    setRowLoadingStatus,
  };

  useGridApiMethod(apiRef, treeDataLazyLoadingApi, 'public');
  useGridApiOptionHandler(apiRef, 'fetchRowChildren', props.onFetchRowChildren);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.treeData && props.rowsLoadingMode === 'server') {
      const helpers = getLazyLoadingHelpers(
        apiRef,
        apiRef.current.getRowNode(GRID_ROOT_GROUP_ID) as GridServerSideGroupNode,
      );
      apiRef.current.publishEvent('fetchRowChildren', { row: undefined, helpers });
    }
  }, [apiRef, props.treeData, props.rowsLoadingMode]);
};
