import * as React from 'react';
import { GridColDef, GRID_STRING_COL_DEF } from '@mui/x-data-grid';
import { GridDetailPanelToggleCell } from '../../../components/GridDetailPanelToggleCell';
import { gridDetailPanelExpandedRowIdsSelector } from './gridDetailPanelSelector';
import { GridApiPro } from '../../../models/gridApiPro';

export const GRID_DETAIL_PANEL_TOGGLE_FIELD = '__detail_panel_toggle__';

export const GRID_DETAIL_PANEL_TOGGLE_COL_DEF: GridColDef<GridApiPro> = {
  ...GRID_STRING_COL_DEF,
  field: GRID_DETAIL_PANEL_TOGGLE_FIELD,
  headerName: '',
  type: 'detailPanelToggle',
  editable: false,
  sortable: false,
  filterable: false,
  resizable: false,
  disableColumnMenu: true,
  disableReorder: true,
  disableExport: true,
  align: 'left',
  width: 40,
  valueGetter: (params) => {
    const expandedRowIds = gridDetailPanelExpandedRowIdsSelector(params.api.state);
    return expandedRowIds.includes(params.id);
  },
  renderCell: (params) => <GridDetailPanelToggleCell {...params} />,
};
