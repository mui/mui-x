import { GRID_STRING_COL_DEF, GridColDef, gridRowTreeSelector } from '@mui/x-data-grid';
import {
  GRID_TREE_DATA_GROUPING_FIELD,
  gridPropsStateSelector,
  getRowId,
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
    const { getRowId: getRowIdProp } = gridPropsStateSelector(apiRef.current.state);
    const rowId = getRowId(row, getRowIdProp);
    const rowNode = gridRowTreeSelector(apiRef)[rowId];
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
