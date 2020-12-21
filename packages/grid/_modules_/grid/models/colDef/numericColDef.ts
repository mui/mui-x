import { numberComparer } from '../../utils/sortingUtils';
import { isNumber } from '../../utils/utils';
import { getNumericColumnOperators } from './numericOperators';
import { STRING_COL_DEF } from './stringColDef';
import { ColTypeDef } from './colDef';

export const NUMERIC_COL_DEF: ColTypeDef = {
  ...STRING_COL_DEF,
  type: 'number',
  align: 'right',
  headerAlign: 'right',
  sortComparator: numberComparer,
  valueFormatter: ({ value }) => (value && isNumber(value) && value.toLocaleString()) || value,
  filterOperators: getNumericColumnOperators(),
};
