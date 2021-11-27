import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';
import {
  GridTreeDataGroupingCell,
  GridTreeDataGroupingCellValue,
} from '../../../components/cell/GridTreeDataGroupingCell';
import { GRID_STRING_COL_DEF } from '../../../models/colDef/gridStringColDef';
import { gridFilteredDescendantCountLookupSelector } from '../filter/gridFilterSelector';
import { GridRenderCellParams } from '../../../models';

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
  valueGetter: ({ rowNode, api }): GridTreeDataGroupingCellValue => ({
    label: rowNode.groupingValue,
    depth: rowNode.depth,
    expanded: rowNode.childrenExpanded ?? false,
    filteredDescendantCount: gridFilteredDescendantCountLookupSelector(api.state)[rowNode.id] ?? 0,
  }),
  renderCell: (params: GridRenderCellParams<GridTreeDataGroupingCellValue>) => (
    <GridTreeDataGroupingCell {...params} />
  ),
};

export const GRID_TREE_DATA_GROUP_COL_DEF_FORCED_FIELDS: Pick<GridColDef, 'field' | 'editable'> = {
  field: '__tree_data_group__',
  editable: false,
};
