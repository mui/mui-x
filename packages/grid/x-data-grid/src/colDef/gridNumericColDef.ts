import { gridNumberComparator } from '../hooks/features/sorting/gridSortingUtils';
import { isNumber } from '../utils/utils';
import { getGridNumericOperators, getGridNumericQuickFilterFn } from './gridNumericOperators';
import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridColTypeDef } from '../models/colDef/gridColDef';
import { convertQuickFilterV7ToLegacy } from './utils';

export const GRID_NUMERIC_COL_DEF: GridColTypeDef<number | string | null, string> = {
  ...GRID_STRING_COL_DEF,
  type: 'number',
  align: 'right',
  headerAlign: 'right',
  sortComparator: gridNumberComparator,
  valueParser: (value) => (value === '' ? null : Number(value)),
  valueFormatter: ({ value }) => (isNumber(value) ? value.toLocaleString() : value || ''),
  filterOperators: getGridNumericOperators(),
  getApplyQuickFilterFn: convertQuickFilterV7ToLegacy(getGridNumericQuickFilterFn),
  getApplyQuickFilterFnV7: getGridNumericQuickFilterFn,
};
