import { ColTypeDef } from './colDef';
import { stringNumberComparer } from '../../utils';

export const STRING_COL_DEF: ColTypeDef = {
  width: 100,
  hide: false,
  sortable: true,
  sortDirection: null,
  comparator: stringNumberComparer,
  type: 'string',
  align: 'left',
};
