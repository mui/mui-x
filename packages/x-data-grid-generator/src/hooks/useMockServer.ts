'use client';
import * as React from 'react';
import { LRUCache } from 'lru-cache';
import {
  getGridDefaultColumnTypes,
  type GridGetRowsResponse,
  type GridRowId,
  type GridRowModel,
  type GridColDef,
  type GridInitialState,
  type GridColumnVisibilityModel,
} from '@mui/x-data-grid-premium';
import { extrapolateSeed, deepFreeze } from './useDemoData';
import { getCommodityColumns } from '../columns/commodities.columns';
import { getEmployeeColumns } from '../columns/employees.columns';
import { GridColDefGenerator } from '../services/gridColDefGenerator';
import { getRealGridData, GridDemoData } from '../services/real-data-service';
import {
  addTreeDataOptionsToDemoData,
  AddPathToDemoDataOptions,
} from '../services/tree-data-generator';
import {
  loadServerRows,
  processTreeDataRows,
  processRowGroupingRows,
  DEFAULT_SERVER_OPTIONS,
} from './serverUtils';
import type { ServerOptions } from './serverUtils';
import { randomInt } from '../services';
import { getMovieRows, getMovieColumns } from './useMovieData';

const dataCache = new LRUCache<string, GridDemoData>({
  max: 10,
  ttl: 60 * 5 * 1e3, // 5 minutes
});

export const BASE_URL = 'https://mui.com/x/api/data-grid';

type UseMockServerResponse<T> = {
  columns: GridColDef[];
  initialState: GridInitialState;
  getGroupKey?: (row: GridRowModel) => string;
  getChildrenCount?: (row: GridRowModel) => number;
  fetchRows: (url: string) => Promise<T>;
  editRow: (rowId: GridRowId, updatedRow: GridRowModel) => Promise<GridRowModel>;
  loadNewData: () => void;
  isReady: boolean;
};

type DataSet = 'Commodity' | 'Employee' | 'Movies';

interface UseMockServerOptions {
  dataSet: DataSet;
  /**
   * Has no effect when DataSet='Movies'
   */
  rowLength: number;
  maxColumns?: number;
  visibleFields?: string[];
  editable?: boolean;
  treeData?: AddPathToDemoDataOptions;
  rowGrouping?: boolean;
}

interface GridMockServerData {
  rows: GridRowModel[];
  columns: GridColDefGenerator[] | GridColDef[];
  initialState?: GridInitialState;
}

interface ColumnsOptions
  extends Pick<UseMockServerOptions, 'dataSet' | 'editable' | 'maxColumns' | 'visibleFields'> {}

const GET_DEFAULT_DATASET_OPTIONS: (isRowGrouping: boolean) => UseMockServerOptions = (
  isRowGrouping,
) => ({
  dataSet: isRowGrouping ? 'Movies' : 'Commodity',
  rowLength: isRowGrouping ? getMovieRows().length : 100,
  maxColumns: 6,
});

const getColumnsFromOptions = (options: ColumnsOptions): GridColDefGenerator[] | GridColDef[] => {
  let columns;

  switch (options.dataSet) {
    case 'Commodity':
      columns = getCommodityColumns(options.editable);
      break;
    case 'Employee':
      columns = getEmployeeColumns();
      break;
    case 'Movies':
      columns = getMovieColumns();
      break;
    default:
      throw new Error('Unknown dataset');
  }

  if (options.visibleFields) {
    columns = columns.map((col) => ({ ...col, hide: !options.visibleFields?.includes(col.field) }));
  }
  if (options.maxColumns) {
    columns = columns.slice(0, options.maxColumns);
  }
  return columns;
};

function decodeParams(url: string) {
  const params = new URL(url).searchParams;
  const decodedParams = {} as any;
  const array = Array.from(params.entries());

  for (const [key, value] of array) {
    try {
      decodedParams[key] = JSON.parse(value);
    } catch {
      decodedParams[key] = value;
    }
  }

  return decodedParams;
}

const getInitialState = (columns: GridColDefGenerator[], groupingField?: string) => {
  const columnVisibilityModel: GridColumnVisibilityModel = {};
  columns.forEach((col) => {
    if (col.hide) {
      columnVisibilityModel[col.field] = false;
    }
  });

  if (groupingField) {
    columnVisibilityModel![groupingField] = false;
  }

  return { columns: { columnVisibilityModel } };
};

const defaultColDef = getGridDefaultColumnTypes();

function sendEmptyResponse<T>() {
  return new Promise<T>((resolve) => {
    resolve({ rows: [], rowCount: 0 } as unknown as T);
  });
}

