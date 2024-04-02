import * as React from 'react';
import {
  gridPaginationModelSelector,
  gridFilterModelSelector,
  gridSortModelSelector,
  useGridApiEventHandler,
  GridPaginationModel,
  gridRowsLoadingSelector,
  useGridApiMethod,
  GridServerSideGroupNode,
} from '@mui/x-data-grid';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import {
  GridGetRowsParams,
  GridGetRowsResponse,
  GridDataSource,
} from '../../../models/gridDataSource';
import { GridDataSourceApi } from './serverSideInterfaces';

const computeStartEnd = (paginationModel: GridPaginationModel) => {
  const start = paginationModel.page * paginationModel.pageSize;
  const end = start + paginationModel.pageSize - 1;
  return { start, end };
};

const fetchRowsWithError = async (
  getRows: GridDataSource['getRows'],
  inputParams: GridGetRowsParams,
) => {
  try {
    const getRowsResponse = await getRows(inputParams);
    return getRowsResponse;
  } catch (error) {
    throw new Error(
      `MUI X: Error in fetching rows for the input params: ${JSON.stringify(inputParams)}`,
    );
  }
};

const runIfServerMode = (modeProp: 'server' | 'client', fn: Function) => () => {
  if (modeProp === 'server') {
    fn();
  }
};

