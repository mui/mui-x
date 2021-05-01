import * as React from 'react';
import { GridColDef } from './gridColDef';
import { GRID_BOOLEAN_COL_DEF } from './gridBooleanColDef';
import { GridCheckboxHeaderOrCell } from '../../components/columnSelection/GridCheckboxHeaderOrCellProps';

export const gridCheckboxSelectionColDef: GridColDef = {
  ...GRID_BOOLEAN_COL_DEF,
  field: '__check__',
  type: 'checkboxSelection',
  width: 48,
  resizable: true,
  sortable: false,
  filterable: false,
  disableClickEventBubbling: true,
  disableColumnMenu: true,
  valueGetter: (params) => params.api.getState().selection[params.id] !== undefined,
  renderHeader: (params) => <GridCheckboxHeaderOrCell headerParams={params} />,
  renderCell: (params) => <GridCheckboxHeaderOrCell cellParams={params} />,
  cellClassName: 'MuiDataGrid-cellCheckbox',
  headerClassName: 'MuiDataGrid-colCellCheckbox',
};
