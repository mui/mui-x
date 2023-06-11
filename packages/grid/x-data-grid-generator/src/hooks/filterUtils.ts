import {
  GridColDef,
  GridFilterOperator,
  GridRowModel,
  getGridStringOperators,
  getGridBooleanOperators,
  getGridDateOperators,
  getGridNumericOperators,
  getGridSingleSelectOperators,
  GridFilterModel,
} from '@mui/x-data-grid-premium';

const FILTER_OPERATORS: { [columnType: string]: any } = {
  string: getGridStringOperators,
  boolean: getGridBooleanOperators,
  date: getGridDateOperators,
  dateTime: getGridDateOperators,
  number: getGridNumericOperators,
  singleSelect: getGridSingleSelectOperators,
};

export const getFilterOperators = (column: GridColDef): GridFilterOperator[] => {
  return FILTER_OPERATORS[column.type || 'string']();
};

export const filterServerSide = (
  columns: GridColDef[],
  rows: GridRowModel[],
  filterModel: GridFilterModel,
): GridRowModel[] => {
  const filterModelItems = filterModel.items ?? [];
  if (!filterModelItems.length) {
    return rows;
  }
  const appliers = new Map();
  filterModelItems.forEach((filterItem) => {
    const column = columns.find((col) => col.field === filterItem.field);
    if (!column) {
      return;
    }
    const filterOperator = getFilterOperators(column).find(
      (operator) => operator.value === filterItem.operator,
    );
    if (!filterOperator) {
      return;
    }
    if (!filterItem.value && filterOperator.requiresFilterValue) {
      return;
    }
    const applyFilterFn = filterOperator.getApplyFilterFn(filterItem, column);
    if (!applyFilterFn) {
      return;
    }
    appliers.set(column.field, applyFilterFn);
  });

  const addedRowsIds = new Set<string>();

  // find all the rows that satisfy the filter criteria
  const flatFilteredRows = rows.filter((row) => {
    let passed = true;
    appliers.forEach((applier, field) => {
      if (!applier({ value: row[field] })) {
        passed = false;
      }
    });
    if (passed) {
      addedRowsIds.add(row.id);
    }
    return passed;
  });

  const parents: GridRowModel[] = [];
  let children: GridRowModel[] = [];

  // add all the parents of flatFilteredRows if not already added
  flatFilteredRows.forEach((row) => {
    // get all my parents
    const currentPath = row.path.slice(0, -1);
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
        (r) => r.path.join('.').startsWith(row.path.join('.')) && !addedRowsIds.has(r.id),
      ),
    );
  });

  return [...flatFilteredRows, ...parents, ...children];
};
