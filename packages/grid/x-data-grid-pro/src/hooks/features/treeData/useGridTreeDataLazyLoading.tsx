import * as React from 'react';
import {
  GridServerSideGroupNode,
  GridRowModel,
  useGridApiMethod,
  GRID_ROOT_GROUP_ID,
  useGridApiOptionHandler,
  useGridApiEventHandler,
  GridFilterModel,
  GridEventListener,
} from '@mui/x-data-grid';
import { GridTreeDataLazyLoadingApi } from './gridTreeDataLazyLoadingApi';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';

interface GridTreeDataLazyLoadHelpers {
  success: (rows: GridRowModel[]) => void;
  error: () => void;
}

export interface GridFetchRowChildrenParams {
  row?: GridRowModel | undefined;
  helpers: GridTreeDataLazyLoadHelpers;
  filterModel?: GridFilterModel;
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

export const useGridTreeDataLazyLoading = (
  apiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'treeData' | 'rowsLoadingMode' | 'onFetchRowChildren' | 'filterMode'
  >,
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

  const onFilterModelChange = React.useCallback<GridEventListener<'filterModelChange'>>(
    (filterModel: GridFilterModel) => {
      if (props.treeData && props.rowsLoadingMode === 'server' && props.filterMode === 'server') {
        const helpers = getLazyLoadingHelpers(
          apiRef,
          apiRef.current.getRowNode(GRID_ROOT_GROUP_ID) as GridServerSideGroupNode,
          'full',
        );
        apiRef.current.publishEvent('fetchRowChildren', { filterModel, helpers });
      }
    },
    [apiRef, props.filterMode, props.rowsLoadingMode, props.treeData],
  );

  const treeDataLazyLoadingApi: GridTreeDataLazyLoadingApi = {
    setRowLoadingStatus,
  };

  useGridApiMethod(apiRef, treeDataLazyLoadingApi, 'public');
  useGridApiOptionHandler(apiRef, 'fetchRowChildren', props.onFetchRowChildren);
  useGridApiEventHandler(apiRef, 'filterModelChange', onFilterModelChange);

  /**
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.treeData && props.rowsLoadingMode === 'server') {
      const filterModel = apiRef.current.state.filter?.filterModel;
      const helpers = getLazyLoadingHelpers(
        apiRef,
        apiRef.current.getRowNode(GRID_ROOT_GROUP_ID) as GridServerSideGroupNode,
      );
      apiRef.current.publishEvent('fetchRowChildren', { helpers, filterModel });
    }
  }, [apiRef, props.treeData, props.rowsLoadingMode]);
};
