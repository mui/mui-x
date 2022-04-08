import * as React from 'react';
import {
  getGridDefaultColumnTypes,
  GridRowModel,
  GridFilterModel,
  GridSortModel,
  GridRowId,
  GridLinkOperator,
  GridFilterOperator,
  GridColDef,
} from '@mui/x-data-grid-pro';
import { isDeepEqual } from '@mui/x-data-grid/internals';
import {
  useDemoData,
  UseDemoDataOptions,
  getColumnsFromOptions,
  getInitialState,
} from './useDemoData';

const simplifiedValueGetter = (field: string, colDef: GridColDef) => (row: GridRowModel) => {
  const params = { id: row.id, row, field, rowNode: {} };
  // @ts-ignore
  return colDef.valueGetter?.(params) || row[field];
};

const getRowComparator = (
  sortModel: GridSortModel | undefined,
  columnsWithDefaultColDef: GridColDef[],
) => {
  if (!sortModel) {
    const comparator = () => 0;
    return comparator;
  }
  const sortOperators = sortModel.map((sortItem) => {
    const columnField = sortItem.field;
    const colDef = columnsWithDefaultColDef.find(({ field }) => field === columnField) as any;
    return {
      ...sortItem,
      valueGetter: simplifiedValueGetter(columnField, colDef),
      sortComparator: colDef.sortComparator,
    };
  });

  const comparator = (row1: GridRowModel, row2: GridRowModel) =>
    sortOperators.reduce((acc, { valueGetter, sort, sortComparator }) => {
      if (acc !== 0) {
        return acc;
      }
      const v1 = valueGetter(row1);
      const v2 = valueGetter(row2);
      return sort === 'desc' ? -1 * sortComparator(v1, v2) : sortComparator(v1, v2);
    }, 0);

  return comparator;
};

const getFilteredRows = (
  rows: GridRowModel[],
  filterModel: GridFilterModel | undefined,
  columnsWithDefaultColDef: GridColDef[],
) => {
  if (filterModel === undefined || filterModel.items.length === 0) {
    return rows;
  }

  const valueGetters = filterModel.items.map(({ columnField }) =>
    simplifiedValueGetter(
      columnField,
      columnsWithDefaultColDef.find(({ field }) => field === columnField) as any,
    ),
  );
  const filterFunctions = filterModel.items.map((filterItem) => {
    const { columnField, operatorValue } = filterItem;
    const colDef = columnsWithDefaultColDef.find(({ field }) => field === columnField) as any;

    const filterOperator: any = colDef.filterOperators.find(
      ({ value }: GridFilterOperator) => operatorValue === value,
    );

    let parsedValue = filterItem.value;
    if (colDef.valueParser) {
      const parser = colDef.valueParser;
      parsedValue = Array.isArray(filterItem.value)
        ? filterItem.value?.map((x) => parser(x))
        : parser(filterItem.value);
    }

    return filterOperator?.getApplyFilterFn({ filterItem, value: parsedValue }, colDef);
  });

  if (filterModel.linkOperator === GridLinkOperator.Or) {
    return rows.filter((row: GridRowModel) =>
      filterModel.items.some((_, index) => {
        const value = valueGetters[index](row);
        return filterFunctions[index] === null ? true : filterFunctions[index]({ value });
      }),
    );
  }
  return rows.filter((row: GridRowModel) =>
    filterModel.items.every((_, index) => {
      const value = valueGetters[index](row);
      return filterFunctions[index] === null ? true : filterFunctions[index]({ value });
    }),
  );
};

/**
 * Simulates server data loading
 */
const loadServerRows = (
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

interface PageInfo {
  totalRowCount?: number;
  nextCursor?: string;
  pageSize?: number;
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

const DEFAULT_DATASET_OPTIONS: UseDemoDataOptions = {
  dataSet: 'Commodity',
  rowLength: 100,
  maxColumns: 6,
};

const DEFAULT_SERVER_OPTIONS: ServerOptions = {
  minDelay: 100,
  maxDelay: 300,
  useCursorPagination: true,
};

export const createFakeServer = (
  dataSetOptions?: Partial<UseDemoDataOptions>,
  serverOptions?: Partial<ServerOptions>,
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
      data: GridRowModel[];
    }>({ pageInfo: {}, data: [] });
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
          data: returnedRows,
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

  return { columns, initialState, useQuery };
};
