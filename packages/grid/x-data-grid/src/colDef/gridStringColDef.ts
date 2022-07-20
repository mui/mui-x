import { renderEditInputCell } from '../components/cell/GridEditInputCell';
import { gridStringOrNumberComparator } from '../hooks/features/sorting/gridSortingUtils';
import { GridColTypeDef } from '../models/colDef/gridColDef';
import { getGridStringOperators, getGridStringQuickFilterFn } from './gridStringOperators';

/**
 * TODO: Move pro and premium properties outside of this Community file
 */
export const GRID_STRING_COL_DEF: GridColTypeDef<any, any> = {
  width: 100,
  minWidth: 50,
  maxWidth: Infinity,
  hide: false,
  hideable: true,
  sortable: true,
  resizable: true,
  filterable: true,
  groupable: true,
  pinnable: true,
  // @ts-ignore
  private_aggregable: true,
  editable: false,
  sortComparator: gridStringOrNumberComparator,
  type: 'string',
  align: 'left',
  filterOperators: getGridStringOperators(),
  renderEditCell: renderEditInputCell,
  getApplyQuickFilterFn: getGridStringQuickFilterFn,
};
