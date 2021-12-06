import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridTreeDataGroupingCell } from '../../../components/cell/GridTreeDataGroupingCell';
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
  renderCell: (params) => <GridTreeDataGroupingCell {...params} />,
};

export const GRID_TREE_DATA_GROUP_COL_DEF_FORCED_PROPERTIES: Pick<
  GridColDef,
  'field' | 'editable'
> = {
  field: '__tree_data_group__',
  editable: false,
};
