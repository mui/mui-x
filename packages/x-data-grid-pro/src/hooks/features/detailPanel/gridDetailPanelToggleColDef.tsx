import * as React from 'react';
import { GRID_STRING_COL_DEF, GridColDef } from '@mui/x-data-grid';
import { GridApiPro } from '../../../models/gridApiPro';
import { GridDetailPanelToggleCell } from '../../../components/GridDetailPanelToggleCell';
import { gridDetailPanelExpandedRowIdsSelector } from './gridDetailPanelSelector';

export const GRID_DETAIL_PANEL_TOGGLE_FIELD = '__detail_panel_toggle__';

export const GRID_DETAIL_PANEL_TOGGLE_COL_DEF: GridColDef = {
  ...GRID_STRING_COL_DEF,
  type: 'custom',
  field: GRID_DETAIL_PANEL_TOGGLE_FIELD,
  editable: false,
  sortable: false,
  filterable: false,
  resizable: false,
  // @ts-ignore
  aggregable: false,
  disableColumnMenu: true,
  disableReorder: true,
  disableExport: true,
  align: 'left',
  width: 40,
  valueGetter: (value, row, column, apiRef) => {
    const rowId = apiRef.current.getRowId(row);
    const expandedRowIds = gridDetailPanelExpandedRowIdsSelector(
      (apiRef.current as GridApiPro).state,
    );
    return expandedRowIds.includes(rowId);
  },
  renderCell: (params) => <GridDetailPanelToggleCell {...params} />,
  renderHeader: () => null,
};
