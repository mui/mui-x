import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridTreeDataGroupingCell } from '../../../components/cell/GridTreeDataGroupingCell';
import { GRID_STRING_COL_DEF } from '../../../models/colDef/gridStringColDef';

export const GRID_TREE_DATA_GROUP_COL_DEF: GridColDef = {
  ...GRID_STRING_COL_DEF,
  field: '__tree_data_group__',
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  disableReorder: true,
  shouldRenderFillerRows: true,
  align: 'left',
  width: 200,
  renderCell: (params) => <GridTreeDataGroupingCell {...params} />,
};
