import {
  GRID_STRING_COL_DEF,
  GridColDef,
  gridRowIdSelector,
  gridRowNodeSelector,
} from '@mui/x-data-grid';
import { GRID_TREE_DATA_GROUPING_FIELD } from '@mui/x-data-grid/internals';

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
