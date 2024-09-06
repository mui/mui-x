import * as React from 'react';
import { LRUCache } from 'lru-cache';
import {
  getGridDefaultColumnTypes,
  GridRowModel,
  GridGetRowsParams,
  GridGetRowsResponse,
  GridColDef,
  GridInitialState,
  GridColumnVisibilityModel,
} from '@mui/x-data-grid-pro';
import {
  UseDemoDataOptions,
  getColumnsFromOptions,
  extrapolateSeed,
  deepFreeze,
} from './useDemoData';
import { GridColDefGenerator } from '../services/gridColDefGenerator';
import { getRealGridData, GridDemoData } from '../services/real-data-service';
import { addTreeDataOptionsToDemoData } from '../services/tree-data-generator';
import {
  loadServerRows,
  processTreeDataRows,
  processRowGroupingRows,
  DEFAULT_DATASET_OPTIONS,
  DEFAULT_SERVER_OPTIONS,
} from './serverUtils';
import type { ServerOptions } from './serverUtils';
import { randomInt } from '../services';
import { useMovieData } from './useMovieData';

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

function decodeParams(url: string): GridGetRowsParams {
  const params = new URL(url).searchParams;
  const decodedParams = {} as any;
  const array = Array.from(params.entries());

  for (const [key, value] of array) {
    try {
      decodedParams[key] = JSON.parse(value);
    } catch (e) {
      decodedParams[key] = value;
    }
  }

  return decodedParams as GridGetRowsParams;
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
  dataSetOptions?: Partial<UseDemoDataOptions> & Partial<{ rowGrouping?: boolean }>,
  serverOptions?: ServerOptions & { verbose?: boolean },
  shouldRequestsFail?: boolean,
): UseMockServerResponse => {
  const [data, setData] = React.useState<GridDemoData>();
  const [index, setIndex] = React.useState(0);
  const shouldRequestsFailRef = React.useRef<boolean>(shouldRequestsFail ?? false);

  const rowGroupingData = useMovieData();

  React.useEffect(() => {
    if (shouldRequestsFail !== undefined) {
      shouldRequestsFailRef.current = shouldRequestsFail;
    }
  }, [shouldRequestsFail]);

  const options = { ...DEFAULT_DATASET_OPTIONS, ...dataSetOptions };

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

  const isTreeData = options.treeData?.groupingField != null;
  const isRowGrouping = dataSetOptions?.rowGrouping;

  const columnsWithDefaultColDef: GridColDef[] = React.useMemo(
    () =>
      (isRowGrouping ? rowGroupingData.columns : columns).map((column) => ({
        ...defaultColDef[column.type || 'string'],
        ...column,
      })),
    [columns, rowGroupingData.columns, isRowGrouping],
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
    if (dataSetOptions?.rowGrouping) {
      return undefined;
    }
    const cacheKey = `${options.dataSet}-${options.rowLength}-${index}-${options.maxColumns}`;

    // Cache to allow fast switch between the JavaScript and TypeScript version
    // of the demos.
    if (dataCache.has(cacheKey)) {
      const newData = dataCache.get(cacheKey)!;
      setData(newData);
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
    dataSetOptions?.rowGrouping,
  ]);

  const fetchRows = React.useCallback(
    async (requestUrl: string): Promise<GridGetRowsResponse> => {
      if ((!data && !rowGroupingData.rows && isRowGrouping) || !requestUrl) {
        sendEmptyResponse();
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
        const { rows, rootRowCount } = await processTreeDataRows(
          data!.rows,
          params,
          serverOptionsWithDefault,
          columnsWithDefaultColDef,
        );

        getRowsResponse = {
          rows: rows.slice().map((row) => ({ ...row, path: undefined })),
          rowCount: rootRowCount,
        };
      } else if (isRowGrouping) {
        const { rows, rootRowCount } = await processRowGroupingRows(
          rowGroupingData.rows,
          params,
          serverOptionsWithDefault,
          columnsWithDefaultColDef,
        );

        getRowsResponse = {
          rows: rows.slice().map((row) => ({ ...row, path: undefined })),
          rowCount: rootRowCount,
        };
      } else {
        const { returnedRows, nextCursor, totalRowCount } = await loadServerRows(
          data!.rows,
          { ...params, ...params.paginationModel },
          serverOptionsWithDefault,
          columnsWithDefaultColDef,
        );
        getRowsResponse = { rows: returnedRows, rowCount: totalRowCount, pageInfo: { nextCursor } };
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
      rowGroupingData.rows,
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
    initialState: isRowGrouping ? {} : initialState,
    getGroupKey,
    getChildrenCount,
    fetchRows,
    loadNewData: () => {
      setIndex((oldIndex) => oldIndex + 1);
    },
  };
};
