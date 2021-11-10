import { gridNumberComparer } from '../../utils/sortingUtils';
import { isNumber } from '../../utils/utils';
import { getGridNumericColumnOperators } from './gridNumericOperators';
import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridColTypeDef } from './gridColDef';

export const GRID_NUMERIC_COL_DEF: GridColTypeDef = {
  ...GRID_STRING_COL_DEF,
  type: 'number',
  align: 'right',
  headerAlign: 'right',
  sortComparator: gridNumberComparer,
  valueParser: (value) => (value === '' ? null : Number(value)),
  valueFormatter: ({ value }) => (value && isNumber(value) && value.toLocaleString()) || value,
  filterOperators: getGridNumericColumnOperators(),
};
