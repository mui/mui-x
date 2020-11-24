import { stringNumberComparer } from '../../utils/sortingUtils';
import { ColTypeDef } from './colDef';
import { STRING_OPERATORS } from './stringOperators';

export const STRING_COL_DEF: ColTypeDef = {
  width: 100,
  hide: false,
  sortable: true,
  resizable: true,
  filterable: true,
  sortDirection: null,
  sortComparator: stringNumberComparer,
  type: 'string',
  align: 'left',
  filterOperators: STRING_OPERATORS,
};
