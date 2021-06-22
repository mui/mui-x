import * as React from 'react';
import { GridCellCheckboxRenderer } from '../../components/columnSelection/GridCellCheckboxRenderer';
import { GridHeaderCheckbox } from '../../components/columnSelection/GridHeaderCheckbox';
import { selectedIdsLookupSelector } from '../../hooks/features/selection/gridSelectionSelector';
import { GridColDef } from './gridColDef';
import { GRID_BOOLEAN_COL_DEF } from './gridBooleanColDef';

export const gridCheckboxSelectionColDef: GridColDef = {
  ...GRID_BOOLEAN_COL_DEF,
  field: '__check__',
  type: 'checkboxSelection',
  width: 48,
  resizable: false,
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  valueGetter: (params) => {
    const selectionLookup = selectedIdsLookupSelector(params.api.getState());
    return selectionLookup[params.id] !== undefined;
  },
  renderHeader: (params) => <GridHeaderCheckbox {...params} />,
  renderCell: (params) => <GridCellCheckboxRenderer {...params} />,
  cellClassName: 'MuiDataGrid-cellCheckbox',
  headerClassName: 'MuiDataGrid-columnHeaderCheckbox',
};