export const useMockServer = <T extends GridGetRowsResponse>(
  dataSetOptions?: Partial<UseMockServerOptions>,
  serverOptions?: ServerOptions & { verbose?: boolean },
  shouldRequestsFail?: boolean,
  nestedPagination?: boolean,
): UseMockServerResponse<T> => {
  const dataRef = React.useRef<GridMockServerData>(null);
  const [isDataReady, setDataReady] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const shouldRequestsFailRef = React.useRef<boolean>(shouldRequestsFail ?? false);

  React.useEffect(() => {
    if (shouldRequestsFail !== undefined) {
      shouldRequestsFailRef.current = shouldRequestsFail;
    }
  }, [shouldRequestsFail]);

  const isRowGrouping = dataSetOptions?.rowGrouping ?? false;

  const options = { ...GET_DEFAULT_DATASET_OPTIONS(isRowGrouping), ...dataSetOptions };

  const isTreeData = options.treeData?.groupingField != null;

  const columns = React.useMemo(() => {
    return getColumnsFromOptions({
      dataSet: options.dataSet,
      editable: options.editable,
      maxColumns: options.maxColumns,
      visibleFields: options.visibleFields,
    });
  }, [options.dataSet, options.editable, options.maxColumns, options.visibleFields]);

  const initialState = React.useMemo(
    () => getInitialState(columns, options.treeData?.groupingField),
    [columns, options.treeData?.groupingField],
  );

  const columnsWithDefaultColDef: GridColDef[] = React.useMemo(
    () =>
      columns.map((column) => ({
        ...defaultColDef[column.type || 'string'],
        ...column,
      })),
    [columns],
  );

  const getGroupKey = React.useMemo(() => {
    if (isTreeData) {
      return (row: GridRowModel): string => row[options.treeData!.groupingField!];
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.treeData?.groupingField, isTreeData]);

  const getChildrenCount = React.useMemo(() => {
    if (isTreeData) {
      return (row: GridRowModel): number => row.descendantCount;
    }
    return undefined;
  }, [isTreeData]);

  React.useEffect(() => {
    const cacheKey = `${options.dataSet}-${options.rowLength}-${index}-${options.maxColumns}`;

    // Cache to allow fast switch between the JavaScript and TypeScript version
    // of the demos.
    if (dataCache.has(cacheKey)) {
      const newData = dataCache.get(cacheKey)!;
      dataRef.current = newData;
      setDataReady(true);
      return undefined;
    }

    if (options.dataSet === 'Movies') {
      const rowsData = { rows: getMovieRows(), columns };
      dataRef.current = rowsData;
      setDataReady(true);
      dataCache.set(cacheKey, rowsData);
      return undefined;
    }

    let active = true;

    (async () => {
      let rowData;
      const rowLength = options.rowLength;
      if (rowLength > 1000) {
        rowData = await getRealGridData(1000, columns);
        rowData = await extrapolateSeed(rowLength, rowData);
      } else {
        rowData = await getRealGridData(rowLength, columns);
      }

      if (!active) {
        return;
      }

      if (isTreeData) {
        rowData = addTreeDataOptionsToDemoData(rowData, {
          maxDepth: options.treeData?.maxDepth,
          groupingField: options.treeData?.groupingField,
          averageChildren: options.treeData?.averageChildren,
        });
      }

      if (process.env.NODE_ENV !== 'production') {
        deepFreeze(rowData);
      }

      dataCache.set(cacheKey, rowData);
      dataRef.current = rowData;
      setDataReady(true);
    })();

    return () => {
      active = false;
    };
  }, [
    columns,
    isTreeData,
    options.rowLength,
    options.treeData?.maxDepth,
    options.treeData?.groupingField,
    options.treeData?.averageChildren,
    options.dataSet,
    options.maxColumns,
    index,
  ]);

  const fetchRows = React.useCallback(
    async (requestUrl: string): Promise<T> => {
      if (!requestUrl || !isDataReady) {
        return sendEmptyResponse<T>();
      }
      const params = decodeParams(requestUrl);
      const verbose = serverOptions?.verbose ?? true;
      // eslint-disable-next-line no-console
      const print = console.info;
      if (verbose) {
        print('MUI X: DATASOURCE REQUEST', params);
      }
      let getRowsResponse: GridGetRowsResponse;
      const serverOptionsWithDefault = {
        minDelay: serverOptions?.minDelay ?? DEFAULT_SERVER_OPTIONS.minDelay,
        maxDelay: serverOptions?.maxDelay ?? DEFAULT_SERVER_OPTIONS.maxDelay,
        useCursorPagination:
          serverOptions?.useCursorPagination ?? DEFAULT_SERVER_OPTIONS.useCursorPagination,
      };

      if (shouldRequestsFailRef.current) {
        const { minDelay, maxDelay } = serverOptionsWithDefault;
        const delay = randomInt(minDelay, maxDelay);
        return new Promise<T>((_, reject) => {
          if (verbose) {
            print('MUI X: DATASOURCE REQUEST FAILURE', params);
          }
          setTimeout(() => reject(new Error('Could not fetch the data')), delay);
        });
      }

      if (isTreeData) {
        const { rows, rootRowCount, aggregateRow } = await processTreeDataRows(
          dataRef.current?.rows ?? [],
          params,
          serverOptionsWithDefault,
          columnsWithDefaultColDef,
          nestedPagination ?? false,
        );

        getRowsResponse = {
          rows: rows.slice().map((row) => ({ ...row, path: undefined })),
          rowCount: rootRowCount,
          ...(aggregateRow ? { aggregateRow } : {}),
        };
      } else if (isRowGrouping) {
        const { rows, rootRowCount, aggregateRow } = await processRowGroupingRows(
          dataRef.current?.rows ?? [],
          params,
          serverOptionsWithDefault,
          columnsWithDefaultColDef,
        );

        getRowsResponse = {
          rows: rows.slice().map((row) => ({ ...row, path: undefined })),
          rowCount: rootRowCount,
          ...(aggregateRow ? { aggregateRow } : {}),
        };
      } else {
        const { returnedRows, nextCursor, totalRowCount, aggregateRow } = await loadServerRows(
          dataRef.current?.rows ?? [],
          { ...params, ...params.paginationModel },
          serverOptionsWithDefault,
          columnsWithDefaultColDef,
        );
        getRowsResponse = {
          rows: returnedRows,
          rowCount: totalRowCount,
          pageInfo: { nextCursor },
          ...(aggregateRow ? { aggregateRow } : {}),
        };
      }

      return new Promise<T>((resolve) => {
        if (verbose) {
          print('MUI X: DATASOURCE RESPONSE', params, getRowsResponse);
        }
        resolve(getRowsResponse as T);
      });
    },
    [
      dataRef,
      isDataReady,
      serverOptions?.verbose,
      serverOptions?.minDelay,
      serverOptions?.maxDelay,
      serverOptions?.useCursorPagination,
      isTreeData,
      columnsWithDefaultColDef,
      nestedPagination,
      isRowGrouping,
    ],
  );

  const editRow = React.useCallback(
    async (rowId: GridRowId, updatedRow: GridRowModel) => {
      return new Promise<GridRowModel>((resolve, reject) => {
        const minDelay = serverOptions?.minDelay ?? DEFAULT_SERVER_OPTIONS.minDelay;
        const maxDelay = serverOptions?.maxDelay ?? DEFAULT_SERVER_OPTIONS.maxDelay;
        const delay = randomInt(minDelay, maxDelay);

        const verbose = serverOptions?.verbose ?? true;
        // eslint-disable-next-line no-console
        const print = console.info;
        if (verbose) {
          print('MUI X: DATASOURCE EDIT ROW REQUEST', { rowId, updatedRow });
        }

        if (shouldRequestsFailRef.current) {
          setTimeout(
            () => reject(new Error(`Could not update the row with the id ${rowId}`)),
            delay,
          );
          if (verbose) {
            print('MUI X: DATASOURCE EDIT ROW FAILURE', { rowId, updatedRow });
          }
          return;
        }

        const newRows = [...(dataRef.current?.rows || [])];
        const rowIndex = newRows.findIndex((row) => row.id === rowId) ?? -1;
        if (rowIndex === -1) {
          return;
        }
        newRows[rowIndex] = updatedRow;
        const newData = { ...dataRef.current, rows: newRows } as GridDemoData;
        const cacheKey = `${options.dataSet}-${options.rowLength}-${index}-${options.maxColumns}`;
        dataCache.set(cacheKey, newData!);
        setTimeout(() => {
          if (verbose) {
            print('MUI X: DATASOURCE EDIT ROW SUCCESS', { rowId, updatedRow });
          }
          resolve(updatedRow);
        }, delay);
        dataRef.current = newData;
      });
    },
    [
      index,
      options.dataSet,
      options.maxColumns,
      options.rowLength,
      serverOptions?.maxDelay,
      serverOptions?.minDelay,
      serverOptions?.verbose,
    ],
  );

  return {
    columns: columnsWithDefaultColDef,
    initialState: options.dataSet === 'Movies' ? {} : initialState,
    getGroupKey,
    getChildrenCount,
    fetchRows,
    editRow,
    loadNewData: () => {
      setIndex((oldIndex) => oldIndex + 1);
    },
    isReady: isDataReady,
  };
};
