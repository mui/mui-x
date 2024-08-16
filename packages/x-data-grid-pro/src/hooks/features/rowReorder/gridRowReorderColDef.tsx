import { GridColDef, GRID_STRING_COL_DEF } from '@mui/x-data-grid';
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
  // @ts-ignore
  aggregable: false,
  renderHeader: () => ' ',
  renderCell: renderRowReorderCell,
};
