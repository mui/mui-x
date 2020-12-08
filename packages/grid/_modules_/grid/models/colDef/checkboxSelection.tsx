import * as React from 'react';
import { CellCheckboxRenderer, HeaderCheckbox } from '../../components/CheckboxRenderer';
import { ColDef } from './colDef';

export const checkboxSelectionColDef: ColDef = {
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
  renderHeader: (params) => <HeaderCheckbox {...params} />,
  renderCell: (params) => <CellCheckboxRenderer {...params} />,
  cellClassName: 'MuiDataGrid-cellCheckbox',
  headerClassName: 'MuiDataGrid-colCellCheckbox',
};
