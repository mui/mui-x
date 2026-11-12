import { gridRowIdSelector, GRID_STRING_COL_DEF } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { renderRowReorderCell } from '../../../components/GridRowReorderCell';

export const GRID_REORDER_COL_DEF: GridColDef = {
  ...GRID_STRING_COL_DEF,
  type: 'custom',
  field: '__reorder__',
  sortable: false,
  filterable: false,
  width: 50,
  align: 'center',
  headerAlign: 'center',
  disableColumnMenu: true,
  disableExport: true,
  disableReorder: true,
  resizable: false,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Premium augmentation adds aggregable only when the Premium package is included.
  // @ts-ignore Premium augmentation adds aggregable only when the Premium package is included.
  aggregable: false,
  chartable: false,
  renderHeader: () => ' ',
  renderCell: renderRowReorderCell,
  rowSpanValueGetter: (_, row, __, apiRef) => gridRowIdSelector(apiRef, row),
};
