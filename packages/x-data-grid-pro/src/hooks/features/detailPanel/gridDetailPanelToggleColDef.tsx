import type { RefObject } from '@mui/x-internals/types';
import { GRID_STRING_COL_DEF, type GridColDef, gridRowIdSelector } from '@mui/x-data-grid';
import { GRID_DETAIL_PANEL_TOGGLE_FIELD } from '@mui/x-data-grid/internals';
import type { GridApiPro } from '../../../models/gridApiPro';
import { GridDetailPanelToggleCell } from '../../../components/GridDetailPanelToggleCell';
import { gridDetailPanelExpandedRowIdsSelector } from './gridDetailPanelSelector';

export { GRID_DETAIL_PANEL_TOGGLE_FIELD };

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
  chartable: false,
  disableColumnMenu: true,
  disableReorder: true,
  disableExport: true,
  align: 'left',
  width: 40,
  valueGetter: (value, row, column, apiRef) => {
    const rowId = gridRowIdSelector(apiRef, row);
    const expandedRowIds = gridDetailPanelExpandedRowIdsSelector(apiRef as RefObject<GridApiPro>);
    return expandedRowIds.has(rowId);
  },
  rowSpanValueGetter: (_, row, __, apiRef) => gridRowIdSelector(apiRef, row),
  renderCell: (params) => <GridDetailPanelToggleCell {...params} />,
  renderHeader: ({ colDef }) => <div aria-label={colDef.headerName} />,
};
