import {
  type GridRowModel,
  type GridFilterModel,
  type GridSortModel,
  GridLogicOperator,
  type GridFilterOperator,
  type GridColDef,
  type GridRowId,
  type GridPaginationModel,
  type GridValidRowModel,
  GRID_AGGREGATION_FUNCTIONS,
  type GridAggregationModel,
  type GridAggregationFunction,
  type GridPivotModel,
  gridStringOrNumberComparator,
  type GridGetRowsResponse,
} from '@mui/x-data-grid-premium';
import type { GridStateColDef } from '@mui/x-data-grid-pro/internals';
import { randomInt } from '../services/random-generator';

const getAvailableAggregationFunctions = (columnType: GridColDef['type']) => {
  const availableAggregationFunctions = new Map<string, GridAggregationFunction>();
  Object.keys(GRID_AGGREGATION_FUNCTIONS).forEach((functionName) => {
    const columnTypes =
      GRID_AGGREGATION_FUNCTIONS[functionName as keyof typeof GRID_AGGREGATION_FUNCTIONS]
        .columnTypes;
    if (!columnTypes || columnTypes.includes(columnType ?? 'string')) {
      availableAggregationFunctions.set(
        functionName,
        GRID_AGGREGATION_FUNCTIONS[functionName as keyof typeof GRID_AGGREGATION_FUNCTIONS],
      );
    }
  });
  return availableAggregationFunctions;
};

export interface FakeServerResponse {
  returnedRows: GridRowModel[];
  aggregateRow?: GridValidRowModel;
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
  /**
   * The minimum response delay in milliseconds.
   * For a large dataset, the response delay can be larger than the minimum delay.
   */
  minDelay: number;
  /**
   * The maximum response delay in milliseconds
   * For a large dataset, the response delay can be larger than the maximum delay.
   */
  maxDelay: number;
  useCursorPagination?: boolean;
}

export type ServerOptions = Partial<DefaultServerOptions>;

export interface QueryOptions {
  cursor?: GridRowId;
  page?: number;
  pageSize?: number;
  filterModel?: GridFilterModel;
  aggregationModel?: GridAggregationModel;
  sortModel?: GridSortModel;
  start?: number;
  end?: number;
}

export interface ServerSideQueryOptions {
  cursor?: GridRowId;
  paginationModel?: GridPaginationModel;
  groupKeys?: string[];
  filterModel?: GridFilterModel;
  sortModel?: GridSortModel;
  aggregationModel?: GridAggregationModel;
  start?: number;
  end?: number;
  groupFields?: string[];
  pivotModel?: GridPivotModel;
}

interface NestedDataRowsResponse {
  rows: GridRowModel[];
  rootRowCount: number;
  aggregateRow?: GridRowModel;
}

