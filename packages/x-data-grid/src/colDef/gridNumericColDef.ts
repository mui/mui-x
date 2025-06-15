import { gridNumberComparator } from '../hooks/features/sorting/gridSortingUtils';
import { isNumber } from '../utils/utils';
import { getGridNumericOperators, getGridNumericQuickFilterFn } from './gridNumericOperators';
import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridColTypeDef, GridValueFormatter } from '../models/colDef/gridColDef';

const gridNumericFormatter: GridValueFormatter = (value, row, column, apiRef) => {
  return isNumber(value) ? apiRef.current.getLocaleText('intlNumberFormat')(value) : value || ''
}

export const GRID_NUMERIC_COL_DEF: GridColTypeDef<number | string | null, string> = {
  ...GRID_STRING_COL_DEF,
  type: 'number',
  align: 'right',
  headerAlign: 'right',
  sortComparator: gridNumberComparator,
  valueParser: (value) => (value === '' ? null : Number(value)),
  valueFormatter: gridNumericFormatter,
  filterOperators: getGridNumericOperators(),
  getApplyQuickFilterFn: getGridNumericQuickFilterFn,
};
