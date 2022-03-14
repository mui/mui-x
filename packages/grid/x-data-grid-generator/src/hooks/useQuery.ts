import * as React from 'react';
import { GridRowModel, GridFilterModel, GridSortModel, GridRowId } from '@mui/x-data-grid-pro';
import {
  useDemoData,
  UseDemoDataOptions,
  getColumnsFromOptions,
  getInitialState,
} from './useDemoData';

/**
 * Simulates server data loading
 */
const loadServerRows = (
  rows: GridRowModel[],
  queryOptions: QueryOptions,
  serverOptions: ServerOptions,
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
  const rowNumber = rows.length; // will be modified when filter will be implemented
  if (!pageSize) {
    firstRowIndex = 0;
    lastRowIndex = rows.length;
  } else if (useCursorPagination) {
    firstRowIndex = cursor ? rows.findIndex(({ id }) => id === cursor) : 0;
    firstRowIndex = Math.max(firstRowIndex, 0); // if cursor not found return 0
    lastRowIndex = firstRowIndex + pageSize;

    nextCursor = lastRowIndex >= rows.length ? undefined : rows[lastRowIndex].id;
  } else {
    firstRowIndex = page * pageSize;
    lastRowIndex = (page + 1) * pageSize;
  }
  const response: FakeServerResponse = {
    returnedRows: rows.slice(firstRowIndex, lastRowIndex),
    nextCursor,
    rowNumber,
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
  rowNumber: number;
}
export interface ServerOptions {
  minDelay: number;
  maxDelay: number;
  useCursorPagination?: boolean;
}

export interface QueryOptions {
  cursor?: GridRowId;
  page?: number;
  pageSize?: number;
  // TODO: implement the behavior liked to following models
  filterModel?: GridFilterModel;
  sortModel?: GridSortModel;
}

export const serverConfiguration = (
  dataSetOptions: UseDemoDataOptions,
  serverOptions: ServerOptions,
) => {
  const columns = getColumnsFromOptions(dataSetOptions);
  const initialState = getInitialState(dataSetOptions, columns);

  const useQuery = (queryOptions: QueryOptions) => {
    const {
      data: { rows },
      loading: dataGenerationIsLoading,
    } = useDemoData(dataSetOptions);

    const queryOptionsRef = React.useRef(queryOptions);
    const [rowCount, setRowCount] = React.useState<number | undefined>(undefined);
    const [nextCursor, setNextCursor] = React.useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [data, setData] = React.useState<GridRowModel[]>([]);

    React.useEffect(() => {
      if (dataGenerationIsLoading) {
        // dataset is not ready
        return () => {};
      }

      queryOptionsRef.current = queryOptions;
      let active = true;

      setIsLoading(true);
      setRowCount(undefined);
      setNextCursor(undefined);
      loadServerRows(rows, queryOptions, serverOptions).then(
        ({ returnedRows, nextCursor: responseNextCursor, rowNumber }) => {
          if (!active) {
            return;
          }
          setData(returnedRows);
          setIsLoading(false);
          setRowCount(rowNumber);
          setNextCursor(responseNextCursor);
        },
      );

      return () => {
        active = false;
      };
    }, [dataGenerationIsLoading, queryOptions, rows]);

    // We use queryOptions pointer to be sure that isLoading===true as soon as the options change
    const effectShouldStart = queryOptionsRef.current !== queryOptions;

    return {
      isLoading: dataGenerationIsLoading || isLoading || effectShouldStart,
      data,
      rowCount,
      nextCursor,
    };
  };

  return { columns, initialState, useQuery };
};
