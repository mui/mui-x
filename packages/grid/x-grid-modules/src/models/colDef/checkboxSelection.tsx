import * as React from 'react';
import { ColDef } from './colDef';
import { CellCheckboxRenderer, HeaderCheckbox } from '../../components/checkbox-renderer';

export const checkboxSelectionColDef: ColDef = {
  field: '__check__',
  description: 'Select Multiple Rows',
  type: 'checkboxSelection',
  width: 80,
  align: 'center',
  headerAlign: 'center',
  resizable: true,
  sortable: false,
  disableClickEventBubbling: true,
  valueGetter: (params) => params.rowModel.selected,
  renderHeader: (params) => <HeaderCheckbox {...params} />,
  renderCell: (params) => <CellCheckboxRenderer {...params} />,
  cellClassName: 'checkbox-selection-cell',
  headerClassName: 'checkbox-selection-header-cell',
};
