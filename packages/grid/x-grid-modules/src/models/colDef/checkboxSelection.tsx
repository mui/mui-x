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
  headerComponent: (params) => <HeaderCheckbox {...params} />,
  cellRenderer: (params) => <CellCheckboxRenderer {...params} />,
  cellClass: 'checkbox-selection-cell',
  headerClass: 'checkbox-selection-header-cell',
};