interface PivotingDataRowsResponse extends NestedDataRowsResponse {
  pivotColumns: GridGetRowsResponse['pivotColumns'];
}

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
  aggregationModel: GridAggregationModel | undefined,
  columnsWithDefaultColDef: GridColDef[],
) => {
  if (!sortModel) {
    const comparator = () => 0;
    return comparator;
  }
  const sortOperators = sortModel.map((sortItem) => {
    const columnField = sortItem.field;
    const colDef = columnsWithDefaultColDef.find(({ field }) => field === sortItem.field) as any;
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

const applyAggregation = (
  aggregationModel: GridAggregationModel,
  colDefs: GridColDef[],
  rows: GridRowModel[],
  groupId: string = 'root',
) => {
  const columnsToAggregate = Object.keys(aggregationModel);
  if (columnsToAggregate.length === 0) {
    return {};
  }

  const aggregateValues: GridValidRowModel = {};
  columnsToAggregate.forEach((field) => {
    const type = colDefs.find(({ field: f }) => f === field)?.type;
    if (!type) {
      return;
    }
    const availableAggregationFunctions = getAvailableAggregationFunctions(type);
    if (!availableAggregationFunctions.has(aggregationModel[field])) {
      return;
    }
    const aggregationFunction = availableAggregationFunctions.get(aggregationModel[field]);
    if (!aggregationFunction) {
      return;
    }
    const values = rows.map((row) => row[field]);
    aggregateValues[field] = aggregationFunction.apply({
      values,
      field,
      groupId,
    });
  });
  return aggregateValues;
};

const generateParentRows = (pathsToAutogenerate: Set<string>): GridValidRowModel[] => {
  return Array.from(pathsToAutogenerate).map((path) => {
    const pathArray = path.split(',');
    return {
      id: `auto-generated-parent-${pathArray.join('-')}`,
      path: pathArray.slice(0, pathArray.length),
      group: pathArray.slice(-1)[0],
    };
  });
};

/**
 * Computes pivot aggregations for given pivot column keys
 */
const computePivotAggregations = (
  pivotColumnKeys: string[],
  rows: GridValidRowModel[],
  visibleValues: any[],
  columnTypeMap: Map<string, GridColDef['type']>,
  groupId: string = 'root',
  columnGroupIdSeparator: string = '>->',
): Record<string, any> => {
  const pivotAggregations: Record<string, any> = {};

  pivotColumnKeys.forEach((pivotColumnKey) => {
    const values = rows.map((row) => row[pivotColumnKey]).filter((v) => v !== undefined);

    if (values.length > 0) {
      // Find the corresponding pivot value configuration
      const pivotValueConfig = visibleValues.find((v) => {
        if (visibleValues.length === 0 || !visibleValues[0].field) {
          return v.field === pivotColumnKey;
        }
        // For pivot columns with column grouping, extract the value field from the column name
        const columnParts = pivotColumnKey.split(columnGroupIdSeparator);
        return columnParts[columnParts.length - 1] === v.field;
      });

      if (pivotValueConfig) {
        const availableAggregationFunctions = getAvailableAggregationFunctions(
          columnTypeMap.get(pivotValueConfig.field),
        );
        const aggregationFunction = availableAggregationFunctions.get(pivotValueConfig.aggFunc);
        if (aggregationFunction) {
          pivotAggregations[pivotColumnKey] = aggregationFunction.apply({
            values,
            field: pivotValueConfig.field,
            groupId,
          });
        }
      }
    }
  });

  return pivotAggregations;
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

  const { cursor, page = 0, pageSize, start, end } = queryOptions;

  let nextCursor;
  let firstRowIndex;
  let lastRowIndex;

  let filteredRows = getFilteredRows(rows, queryOptions.filterModel, columnsWithDefaultColDef);

  const rowComparator = getRowComparator(
    queryOptions.sortModel,
    queryOptions.aggregationModel,
    columnsWithDefaultColDef,
  );
  filteredRows = [...filteredRows].sort(rowComparator);

  let aggregateRow = {};
  if (queryOptions.aggregationModel) {
    aggregateRow = applyAggregation(
      queryOptions.aggregationModel,
      columnsWithDefaultColDef,
      filteredRows,
    );
  }

  const totalRowCount = filteredRows.length;
  if (start !== undefined && end !== undefined) {
    firstRowIndex = start;
    lastRowIndex = end;
  } else if (!pageSize) {
    firstRowIndex = 0;
    lastRowIndex = filteredRows.length - 1;
  } else if (useCursorPagination) {
    firstRowIndex = cursor ? filteredRows.findIndex(({ id }) => id === cursor) : 0;
    firstRowIndex = Math.max(firstRowIndex, 0); // if cursor not found return 0
    lastRowIndex = firstRowIndex + pageSize - 1;

    nextCursor = filteredRows[lastRowIndex + 1]?.id;
  } else {
    firstRowIndex = page * pageSize;
    lastRowIndex = (page + 1) * pageSize - 1;
  }
  const hasNextPage = lastRowIndex < filteredRows.length - 1;
  const response: FakeServerResponse = {
    returnedRows: filteredRows.slice(firstRowIndex, lastRowIndex + 1),
    hasNextPage,
    nextCursor,
    totalRowCount,
    ...(queryOptions.aggregationModel ? { aggregateRow } : {}),
  };

  return new Promise<FakeServerResponse>((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, delay); // simulate network latency
  });
};

const findTreeDataRowChildren = (
  allRows: GridRowModel[],
  parentPath: string[],
  pathKey: string = 'path',
  depth: number = 1, // the depth of the children to find relative to parentDepth, `-1` to find all
  rowQualifier?: (row: GridRowModel) => boolean,
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
      if (!rowQualifier || rowQualifier(row)) {
        children.push(row);
      }
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
  if (filterModel?.quickFilterValues && filterModel.quickFilterValues.length > 0) {
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
 * Simulates server data for tree-data feature
 */
export const processTreeDataRows = (
  rows: GridRowModel[],
  queryOptions: ServerSideQueryOptions,
  serverOptions: ServerOptions,
  columnsWithDefaultColDef: GridColDef[],
  nestedPagination: boolean,
): Promise<NestedDataRowsResponse> => {
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
  const rootRowCount = findTreeDataRowChildren(
    filteredRows,
    nestedPagination ? queryOptions.groupKeys : [],
  ).length;

  // find direct children referring to the `parentPath`
  const childRows = findTreeDataRowChildren(filteredRows, queryOptions.groupKeys);

  let childRowsWithDescendantCounts = childRows.map((row) => {
    const descendants = findTreeDataRowChildren(filteredRows, row[pathKey], pathKey, -1);
    const descendantCount = descendants.length;
    const children = findTreeDataRowChildren(filteredRows, row[pathKey], pathKey, 1);
    const childrenCount = children.length;
    if (descendantCount > 0 && queryOptions.aggregationModel) {
      // Parent row, compute aggregation
      return {
        ...row,
        descendantCount,
        childrenCount,
        ...applyAggregation(
          queryOptions.aggregationModel,
          columnsWithDefaultColDef,
          descendants,
          row.id,
        ),
      };
    }
    return { ...row, descendantCount, childrenCount } as GridRowModel;
  });

  if (queryOptions.sortModel) {
    // apply sorting
    const rowComparator = getRowComparator(
      queryOptions.sortModel,
      queryOptions.aggregationModel,
      columnsWithDefaultColDef,
    );
    childRowsWithDescendantCounts = [...childRowsWithDescendantCounts].sort(rowComparator);
  }

  let aggregateRow: GridRowModel | undefined;
  if (queryOptions.aggregationModel) {
    aggregateRow = applyAggregation(
      queryOptions.aggregationModel,
      columnsWithDefaultColDef,
      filteredRows,
    );
  }

  // Apply pagination using start/end if provided, otherwise fall back to paginationModel
  if (queryOptions.groupKeys.length === 0 || nestedPagination) {
    if (queryOptions.start !== undefined && queryOptions.end !== undefined) {
      // Use start/end for range-based pagination (needed for nested lazy loading)
      childRowsWithDescendantCounts = childRowsWithDescendantCounts.slice(
        queryOptions.start,
        queryOptions.end + 1,
      );
    } else if (queryOptions.paginationModel) {
      // Fall back to paginationModel for backward compatibility
      const { pageSize, page } = queryOptions.paginationModel;
      if (pageSize < childRowsWithDescendantCounts.length) {
        childRowsWithDescendantCounts = childRowsWithDescendantCounts.slice(
          page * pageSize,
          page * pageSize + pageSize,
        );
      }
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ rows: childRowsWithDescendantCounts, rootRowCount, aggregateRow });
    }, delay); // simulate network latency
  });
};

