import { gridStringNumberComparer } from '../../utils/sortingUtils';
import { ColTypeDef } from './colDef';
import { getGridStringOperators } from './gridStringOperators';

export const GRID_STRING_COL_DEF: ColTypeDef = {
  width: 100,
  hide: false,
  sortable: true,
  resizable: true,
  filterable: true,
  sortComparator: gridStringNumberComparer,
  type: 'string',
  align: 'left',
  filterOperators: getGridStringOperators(),
};
