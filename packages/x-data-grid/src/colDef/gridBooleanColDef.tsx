import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridColTypeDef, GridValueFormatter } from '../models/colDef/gridColDef';
import { renderBooleanCell } from '../components/cell/GridBooleanCell';
import { renderEditBooleanCell } from '../components/cell/GridEditBooleanCell';
import { gridNumberComparator } from '../hooks/features/sorting/gridSortingUtils';
import { getGridBooleanOperators } from './gridBooleanOperators';

const gridBooleanFormatter: GridValueFormatter = (value, row, column, apiRef) => {
  return value
    ? apiRef.current.getLocaleText('booleanCellTrueLabel')
    : apiRef.current.getLocaleText('booleanCellFalseLabel');
};

const stringToBoolean = (value: string) => {
  switch (value.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;

    case 'false':
    case 'no':
    case '0':
    case 'null':
    case 'undefined':
      return false;

    default:
      return undefined;
  }
};

export const GRID_BOOLEAN_COL_DEF: GridColTypeDef<boolean | null, any> = {
  ...GRID_STRING_COL_DEF,
  type: 'boolean',
  display: 'flex',
  align: 'center',
  headerAlign: 'center',
  renderCell: renderBooleanCell,
  renderEditCell: renderEditBooleanCell,
  sortComparator: gridNumberComparator,
  valueFormatter: gridBooleanFormatter,
  filterOperators: getGridBooleanOperators(),
  getApplyQuickFilterFn: undefined,
  // @ts-ignore
  aggregable: false,
  // @ts-ignore
  pastedValueParser: (value) => stringToBoolean(value),
};
