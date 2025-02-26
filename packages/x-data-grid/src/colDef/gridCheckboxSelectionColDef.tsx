import * as React from 'react';
import { GridCellCheckboxRenderer } from '../components/columnSelection/GridCellCheckboxRenderer';
import { GridHeaderCheckbox } from '../components/columnSelection/GridHeaderCheckbox';
import { GridColDef } from '../models/colDef/gridColDef';
import { GRID_BOOLEAN_COL_DEF } from './gridBooleanColDef';
import { gridRowIdSelector } from '../hooks/core/gridPropsSelectors';

export const GRID_CHECKBOX_SELECTION_FIELD = '__check__';

export const GRID_CHECKBOX_SELECTION_COL_DEF: GridColDef = {
  ...GRID_BOOLEAN_COL_DEF,
  type: 'custom',
  field: GRID_CHECKBOX_SELECTION_FIELD,
  width: 50,
  resizable: false,
  sortable: false,
  filterable: false,
  // @ts-ignore
  aggregable: false,
  disableColumnMenu: true,
  disableReorder: true,
  disableExport: true,
  getApplyQuickFilterFn: undefined,
  display: 'flex',
  valueGetter: (value, row, column, apiRef) => {
    const rowId = gridRowIdSelector(apiRef, row);
    return apiRef.current.isRowSelected(rowId);
  },
  renderHeader: (params) => <GridHeaderCheckbox {...params} />,
  renderCell: (params) => <GridCellCheckboxRenderer {...params} />,
};
