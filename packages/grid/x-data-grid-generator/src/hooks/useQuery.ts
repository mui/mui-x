import * as React from 'react';
import {
  getGridDefaultColumnTypes,
  GridRowModel,
  GridFilterModel,
  GridSortModel,
  GridRowId,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { isDeepEqual } from '@mui/x-data-grid/internals';
import {
  useDemoData,
  UseDemoDataOptions,
  getColumnsFromOptions,
  getInitialState,
} from './useDemoData';
import {
  findTreeDataRowChildren,
  getFilteredRowsServerSide,
  getRowComparator,
  getFilteredRows,
} from './fakeServerUtils';

/**
 * Simulates server data loading
 */
export const loadTreeDataServerRows = (
  rows: GridRowModel[],
  queryOptions: TreeDataQueryOptions,
  serverOptions: ServerOptions,
  columnsWithDefaultColDef: GridColDef[],
  pathKey: string = 'path',
): Promise<FakeServerTreeDataResponse> => {
  const { minDelay = 500, maxDelay = 800 } = serverOptions;

  if (maxDelay < minDelay) {
    throw new Error('serverOptions.minDelay is larger than serverOptions.maxDelay ');
  }
  const delay = Math.random() * (maxDelay - minDelay) + minDelay;

  const { path } = queryOptions;

  // apply filtering
  const filteredRows = getFilteredRowsServerSide(
    rows,
    queryOptions.filterModel,
    columnsWithDefaultColDef,
  );

  // find direct children referring to the `parentPath`
  const childRows = findTreeDataRowChildren(filteredRows, path);
  let childRowsWithDescendantCounts = childRows.map((row) => {
    const descendants = findTreeDataRowChildren(filteredRows, row[pathKey], pathKey, -1);
    const descendantCount = descendants.length;
    return { ...row, descendantCount, hasChildren: descendantCount > 0 };
  });

  // apply sorting
  const rowComparator = getRowComparator(queryOptions.sortModel, columnsWithDefaultColDef);
  childRowsWithDescendantCounts = [...childRowsWithDescendantCounts].sort(rowComparator);

  return new Promise<FakeServerTreeDataResponse>((resolve) => {
    setTimeout(() => {
      resolve(childRowsWithDescendantCounts);
    }, delay); // simulate network latency
  });
};

/**
 * Simulates server data loading
 */
export const loadServerRows = (
  rows: GridRowModel[],
  queryOptions: QueryOptions,
  serverOptions: ServerOptions,
  columnsWithDefaultColDef: GridColDef[],
): Promise<FakeServerResponse> => {
  const { minDelay = 100, maxDelay = 300, useCursorPagination } = serverOptions;

  if (maxDelay < minDelay) {
    throw new Error('serverOptions.minDelay is larger than serverOptions.maxDelay ');
  }
  const delay = Math.random() * (maxDelay - minDelay) + minDelay;

  const { cursor, page = 0, pageSize } = queryOptions;

  let nextCursor;
  let firstRowIndex;
  let lastRowIndex;

  let filteredRows = getFilteredRows(rows, queryOptions.filterModel, columnsWithDefaultColDef);

  const rowComparator = getRowComparator(queryOptions.sortModel, columnsWithDefaultColDef);
  filteredRows = [...filteredRows].sort(rowComparator);

  const totalRowCount = filteredRows.length;
  if (!pageSize) {
    firstRowIndex = 0;
    lastRowIndex = filteredRows.length;
  } else if (useCursorPagination) {
    firstRowIndex = cursor ? filteredRows.findIndex(({ id }) => id === cursor) : 0;
    firstRowIndex = Math.max(firstRowIndex, 0); // if cursor not found return 0
    lastRowIndex = firstRowIndex + pageSize;

    nextCursor = lastRowIndex >= filteredRows.length ? undefined : filteredRows[lastRowIndex].id;
  } else {
    firstRowIndex = page * pageSize;
    lastRowIndex = (page + 1) * pageSize;
  }
  const response: FakeServerResponse = {
    returnedRows: filteredRows.slice(firstRowIndex, lastRowIndex),
    nextCursor,
    totalRowCount,
  };

  return new Promise<FakeServerResponse>((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, delay); // simulate network latency
  });
};

