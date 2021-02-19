import * as React from 'react';
import {
  GridCellCheckboxRenderer,
  GridHeaderCheckbox,
} from '../../components/GridCheckboxRenderer';
import { GridColDef } from './gridColDef';

export const gridCheckboxSelectionColDef: GridColDef = {
  field: '__check__',
  headerName: 'Checkbox Selection',
  description: 'Select Multiple Rows',
  type: 'checkboxSelection',
  width: 48,
  align: 'center',
  headerAlign: 'center',
  resizable: true,
  sortable: false,
  filterable: false,
  disableClickEventBubbling: true,
  disableColumnMenu: true,
  valueGetter: (params) => params.api.getState().selection[params.row.id],
  renderHeader: (params) => <GridHeaderCheckbox {...params} />,
  renderCell: (params) => <GridCellCheckboxRenderer {...params} />,
  cellClassName: 'MuiDataGrid-cellCheckbox',
  headerClassName: 'MuiDataGrid-colCellCheckbox',
};
