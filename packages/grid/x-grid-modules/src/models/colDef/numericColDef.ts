import { ColTypeDef } from './colDef';
import { isNumber, numberComparer } from '../../utils';
import { STRING_COL_DEF } from './stringColDef';

export const NUMERIC_COL_DEF: ColTypeDef = {
  ...STRING_COL_DEF,
  type: 'number',
  align: 'right',
  width: 80,
  sortComparator: numberComparer,
  valueFormatter: ({ value }) => (value && isNumber(value) && value.toLocaleString()) || value,
};
//todo memoize
