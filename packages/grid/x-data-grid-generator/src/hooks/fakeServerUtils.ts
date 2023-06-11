import {
  GridRowModel,
  GridFilterModel,
  GridSortModel,
  GridLogicOperator,
  GridFilterOperator,
  GridColDef,
} from '@mui/x-data-grid-pro';

export const findTreeDataRowChildren = (
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
    if (
      ((depth < 0 && rowPath.length > parentDepth) || rowPath.length === parentDepth + depth) &&
      parentPath.every((value, index) => value === rowPath[index])
    ) {
      children.push(row);
    }
  }
  return children;
};

export const simplifiedValueGetter = (field: string, colDef: GridColDef) => (row: GridRowModel) => {
  const params = { id: row.id, row, field, rowNode: {} };
  // @ts-ignore
  return colDef.valueGetter?.(params) || row[field];
};

export const getRowComparator = (
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

const getFilterFunctions = (
  filterModel: GridFilterModel,
  columnsWithDefaultColDef: GridColDef[],
) => {
  return filterModel.items.map((filterItem) => {
    const { field, operator } = filterItem;
    const colDef = columnsWithDefaultColDef.find((column) => column.field === field) as any;

    const filterOperator: any = colDef.filterOperators.find(
      ({ value }: GridFilterOperator) => operator === value,
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
};

export const getFilteredRows = (
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
  const filterFunctions = getFilterFunctions(filterModel, columnsWithDefaultColDef);

  if (filterModel.logicOperator === GridLogicOperator.Or) {
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

export const getFilteredRowsServerSide = (
  rows: GridRowModel[],
  filterModel: GridFilterModel | undefined,
  columnsWithDefaultColDef: GridColDef[],
  pathKey: string = 'path',
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
  const filterFunctions = getFilterFunctions(filterModel, columnsWithDefaultColDef);

  const addedRowsIds = new Set<string>();
  const flatFilteredRows =
    filterModel.logicOperator === GridLogicOperator.Or
      ? rows.filter((row: GridRowModel) =>
          filterModel.items.some((_, index) => {
            const value = valueGetters[index](row);
            const keepRow =
              filterFunctions[index] === null ? true : filterFunctions[index]({ value });
            if (keepRow) {
              addedRowsIds.add(row.id);
            }
            return keepRow;
          }),
        )
      : rows.filter((row: GridRowModel) =>
          filterModel.items.every((_, index) => {
            const value = valueGetters[index](row);
            const keepRow =
              filterFunctions[index] === null ? true : filterFunctions[index]({ value });
            if (keepRow) {
              addedRowsIds.add(row.id);
            }
            return keepRow;
          }),
        );

  const parents: GridRowModel[] = [];
  let children: GridRowModel[] = [];

  // add all the parents of flatFilteredRows if not already added
  flatFilteredRows.forEach((row) => {
    // get all my parents
    const currentPath = row[pathKey].slice(0, -1);
    while (currentPath.join('.') !== '') {
      const foundRow = rows.find((r) => r.path.join('.') === currentPath.join('.'));
      if (foundRow && !addedRowsIds.has(foundRow.id)) {
        parents.push(foundRow);
        addedRowsIds.add(foundRow.id);
      }
      currentPath.pop();
    }
    // get all my children
    children = children.concat(
      rows.filter(
        (r) => r[pathKey].join('.').startsWith(row[pathKey].join('.')) && !addedRowsIds.has(r.id),
      ),
    );
  });

  return [...flatFilteredRows, ...parents, ...children];
};