export const useGridDataSource = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    'unstable_dataSource' | 'sortingMode' | 'filterMode' | 'paginationMode' | 'treeData'
  >,
): void => {
  const getInputParams = React.useCallback(
    (additionalParams?: Partial<GridGetRowsParams>): GridGetRowsParams => {
      const paginationModel = gridPaginationModelSelector(privateApiRef);

      // const otherParams = privateApiRef.current.unstable_applyPipeProcessors('getRowsParams', {});
      return {
        groupKeys: [],
        paginationModel,
        sortModel: gridSortModelSelector(privateApiRef),
        filterModel: gridFilterModelSelector(privateApiRef),
        ...computeStartEnd(paginationModel),
        ...additionalParams,
      };
    },
    [privateApiRef],
  );

  const fetchTopLevelRows = React.useCallback(async () => {
    const getRows = props.unstable_dataSource?.getRows;
    if (!getRows) {
      return;
    }

    const inputParams = getInputParams();
    const cachedData = privateApiRef.current.getCacheData(inputParams) as
      | GridGetRowsResponse
      | undefined;
    if (cachedData != null) {
      const rows = cachedData.rows;
      privateApiRef.current.caches.groupKeys = [];
      privateApiRef.current.setRows(rows);
      if (cachedData.rowCount) {
        privateApiRef.current.setRowCount(cachedData.rowCount);
      }
    } else {
      const isLoading = gridRowsLoadingSelector(privateApiRef);
      if (!isLoading) {
        privateApiRef.current.setLoading(true);
      }

      const getRowsResponse = await fetchRowsWithError(getRows, inputParams);
      // TODO: Add respective events
      // @ts-expect-error
      privateApiRef.current.publishEvent('loadData', {
        params: inputParams,
        response: getRowsResponse,
      });
      privateApiRef.current.setCacheData(inputParams, getRowsResponse);
      if (getRowsResponse.rowCount) {
        privateApiRef.current.setRowCount(getRowsResponse.rowCount);
      }
      privateApiRef.current.caches.groupKeys = [];
      privateApiRef.current.setRows(getRowsResponse.rows);
      privateApiRef.current.setLoading(false);
      // TODO: handle cursor based pagination
    }
  }, [getInputParams, privateApiRef, props.unstable_dataSource]);

  const fetchRowChildren = React.useCallback<GridDataSourceApi['fetchRowChildren']>(
    async (id) => {
      if (!props.treeData) {
        return;
      }
      const getRows = props.unstable_dataSource?.getRows;
      if (!getRows) {
        return;
      }

      const rowNode = privateApiRef.current.getRowNode(id) as GridServerSideGroupNode;
      if (!rowNode) {
        return;
      }
      const inputParams = getInputParams({ groupKeys: rowNode.path });

      const cachedData = privateApiRef.current.getCacheData(inputParams) as
        | GridGetRowsResponse
        | undefined;

      if (cachedData != null) {
        const rows = cachedData.rows;
        privateApiRef.current.caches.groupKeys = rowNode.path;
        privateApiRef.current.updateRows(rows);
        if (cachedData.rowCount) {
          privateApiRef.current.setRowCount(cachedData.rowCount);
        }
        privateApiRef.current.setRowChildrenExpansion(id, true);
        privateApiRef.current.setChildrenFetched(id, true);
      } else {
        const isLoading = rowNode.isLoading;
        if (!isLoading) {
          privateApiRef.current.setRowLoading(id, true);
        }
        const getRowsResponse = await fetchRowsWithError(getRows, inputParams);
        privateApiRef.current.setCacheData(inputParams, getRowsResponse);
        if (getRowsResponse.rowCount) {
          privateApiRef.current.setRowCount(getRowsResponse.rowCount);
        }
        privateApiRef.current.caches.groupKeys = rowNode.path;
        privateApiRef.current.updateRows(getRowsResponse.rows);
        privateApiRef.current.setRowChildrenExpansion(id, true);
        privateApiRef.current.setChildrenFetched(id, true);
        privateApiRef.current.setRowLoading(id, false);
      }
    },
    [getInputParams, privateApiRef, props.treeData, props.unstable_dataSource?.getRows],
  );

  const setRowLoading = React.useCallback<GridDataSourceApi['setRowLoading']>(
    (id, isLoading) => {
      const currentNode = privateApiRef.current.getRowNode(id) as GridServerSideGroupNode;
      if (!currentNode) {
        throw new Error(`MUI: No row with id #${id} found`);
      }

      const newNode: GridServerSideGroupNode = { ...currentNode, isLoading };
      privateApiRef.current.setState((state) => {
        return {
          ...state,
          rows: {
            ...state.rows,
            tree: { ...state.rows.tree, [id]: newNode },
          },
        };
      });
    },
    [privateApiRef],
  );

  const setChildrenFetched = React.useCallback<GridDataSourceApi['setChildrenFetched']>(
    (id, childrenFetched) => {
      const currentNode = privateApiRef.current.getRowNode(id) as GridServerSideGroupNode;
      if (!currentNode) {
        throw new Error(`MUI: No row with id #${id} found`);
      }

      const newNode: GridServerSideGroupNode = { ...currentNode, childrenFetched };
      privateApiRef.current.setState((state) => {
        return {
          ...state,
          rows: {
            ...state.rows,
            tree: { ...state.rows.tree, [id]: newNode },
          },
        };
      });
    },
    [privateApiRef],
  );

  const dataSourceApi: GridDataSourceApi = {
    fetchRowChildren,
    setRowLoading,
    setChildrenFetched,
    fetchTopLevelRows,
  };

  useGridApiMethod(privateApiRef, dataSourceApi, 'public');

  /*
   * EVENTS
   */
  useGridApiEventHandler(
    privateApiRef,
    'sortModelChange',
    runIfServerMode(props.sortingMode, fetchTopLevelRows),
  );
  useGridApiEventHandler(
    privateApiRef,
    'filterModelChange',
    runIfServerMode(props.filterMode, fetchTopLevelRows),
  );
  useGridApiEventHandler(
    privateApiRef,
    'paginationModelChange',
    runIfServerMode(props.paginationMode, fetchTopLevelRows),
  );

  /*
   * EFFECTS
   */
  React.useEffect(() => {
    if (props.unstable_dataSource) {
      privateApiRef.current.clearCache();
      privateApiRef.current.fetchTopLevelRows();
    }
  }, [privateApiRef, props.unstable_dataSource]);
};
