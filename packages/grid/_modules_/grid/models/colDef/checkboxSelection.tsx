import * as React from 'react';
import { CellCheckboxRenderer, HeaderCheckbox } from '../../components/checkbox-renderer';
import { ColDef } from './colDef';

export const checkboxSelectionColDef: ColDef = {
  field: '__check__',
  description: 'Select Multiple Rows',
  type: 'checkboxSelection',
  width: 48,
  align: 'center',
  headerAlign: 'center',
  resizable: true,
  sortable: false,
  disableClickEventBubbling: true,
  valueGetter: (params) => params.api.getState().selection[params.rowModel.id],
  renderHeader: (params) => <HeaderCheckbox {...params} />,
  renderCell: (params) => <CellCheckboxRenderer {...params} />,
  cellClassName: 'MuiDataGrid-cellCheckbox',
  headerClassName: 'MuiDataGrid-colCellCheckbox',
};