/**
 * Simulates server data for row grouping feature
 */
export const processRowGroupingRows = (
  rows: GridValidRowModel[],
  queryOptions: ServerSideQueryOptions,
  serverOptions: ServerOptions,
  columnsWithDefaultColDef: GridColDef[],
  nestedPagination: boolean,
): Promise<NestedDataRowsResponse> => {
  const { minDelay = 100, maxDelay = 300 } = serverOptions;
  const pathKey = 'path';

  if (maxDelay < minDelay) {
    throw new Error('serverOptions.minDelay is larger than serverOptions.maxDelay ');
  }

  if (queryOptions.groupKeys == null) {
    throw new Error('serverOptions.groupKeys must be defined to compute row grouping data');
  }

  if (queryOptions.groupFields == null) {
    throw new Error('serverOptions.groupFields must be defined to compute row grouping data');
  }

  const delay = randomInt(minDelay, maxDelay);

  const pathsToAutogenerate = new Set<string>();
  let rowsWithPaths = rows;
  const rowsWithMissingGroups: GridValidRowModel[] = [];

  // add paths and generate parent rows based on `groupFields`
  const groupFields = queryOptions.groupFields;

  if (groupFields.length > 0) {
    rowsWithPaths = rows.reduce<GridValidRowModel[]>((acc, row) => {
      const partialPath = groupFields.map((field) => {
        const colDef = columnsWithDefaultColDef.find(({ field: f }) => f === field);
        if (colDef?.groupingValueGetter) {
          return String(colDef.groupingValueGetter(row[field] as never, row, colDef, apiRef));
        }
        if (colDef?.valueGetter) {
          return String(colDef.valueGetter(row[field] as never, row, colDef, apiRef));
        }
        return String(row[field]);
      });
      for (let index = 0; index < partialPath.length; index += 1) {
        const value = partialPath[index];
        if (value === undefined) {
          if (index === 0) {
            rowsWithMissingGroups.push({ ...row, group: false });
          }
          return acc;
        }
        const parentPath = partialPath.slice(0, index + 1);
        const strigifiedPath = parentPath.join(',');
        if (!pathsToAutogenerate.has(strigifiedPath)) {
          pathsToAutogenerate.add(strigifiedPath);
        }
      }
      acc.push({ ...row, path: [...partialPath, ''] });
      return acc;
    }, []);
  } else {
    rowsWithPaths = rows.map((row) => ({ ...row, path: [''] }));
  }

  const autogeneratedRows = generateParentRows(pathsToAutogenerate);

  // apply plain filtering
  const filteredRows = getTreeDataFilteredRows(
    [...autogeneratedRows, ...rowsWithPaths, ...rowsWithMissingGroups],
    queryOptions.filterModel,
    columnsWithDefaultColDef,
  ) as GridValidRowModel[];

  // get root row count
  const rootRows = findTreeDataRowChildren(filteredRows, []);
  const rootRowCount = rootRows.length;

  let filteredRowsWithMissingGroups: GridValidRowModel[] = [];
  let childRows = rootRows;
  if (queryOptions.groupKeys.length === 0) {
    filteredRowsWithMissingGroups = filteredRows.filter(({ group }) => group === false);
  } else {
    childRows = findTreeDataRowChildren(filteredRows, queryOptions.groupKeys);
  }

  let childRowsWithDescendantCounts = childRows.map((row) => {
    const descendants = findTreeDataRowChildren(
      filteredRows,
      row[pathKey],
      pathKey,
      -1,
      ({ id }) => typeof id !== 'string' || !id.startsWith('auto-generated-parent-'),
    );
    const descendantCount = descendants.length;
    const children = findTreeDataRowChildren(filteredRows, row[pathKey], pathKey, 1);
    const childrenCount = children.length;
    if (descendantCount > 0 && queryOptions.aggregationModel) {
      // Parent row, compute aggregation
      return {
        ...row,
        descendantCount,
        childrenCount,
        ...applyAggregation(
          queryOptions.aggregationModel,
          columnsWithDefaultColDef,
          descendants,
          row.id,
        ),
      };
    }
    return { ...row, descendantCount, childrenCount } as GridRowModel;
  });

  if (queryOptions.sortModel) {
    const rowComparator = getRowComparator(
      queryOptions.sortModel,
      queryOptions.aggregationModel,
      columnsWithDefaultColDef,
    );
    const sortedMissingGroups = [...filteredRowsWithMissingGroups].sort(rowComparator);
    const sortedChildRows = [...childRowsWithDescendantCounts].sort(rowComparator);
    childRowsWithDescendantCounts = [...sortedMissingGroups, ...sortedChildRows];
  }

  let aggregateRow: GridRowModel | undefined;
  if (queryOptions.aggregationModel) {
    aggregateRow = applyAggregation(
      queryOptions.aggregationModel,
      columnsWithDefaultColDef,
      filteredRows,
    );
  }

  // Apply pagination using start/end if provided, otherwise fall back to paginationModel
  if (queryOptions.groupKeys.length === 0 || nestedPagination) {
    if (queryOptions.start !== undefined && queryOptions.end !== undefined) {
      // Use start/end for range-based pagination (needed for nested lazy loading)
      childRowsWithDescendantCounts = childRowsWithDescendantCounts.slice(
        queryOptions.start,
        queryOptions.end + 1,
      );
    } else if (queryOptions.paginationModel) {
      // Fall back to paginationModel for backward compatibility
      const { pageSize, page } = queryOptions.paginationModel;
      if (pageSize < childRowsWithDescendantCounts.length) {
        childRowsWithDescendantCounts = childRowsWithDescendantCounts.slice(
          page * pageSize,
          (page + 1) * pageSize,
        );
      }
    }
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ rows: childRowsWithDescendantCounts, rootRowCount, aggregateRow });
    }, delay); // simulate network latency
  });
};

