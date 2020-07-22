import { stringNumberComparer } from '../../utils/sortingUtils';
import { ColTypeDef } from './colDef';

export const STRING_COL_DEF: ColTypeDef = {
  width: 100,
  hide: false,
  sortable: true,
  resizable: true,
  sortDirection: null,
  sortComparator: stringNumberComparer,
  type: 'string',
  align: 'left',
};
