import {
  GridRowModel,
  GridFilterModel,
  GridSortModel,
  GridLogicOperator,
  GridFilterOperator,
  GridColDef,
  GridRowId,
  GridPaginationModel,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import { GridStateColDef } from '@mui/x-data-grid-pro/internals';
import { UseDemoDataOptions } from './useDemoData';
import { randomInt } from '../services/random-generator';

export interface FakeServerResponse {
  returnedRows: GridRowModel[];
  nextCursor?: string;
  hasNextPage?: boolean;
  totalRowCount: number;
}

export interface PageInfo {
  totalRowCount?: number;
  nextCursor?: string;
  hasNextPage?: boolean;
  pageSize?: number;
}

export interface DefaultServerOptions {
  minDelay: number;
  maxDelay: number;
  useCursorPagination?: boolean;
}

export type ServerOptions = Partial<DefaultServerOptions>;

export interface QueryOptions {
  cursor?: GridRowId;
  page?: number;
  pageSize?: number;
  filterModel?: GridFilterModel;
  sortModel?: GridSortModel;
  firstRowToRender?: number;
  lastRowToRender?: number;
}

export interface ServerSideQueryOptions {
  cursor?: GridRowId;
  paginationModel?: GridPaginationModel;
  groupKeys?: string[];
  filterModel?: GridFilterModel;
  sortModel?: GridSortModel;
  firstRowToRender?: number;
  lastRowToRender?: number;
}

export const DEFAULT_DATASET_OPTIONS: UseDemoDataOptions = {
  dataSet: 'Commodity',
  rowLength: 100,
  maxColumns: 6,
};

declare const DISABLE_CHANCE_RANDOM: any;
export const disableDelay = typeof DISABLE_CHANCE_RANDOM !== 'undefined' && DISABLE_CHANCE_RANDOM;

export const DEFAULT_SERVER_OPTIONS: DefaultServerOptions = {
  minDelay: disableDelay ? 0 : 100,
  maxDelay: disableDelay ? 0 : 300,
  useCursorPagination: true,
};

const apiRef = {} as any;

const simplifiedValueGetter = (field: string, colDef: GridColDef) => (row: GridRowModel) => {
  return colDef.valueGetter?.(row[row.id] as never, row, colDef, apiRef) || row[field];
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

const buildQuickFilterApplier = (filterModel: GridFilterModel, columns: GridColDef[]) => {
  const quickFilterValues = filterModel.quickFilterValues?.filter(Boolean) ?? [];
  if (quickFilterValues.length === 0) {
    return null;
  }

  const appliersPerField = [] as {
    column: GridColDef;
    appliers: {
      fn: null | ((...args: any[]) => boolean);
    }[];
  }[];

  const stubApiRef = {
    current: {
      getRowFormattedValue: (row: GridValidRowModel, c: GridColDef) => {
        const field = c.field;
        return row[field];
      },
    },
  };

  columns.forEach((column) => {
    const getApplyQuickFilterFn = column?.getApplyQuickFilterFn;

    if (getApplyQuickFilterFn) {
      appliersPerField.push({
        column,
        appliers: quickFilterValues.map((quickFilterValue) => {
          return {
            fn: getApplyQuickFilterFn(
              quickFilterValue,
              column as GridStateColDef,
              stubApiRef as any,
            ),
          };
        }),
      });
    }
  });

  return function isRowMatchingQuickFilter(
    row: GridValidRowModel,
    shouldApplyFilter?: (field: string) => boolean,
  ) {
    const result = {} as Record<string, boolean>;

    /* eslint-disable no-labels */
    outer: for (let v = 0; v < quickFilterValues.length; v += 1) {
      const filterValue = quickFilterValues[v];

      for (let i = 0; i < appliersPerField.length; i += 1) {
        const { column, appliers } = appliersPerField[i];
        const { field } = column;

        if (shouldApplyFilter && !shouldApplyFilter(field)) {
          continue;
        }

        const applier = appliers[v];
        const value = row[field];

        if (applier.fn === null) {
          continue;
        }
        const isMatching = applier.fn(value, row, column, stubApiRef);

        if (isMatching) {
          result[filterValue] = true;
          continue outer;
        }
      }

      result[filterValue] = false;
    }
    /* eslint-enable no-labels */

    return result;
  };
};

const getQuicklyFilteredRows = (
  rows: GridRowModel[],
  filterModel: GridFilterModel | undefined,
  columnsWithDefaultColDef: GridColDef[],
) => {
  if (filterModel === undefined || filterModel.quickFilterValues?.length === 0) {
    return rows;
  }

  const isRowMatchingQuickFilter = buildQuickFilterApplier(filterModel, columnsWithDefaultColDef);

  if (isRowMatchingQuickFilter) {
    return rows.filter((row) => {
      const result = isRowMatchingQuickFilter(row);
      return filterModel.quickFilterLogicOperator === GridLogicOperator.And
        ? Object.values(result).every(Boolean)
        : Object.values(result).some(Boolean);
    });
  }
  return rows;
};

const getFilteredRows = (
  rows: GridRowModel[],
  filterModel: GridFilterModel | undefined,
  columnsWithDefaultColDef: GridColDef[],
) => {
  if (filterModel === undefined || filterModel.items.length === 0) {
    return rows;
  }

  const valueGetters = filterModel.items.map(({ field }) =>
    simplifiedValueGetter(
      field,
      columnsWithDefaultColDef.find((column) => column.field === field) as any,
    ),
  );

  const filterFunctions = filterModel.items.map((filterItem) => {
    const { field, operator } = filterItem;
    const colDef: GridColDef = columnsWithDefaultColDef.find(
      (column) => column.field === field,
    ) as any;

    if (!colDef.filterOperators) {
      throw new Error(`MUI: No filter operator found for column '${field}'.`);
    }
    const filterOperator: any = colDef.filterOperators.find(
      ({ value }: GridFilterOperator) => operator === value,
    );

    let parsedValue = filterItem.value;

    if (colDef.valueParser) {
      const parser = colDef.valueParser;
      parsedValue = Array.isArray(filterItem.value)
        ? filterItem.value?.map((x) => parser(x, {}, colDef, apiRef))
        : parser(filterItem.value, {}, colDef, apiRef);
    }

    return filterOperator.getApplyFilterFn({ filterItem, value: parsedValue }, colDef);
  });

  if (filterModel.logicOperator === GridLogicOperator.Or) {
    return rows.filter((row: GridRowModel) =>
      filterModel.items.some((_, index) => {
        const value = valueGetters[index](row);
        return filterFunctions[index] === null ? true : filterFunctions[index](value);
      }),
    );
  }
  return rows.filter((row: GridRowModel) =>
    filterModel.items.every((_, index) => {
      const value = valueGetters[index](row);
      return filterFunctions[index] === null ? true : filterFunctions[index](value);
    }),
  );
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
  const delay = randomInt(minDelay, maxDelay);

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
  const hasNextPage = lastRowIndex < filteredRows.length - 1;
  const response: FakeServerResponse = {
    returnedRows: filteredRows.slice(firstRowIndex, lastRowIndex),
    hasNextPage,
    nextCursor,
    totalRowCount,
  };

  return new Promise<FakeServerResponse>((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, delay); // simulate network latency
  });
};

interface ProcessTreeDataRowsResponse {
  rows: GridRowModel[];
  rootRowCount: number;
}

const findTreeDataRowChildren = (
  allRows: GridRowModel[],
  parentPath: string[],
  pathKey: string = 'path',
  depth: number = 1, // the depth of the children to find relative to parentDepth, `-1` to find all
) => {
  const parentDepth = parentPath.length;
  const children = [];
  for (let i = 0; i < allRows.length; i += 1) {
    const row = allRows[i];
    const rowPath = row[pathKey];
    if (!rowPath) {
      continue;
    }
    if (
      ((depth < 0 && rowPath.length > parentDepth) || rowPath.length === parentDepth + depth) &&
      parentPath.every((value, index) => value === rowPath[index])
    ) {
      children.push(row);
    }
  }
  return children;
};

type GetTreeDataFilteredRows = (
  rows: GridValidRowModel[],
  filterModel: GridFilterModel | undefined,
  columnsWithDefaultColDef: GridColDef[],
) => GridValidRowModel;

const getTreeDataFilteredRows: GetTreeDataFilteredRows = (
  rows,
  filterModel,
  columnsWithDefaultColDef,
): GridValidRowModel[] => {
  let filteredRows = [...rows];
  if (filterModel && filterModel.quickFilterValues?.length! > 0) {
    filteredRows = getQuicklyFilteredRows(rows, filterModel, columnsWithDefaultColDef);
  }
  if ((filterModel?.items.length ?? 0) > 0) {
    filteredRows = getFilteredRows(filteredRows, filterModel, columnsWithDefaultColDef);
  }

  if (filteredRows.length === rows.length || filteredRows.length === 0) {
    return filteredRows;
  }

  const pathsToIndexesMap = new Map<string, number>();
  rows.forEach((row: GridValidRowModel, index: number) => {
    pathsToIndexesMap.set(row.path.join(','), index);
  });

  const includedPaths = new Set<string>();
  filteredRows.forEach((row) => {
    includedPaths.add(row.path.join(','));
  });

  const missingChildren: GridValidRowModel[] = [];

  // include missing children of filtered rows
  filteredRows.forEach((row) => {
    const path = row.path;
    if (path) {
      const children = findTreeDataRowChildren(rows, path, 'path', -1);
      children.forEach((child) => {
        const subPath = child.path.join(',');
        if (!includedPaths.has(subPath)) {
          missingChildren.push(child);
        }
      });
    }
  });

  filteredRows = missingChildren.concat(filteredRows);

  const missingParents: GridValidRowModel[] = [];

  // include missing parents of filtered rows
  filteredRows.forEach((row) => {
    const path = row.path;
    if (path) {
      includedPaths.add(path.join(','));
      for (let i = 0; i < path.length - 1; i += 1) {
        const subPath = path.slice(0, i + 1).join(',');
        if (!includedPaths.has(subPath)) {
          const index = pathsToIndexesMap.get(subPath);
          if (index !== undefined) {
            missingParents.push(rows[index]);
            includedPaths.add(subPath);
          }
        }
      }
    }
  });

  return missingParents.concat(filteredRows);
};

/**
 * Simulates server data loading
 */
export const processTreeDataRows = (
  rows: GridRowModel[],
  queryOptions: ServerSideQueryOptions,
  serverOptions: ServerOptions,
  columnsWithDefaultColDef: GridColDef[],
): Promise<ProcessTreeDataRowsResponse> => {
  const { minDelay = 100, maxDelay = 300 } = serverOptions;
  const pathKey = 'path';
  // TODO: Support filtering and cursor based pagination
  if (maxDelay < minDelay) {
    throw new Error('serverOptions.minDelay is larger than serverOptions.maxDelay ');
  }

  if (queryOptions.groupKeys == null) {
    throw new Error('serverOptions.groupKeys must be defined to compute tree data ');
  }

  const delay = randomInt(minDelay, maxDelay);

  // apply plain filtering
  const filteredRows = getTreeDataFilteredRows(
    rows,
    queryOptions.filterModel,
    columnsWithDefaultColDef,
  ) as GridValidRowModel[];

  // get root row count
  const rootRowCount = findTreeDataRowChildren(filteredRows, []).length;

  // find direct children referring to the `parentPath`
  const childRows = findTreeDataRowChildren(filteredRows, queryOptions.groupKeys);

  let childRowsWithDescendantCounts = childRows.map((row) => {
    const descendants = findTreeDataRowChildren(filteredRows, row[pathKey], pathKey, -1);
    const descendantCount = descendants.length;
    return { ...row, descendantCount } as GridRowModel;
  });

  if (queryOptions.sortModel) {
    // apply sorting
    const rowComparator = getRowComparator(queryOptions.sortModel, columnsWithDefaultColDef);
    childRowsWithDescendantCounts = [...childRowsWithDescendantCounts].sort(rowComparator);
  }

  if (queryOptions.paginationModel && queryOptions.groupKeys.length === 0) {
    // Only paginate root rows, grid should refetch root rows when `paginationModel` updates
    const { pageSize, page } = queryOptions.paginationModel;
    if (pageSize < childRowsWithDescendantCounts.length) {
      childRowsWithDescendantCounts = childRowsWithDescendantCounts.slice(
        page * pageSize,
        (page + 1) * pageSize,
      );
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ rows: childRowsWithDescendantCounts, rootRowCount });
    }, delay); // simulate network latency
  });
};
