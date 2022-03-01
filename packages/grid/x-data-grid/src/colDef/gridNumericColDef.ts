import { gridNumberComparator } from '../hooks/features/sorting/gridSortingUtils';
import { isNumber } from '../utils/utils';
import { getGridNumericOperators } from './gridNumericOperators';
import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridColTypeDef } from '../models/colDef/gridColDef';

export const GRID_NUMERIC_COL_DEF: GridColTypeDef = {
  ...GRID_STRING_COL_DEF,
  type: 'number',
  align: 'right',
  headerAlign: 'right',
  sortComparator: gridNumberComparator,
  valueParser: (value) => (value === '' ? null : Number(value)),
  valueFormatter: ({ value }) => (value && isNumber(value) && value.toLocaleString()) || value,
  filterOperators: getGridNumericOperators(),
};
