import {
  GRID_STRING_COL_DEF,
  type GridColDef,
  gridRowIdSelector,
  gridRowNodeSelector,
} from '@mui/x-data-grid';
import {
  GRID_TREE_DATA_GROUPING_FIELD,
  type GridHydrateColumnsValue,
} from '@mui/x-data-grid/internals';

/**
 * TODO: Add sorting and filtering on the value and the filteredDescendantCount
 */
export const GRID_TREE_DATA_GROUPING_COL_DEF: Omit<GridColDef, 'field' | 'editable'> = {
  ...GRID_STRING_COL_DEF,
  type: 'custom',
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  disableReorder: true,
  align: 'left',
  width: 200,
  valueGetter: (value, row, column, apiRef) => {
    const rowId = gridRowIdSelector(apiRef, row);
    const rowNode = gridRowNodeSelector(apiRef, rowId);
    return rowNode?.type === 'group' || rowNode?.type === 'leaf' ? rowNode.groupingKey : undefined;
  },
};

export { GRID_TREE_DATA_GROUPING_FIELD };

export const GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES: Pick<
  GridColDef,
  'field' | 'editable' | 'groupable'
> = {
  field: GRID_TREE_DATA_GROUPING_FIELD,
  editable: false,
  groupable: false,
};

/**
 * Adds, updates or removes the tree data grouping column in the `hydrateColumns` columns state.
 * Shared between the client-side and server-side (data source) tree data pre-processors.
 */
export function updateTreeDataGroupingColumn(
  columnsState: GridHydrateColumnsValue,
  getGroupingColDef: () => GridColDef,
  shouldHaveGroupingColumn: boolean,
): GridHydrateColumnsValue {
  const groupingColDefField = GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES.field as string;

  const prevGroupingColumn = columnsState.lookup[groupingColDefField];

  if (shouldHaveGroupingColumn) {
    const newGroupingColumn = getGroupingColDef();
    if (prevGroupingColumn) {
      newGroupingColumn.width = prevGroupingColumn.width;
      newGroupingColumn.flex = prevGroupingColumn.flex;
    }
    columnsState.lookup[groupingColDefField] = newGroupingColumn;
    if (prevGroupingColumn == null) {
      columnsState.orderedFields = [groupingColDefField, ...columnsState.orderedFields];
    }
  } else if (!shouldHaveGroupingColumn && prevGroupingColumn) {
    delete columnsState.lookup[groupingColDefField];
    columnsState.orderedFields = columnsState.orderedFields.filter(
      (field) => field !== groupingColDefField,
    );
  }

  return columnsState;
}
