import { GRID_STRING_COL_DEF, GridColDef } from '@mui/x-data-grid';

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
  valueGetter: (params) =>
    params.rowNode.type === 'group' || params.rowNode.type === 'leaf'
      ? params.rowNode.groupingKey
      : undefined,
};

export const GRID_TREE_DATA_GROUPING_FIELD = '__tree_data_group__';

export const GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES: Pick<
  GridColDef,
  'field' | 'editable' | 'groupable'
> = {
  field: GRID_TREE_DATA_GROUPING_FIELD,
  editable: false,
  groupable: false,
};
