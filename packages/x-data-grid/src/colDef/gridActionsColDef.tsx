import { GRID_STRING_COL_DEF } from './gridStringColDef';
import type { GridColTypeDef } from '../models/colDef/gridColDef';
import { renderActionsCell } from '../components/cell/GridActionsCell';

export const GRID_ACTIONS_COLUMN_TYPE = 'actions';

export const GRID_ACTIONS_COL_DEF: GridColTypeDef = {
  ...GRID_STRING_COL_DEF,
  sortable: false,
  filterable: false,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Premium augmentation adds aggregable only when the Premium package is included.
  // @ts-ignore Premium augmentation adds aggregable only when the Premium package is included.
  aggregable: false,
  chartable: false,
  width: 100,
  display: 'flex',
  align: 'center',
  headerAlign: 'center',
  headerName: '',
  disableColumnMenu: true,
  disableExport: true,
  renderCell: renderActionsCell,
  getApplyQuickFilterFn: () => null,
};
