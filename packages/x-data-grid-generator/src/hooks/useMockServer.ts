import * as React from 'react';
import { LRUCache } from 'lru-cache';
import {
  getGridDefaultColumnTypes,
  GridRowModel,
  GridGetRowsResponse,
  GridColDef,
  GridInitialState,
  GridColumnVisibilityModel,
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

type UseMockServerResponse = {
  columns: GridColDef[];
  initialState: GridInitialState;
  getGroupKey?: (row: GridRowModel) => string;
  getChildrenCount?: (row: GridRowModel) => number;
  fetchRows: (url: string) => Promise<GridGetRowsResponse>;
  loadNewData: () => void;
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
    columns = columns.map((col) =>
      options.visibleFields?.includes(col.field) ? col : { ...col, hide: true },
    );
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

function sendEmptyResponse() {
  return new Promise<GridGetRowsResponse>((resolve) => {
    resolve({ rows: [], rowCount: 0 });
  });
}

export const useMockServer = (
  dataSetOptions?: Partial<UseMockServerOptions>,
  serverOptions?: ServerOptions & { verbose?: boolean },
  shouldRequestsFail?: boolean,
): UseMockServerResponse => {
  const [data, setData] = React.useState<GridMockServerData>();
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
      setData(newData);
      return undefined;
    }

    if (options.dataSet === 'Movies') {
      const rowsData = { rows: getMovieRows(), columns };
      setData(rowsData);
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
      setData(rowData);
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
    async (requestUrl: string): Promise<GridGetRowsResponse> => {
      if (!requestUrl || !data?.rows) {
        return sendEmptyResponse();
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
        return new Promise<GridGetRowsResponse>((_, reject) => {
          if (verbose) {
            print('MUI X: DATASOURCE REQUEST FAILURE', params);
          }
          setTimeout(() => reject(new Error('Could not fetch the data')), delay);
        });
      }

      if (isTreeData) {
        const { rows, rootRowCount, aggregateRow } = await processTreeDataRows(
          data?.rows ?? [],
          params,
          serverOptionsWithDefault,
          columnsWithDefaultColDef,
        );

        getRowsResponse = {
          rows: rows.slice().map((row) => ({ ...row, path: undefined })),
          rowCount: rootRowCount,
          ...(aggregateRow ? { aggregateRow } : {}),
        };
      } else if (isRowGrouping) {
        const { rows, rootRowCount, aggregateRow } = await processRowGroupingRows(
          data?.rows ?? [],
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
          data?.rows ?? [],
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

      return new Promise<GridGetRowsResponse>((resolve) => {
        if (verbose) {
          print('MUI X: DATASOURCE RESPONSE', params, getRowsResponse);
        }
        resolve(getRowsResponse);
      });
    },
    [
      data,
      serverOptions?.verbose,
      serverOptions?.minDelay,
      serverOptions?.maxDelay,
      serverOptions?.useCursorPagination,
      isTreeData,
      columnsWithDefaultColDef,
      isRowGrouping,
    ],
  );

  return {
    columns: columnsWithDefaultColDef,
    initialState: options.dataSet === 'Movies' ? {} : initialState,
    getGroupKey,
    getChildrenCount,
    fetchRows,
    loadNewData: () => {
      setIndex((oldIndex) => oldIndex + 1);
    },
  };
};
