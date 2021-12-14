import { renderEditInputCell } from '../../components/cell/GridEditInputCell';
import { gridStringNumberComparer } from '../../utils/sortingUtils';
import { GridColTypeDef } from './gridColDef';
import { getGridStringOperators } from './gridStringOperators';

export const GRID_STRING_COL_DEF: GridColTypeDef = {
  width: 100,
  minWidth: 50,
  hide: false,
  sortable: true,
  resizable: true,
  filterable: true,
  canBeGrouped: true,
  sortComparator: gridStringNumberComparer,
  type: 'string',
  align: 'left',
  filterOperators: getGridStringOperators(),
  renderEditCell: renderEditInputCell,
};