/**
 * Simulates server data for pivoting feature
 */
export const processPivotingRows = (
  rows: GridValidRowModel[],
  queryOptions: ServerSideQueryOptions,
  serverOptions: ServerOptions,
  columnsWithDefaultColDef: GridColDef[],
): Promise<PivotingDataRowsResponse> => {
  const { minDelay = 100, maxDelay = 300 } = serverOptions;

  if (maxDelay < minDelay) {
    throw new Error('serverOptions.minDelay is larger than serverOptions.maxDelay ');
  }

  if (!queryOptions.pivotModel) {
    throw new Error('queryOptions.pivotModel must be defined to compute pivoting data');
  }

  const delay = randomInt(minDelay, maxDelay);
  const { pivotModel } = queryOptions;

  const visibleColumns = pivotModel.columns.filter((column) => !column.hidden);
  const visibleRows = pivotModel.rows.filter((row) => !row.hidden);
  const visibleValues = pivotModel.values.filter((value) => !value.hidden);

  // Create column lookup map for O(1) access
  const columnLookup = new Map<string, GridColDef>();
  for (const column of columnsWithDefaultColDef) {
    columnLookup.set(column.field, column);
  }

  if (visibleRows.length === 0) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ rows: [], rootRowCount: 0, pivotColumns: [] });
      }, delay); // simulate network latency
    });
  }

  // Apply filtering if provided
  let filteredRows = rows;
  if (queryOptions.filterModel) {
    filteredRows = getFilteredRows(rows, queryOptions.filterModel, columnsWithDefaultColDef);
  }

  // Create pivot columns based on the pivot model
  const columnGroupIdSeparator = '>->';
  const pivotColumns: GridGetRowsResponse['pivotColumns'] = [];
  const uniqueColumnGroups = new Map<string, (string | GridRowModel)[]>();

  // Generate pivot column names based on pivot model columns
  if (visibleColumns.length > 0 || visibleValues.length > 0) {
    // Create column groups based on unique combinations of row values

    filteredRows = filteredRows.map((row) => {
      const columnGroupPath: GridRowModel[] = [];
      const updatedRow = { ...row };

      for (let i = 0; i < visibleColumns.length; i += 1) {
        const { field: colGroupField } = visibleColumns[i];
        const column = columnLookup.get(colGroupField);
        if (!column) {
          continue;
        }
        if (!column.valueGetter && !column.valueFormatter) {
          columnGroupPath.push(row[colGroupField]);
        } else {
          columnGroupPath.push({
            [colGroupField]: column.valueGetter
              ? column.valueGetter(row[colGroupField] as never, row, column, apiRef)
              : row[colGroupField],
          });
        }
      }

      // Create pivot columns for each value field within this column group
      visibleValues.forEach((pivotValue) => {
        let valueKey = pivotValue.field;
        const column = columnLookup.get(valueKey);
        if (!column) {
          return;
        }
        if (visibleColumns.length > 0) {
          const columnGroupPathValue = columnGroupPath.map((path, pathIndex) => {
            const value = path[visibleColumns[pathIndex].field];
            if (value instanceof Date) {
              return value.toLocaleDateString();
            }
            return value;
          });
          valueKey = `${columnGroupPathValue.join(columnGroupIdSeparator)}${columnGroupIdSeparator}${pivotValue.field}`;
        }
        uniqueColumnGroups.set(valueKey, [...columnGroupPath, pivotValue.field]);
        updatedRow[valueKey] = column.valueGetter
          ? column.valueGetter(row[pivotValue.field] as never, row, column, apiRef)
          : row[pivotValue.field];
      });

      return updatedRow;
    });

    // Convert uniqueColumnGroups to the pivot column structure
    const columnGroupMap = new Map<
      string,
      { group: string | GridRowModel; children: Map<string, any> }
    >();
    uniqueColumnGroups.forEach((columnGroupPath) => {
      let currentLevel = columnGroupMap;
      let currentPath = '';

      for (let i = 0; i < columnGroupPath.length - 1; i += 1) {
        const groupValue = columnGroupPath[i];
        let groupKey =
          typeof groupValue === 'string' ? groupValue : groupValue[visibleColumns[i].field];
        if (groupKey instanceof Date) {
          groupKey = groupKey.toLocaleDateString();
        }
        const pathKey = currentPath ? `${currentPath}-${groupKey}` : groupKey;

        if (!currentLevel.has(groupKey)) {
          currentLevel.set(groupKey, {
            group: groupValue,
            children: new Map(),
          });
        }

        const group = currentLevel.get(groupKey)!;
        currentLevel = group.children;
        currentPath = pathKey;
      }
    });

    const convertMapToArray = (
      map: Map<string, { group: string | GridRowModel; children: Map<string, any> }>,
    ): NonNullable<GridGetRowsResponse['pivotColumns']> => {
      return Array.from(map.entries()).map(([key, group]) => ({
        key,
        group: group.group,
        ...(group.children.size > 0 ? { children: convertMapToArray(group.children) } : {}),
      }));
    };

    pivotColumns.push(...convertMapToArray(columnGroupMap));
  }

  const pivotColumnKeys = Array.from(uniqueColumnGroups.keys());

  // Add paths and generate parent rows based on `visibleRows` (pivot row fields)
  const pathsToAutogenerate = new Set<string>();
  let rowsWithPaths = filteredRows;
  const rowsWithMissingGroups: GridValidRowModel[] = [];

  if (visibleRows.length > 0) {
    rowsWithPaths = filteredRows.reduce<GridValidRowModel[]>((acc, row) => {
      const partialPath = visibleRows.map((pivotRow) => {
        const field = pivotRow.field;
        const colDef = columnLookup.get(field);
        if (colDef?.groupingValueGetter) {
          return String(colDef.groupingValueGetter(row[field] as never, row, colDef, apiRef));
        }
        if (colDef?.valueGetter) {
          return String(colDef.valueGetter(row[field] as never, row, colDef, apiRef));
        }
        return String(row[field]);
      });

      for (let index = 0; index < partialPath.length; index += 1) {
        const value = partialPath[index];
        if (value === undefined) {
          if (index === 0) {
            rowsWithMissingGroups.push({ ...row, group: false });
          }
          return acc;
        }
        const parentPath = partialPath.slice(0, index + 1);
        const stringifiedPath = parentPath.join(',');
        if (!pathsToAutogenerate.has(stringifiedPath)) {
          pathsToAutogenerate.add(stringifiedPath);
        }
      }
      acc.push({ ...row, path: [...partialPath, ''] });
      return acc;
    }, []);
  } else {
    rowsWithPaths = filteredRows.map((row) => ({ ...row, path: [''] }));
  }

  const autogeneratedRows = generateParentRows(pathsToAutogenerate);

  // Apply tree data filtering to include missing parents and children
  const filteredRowsWithGroups = getTreeDataFilteredRows(
    [...autogeneratedRows, ...rowsWithPaths, ...rowsWithMissingGroups],
    queryOptions.filterModel,
    columnsWithDefaultColDef,
  ) as GridValidRowModel[];

  // Get root rows
  const rootRows = findTreeDataRowChildren(filteredRowsWithGroups, []);
  const rootRowCount = rootRows.length;

  let filteredRowsWithMissingGroups: GridValidRowModel[] = [];
  let childRows = rootRows;
  if (queryOptions.groupKeys?.length === 0) {
    filteredRowsWithMissingGroups = filteredRowsWithGroups.filter(({ group }) => group === false);
  } else {
    childRows = findTreeDataRowChildren(filteredRowsWithGroups, queryOptions.groupKeys || []);
  }

  const columnTypeMap = new Map<string, GridColDef['type']>();
  for (const column of columnsWithDefaultColDef) {
    if (column.type) {
      columnTypeMap.set(column.field, column.type);
    }
  }

  let childRowsWithDescendantCounts = childRows.map((row) => {
    const descendants = findTreeDataRowChildren(
      filteredRowsWithGroups,
      row.path,
      'path',
      -1,
      ({ id }) => typeof id !== 'string' || !id.startsWith('auto-generated-parent-'),
    );
    const descendantCount = descendants.length;

    if (descendantCount > 0) {
      // Parent row, compute aggregation for both regular aggregation model and pivot values
      const regularAggregation = applyAggregation(
        queryOptions.pivotModel!.values.map((value) => ({ [value.field]: value.aggFunc })) as any,
        columnsWithDefaultColDef,
        descendants,
        row.id,
      );

      // Compute aggregations for each pivot column
      const pivotAggregations = computePivotAggregations(
        pivotColumnKeys,
        descendants,
        visibleValues,
        columnTypeMap,
        row.id,
        columnGroupIdSeparator,
      );

      return {
        ...row,
        descendantCount,
        ...regularAggregation,
        ...pivotAggregations,
      };
    }
    return { ...row, descendantCount } as GridRowModel;
  });

  // Apply sorting if provided
  if (queryOptions.sortModel) {
    const rowComparator = getRowComparator(
      queryOptions.sortModel,
      {},
      pivotColumnKeys.map((key) => ({
        field: key,
        type: 'number',
        sortComparator: gridStringOrNumberComparator,
      })),
    );
    const sortedMissingGroups = [...filteredRowsWithMissingGroups].sort(rowComparator);
    const sortedChildRows = [...childRowsWithDescendantCounts].sort(rowComparator);
    childRowsWithDescendantCounts = [...sortedMissingGroups, ...sortedChildRows];
  }

  // Apply pagination if provided
  if (queryOptions.paginationModel && queryOptions.groupKeys?.length === 0) {
    // Only paginate root rows, grid should refetch root rows when `paginationModel` updates
    const { pageSize, page } = queryOptions.paginationModel;
    if (pageSize < childRowsWithDescendantCounts.length) {
      childRowsWithDescendantCounts = childRowsWithDescendantCounts.slice(
        page * pageSize,
        (page + 1) * pageSize,
      );
    }
  }

  // Compute aggregate row if pivot values are provided
  let aggregateRow: GridRowModel | undefined;
  if (visibleValues.length > 0) {
    const regularAggregation = applyAggregation(
      visibleValues.map((value) => ({ [value.field]: value.aggFunc })) as any,
      columnsWithDefaultColDef,
      filteredRowsWithGroups,
    );

    // Compute aggregations for each pivot column for the entire dataset
    const pivotAggregations = computePivotAggregations(
      pivotColumnKeys,
      filteredRowsWithGroups.filter(
        (row) => typeof row.id !== 'string' || !row.id.startsWith('auto-generated-parent-'),
      ),
      visibleValues,
      columnTypeMap,
      'root',
      columnGroupIdSeparator,
    );

    aggregateRow = {
      ...regularAggregation,
      ...pivotAggregations,
    };
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ rows: childRowsWithDescendantCounts, rootRowCount, pivotColumns, aggregateRow });
    }, delay); // simulate network latency
  });
};
