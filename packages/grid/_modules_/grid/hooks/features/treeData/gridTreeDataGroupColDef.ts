import { GridColDef } from '../../../models/colDef/gridColDef';
import { GRID_STRING_COL_DEF } from '../../../models/colDef/gridStringColDef';
import { GridValueGetterFullParams } from '../../../models';

/**
 * TODO: Add sorting and filtering on the value and the filteredDescendantCount
 */
export const GRID_TREE_DATA_GROUP_COL_DEF: Omit<GridColDef, 'field' | 'editable'> = {
  ...GRID_STRING_COL_DEF,
  type: 'treeDataGroup',
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  disableReorder: true,
  align: 'left',
  width: 200,
  valueGetter: (params) => (params as GridValueGetterFullParams).rowNode.groupingKey,
};

export const GRID_TREE_DATA_GROUP_COL_DEF_FORCED_PROPERTIES: Pick<
  GridColDef,
  'field' | 'editable' | 'canBeGrouped'
> = {
  field: '__tree_data_group__',
  editable: false,
  canBeGrouped: false,
};
