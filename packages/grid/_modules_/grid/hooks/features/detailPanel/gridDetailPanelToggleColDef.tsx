import * as React from 'react';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GRID_STRING_COL_DEF } from '../../../models/colDef/gridStringColDef';
import { GridDetailPanelToggleCell } from '../../../components/cell/GridDetailPanelToggleCell';
import { gridDetailPanelExpandedRowIdsSelector } from './gridDetailPanelSelector';
import { GridApiPro } from '../../../models/api/gridApiPro';

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
  align: 'left',
  width: 40,
  valueGetter: (params) => {
    const expandedRowIds = gridDetailPanelExpandedRowIdsSelector(params.api.state);
    return expandedRowIds.includes(params.id);
  },
  renderCell: (params) => <GridDetailPanelToggleCell {...params} />,
};