interface FakeServerResponse {
  returnedRows: GridRowModel[];
  nextCursor?: string;
  totalRowCount: number;
}

type FakeServerTreeDataResponse = GridRowModel[];

interface PageInfo {
  totalRowCount?: number;
  nextCursor?: string;
  pageSize?: number;
}

interface DefaultServerOptions {
  minDelay: number;
  maxDelay: number;
  useCursorPagination?: boolean;
}

type ServerOptions = Partial<DefaultServerOptions>;

export interface QueryOptions {
  cursor?: GridRowId;
  page?: number;
  pageSize?: number;
  // TODO: implement the behavior liked to following models
  filterModel?: GridFilterModel;
  sortModel?: GridSortModel;
  firstRowToRender?: number;
  lastRowToRender?: number;
}

export interface TreeDataQueryOptions {
  path: string[];
  filterModel?: GridFilterModel;
  sortModel?: GridSortModel;
}

const DEFAULT_DATASET_OPTIONS: UseDemoDataOptions = {
  dataSet: 'Commodity',
  rowLength: 100,
  maxColumns: 6,
};

declare const DISABLE_CHANCE_RANDOM: any;
const disableDelay = typeof DISABLE_CHANCE_RANDOM !== 'undefined' && DISABLE_CHANCE_RANDOM;

const DEFAULT_SERVER_OPTIONS: DefaultServerOptions = {
  minDelay: disableDelay ? 0 : 100,
  maxDelay: disableDelay ? 0 : 300,
  useCursorPagination: true,
};

export const createFakeServer = (
  dataSetOptions?: Partial<UseDemoDataOptions>,
  serverOptions?: ServerOptions,
) => {
  const dataSetOptionsWithDefault = { ...DEFAULT_DATASET_OPTIONS, ...dataSetOptions };
  const serverOptionsWithDefault = { ...DEFAULT_SERVER_OPTIONS, ...serverOptions };

  const columns = getColumnsFromOptions(dataSetOptionsWithDefault);
  const initialState = getInitialState(dataSetOptionsWithDefault, columns);

  const defaultColDef = getGridDefaultColumnTypes();
  const columnsWithDefaultColDef = columns.map((column) => ({
    ...defaultColDef[column.type || 'string'],
    ...column,
  }));

  const useQuery = (queryOptions: QueryOptions) => {
    const {
      data: { rows },
      loading: dataGenerationIsLoading,
    } = useDemoData(dataSetOptionsWithDefault);

    const queryOptionsRef = React.useRef(queryOptions);
    const [response, setResponse] = React.useState<{
      pageInfo: PageInfo;
      rows: GridRowModel[];
    }>({ pageInfo: {}, rows: [] });
    const [isLoading, setIsLoading] = React.useState<boolean>(dataGenerationIsLoading);

    React.useEffect(() => {
      if (dataGenerationIsLoading) {
        // dataset is not ready
        return () => {};
      }

      queryOptionsRef.current = queryOptions;
      let active = true;

      setIsLoading(true);
      setResponse((prev) =>
        Object.keys(prev.pageInfo).length === 0 ? prev : { ...prev, pageInfo: {} },
      );

      (async function fetchData() {
        const { returnedRows, nextCursor, totalRowCount } = await loadServerRows(
          rows,
          queryOptions,
          serverOptionsWithDefault,
          columnsWithDefaultColDef,
        );
        if (!active) {
          return;
        }
        const newRep = {
          rows: returnedRows,
          pageInfo: {
            totalRowCount,
            nextCursor,
            pageSize: returnedRows.length,
          },
        };
        setResponse((prev) => (isDeepEqual(prev, newRep) ? prev : newRep));
        setIsLoading(false);
      })();

      return () => {
        active = false;
      };
    }, [dataGenerationIsLoading, queryOptions, rows]);

    // We use queryOptions pointer to be sure that isLoading===true as soon as the options change
    const effectShouldStart = queryOptionsRef.current !== queryOptions;

    return {
      isLoading: isLoading || effectShouldStart,
      ...response,
    };
  };

  return { columns, columnsWithDefaultColDef, initialState, useQuery };
};
