import * as React from 'react';
import {
  GridCellCheckboxRenderer,
  GridHeaderCheckbox,
} from '../../components/GridCheckboxRenderer';
import { GridColDef } from './gridColDef';
import { GRID_BOOLEAN_COL_DEF } from './gridBooleanColDef';

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
  renderHeader: (params) => <GridHeaderCheckbox {...params} />,
  renderCell: (params) => <GridCellCheckboxRenderer {...params} />,
  cellClassName: 'MuiDataGrid-cellCheckbox',
  headerClassName: 'MuiDataGrid-colCellCheckbox',
};
