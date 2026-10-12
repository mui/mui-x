import { renderEditInputCell } from '../components/cell/GridEditInputCell';
import { gridStringOrNumberComparator } from '../hooks/features/sorting/gridSortingUtils';
import type { GridColTypeDef } from '../models/colDef/gridColDef';
import { getGridStringOperators, getGridStringQuickFilterFn } from './gridStringOperators';

/**
 * TODO: Move pro and premium properties outside of this Community file
 */
export const GRID_STRING_COL_DEF: GridColTypeDef<any, any> = {
  width: 100,
  minWidth: 50,
  maxWidth: Infinity,
  hideable: true,
  sortable: true,
  resizable: true,
  filterable: true,
  groupable: true,
  pinnable: true,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment -- Premium augmentation adds aggregable only when the Premium package is included.
  // @ts-ignore Premium augmentation adds aggregable only when the Premium package is included.
  aggregable: true,
  chartable: true,
  editable: false,
  sortComparator: gridStringOrNumberComparator,
  type: 'string',
  align: 'left',
  filterOperators: getGridStringOperators(),
  renderEditCell: renderEditInputCell,
  getApplyQuickFilterFn: getGridStringQuickFilterFn,
};
