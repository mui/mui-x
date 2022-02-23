import { gridDateComparator } from '../hooks/features/sorting/gridSortingUtils';
import { GridCellValue } from '../models/gridCell';
import { getGridDateOperators } from './gridDateOperators';
import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { GridColTypeDef } from '../models/colDef/gridColDef';
import { renderEditDateCell } from '../components/cell/GridEditDateCell';

export function gridDateFormatter({ value }: { value: GridCellValue }) {
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return value;
}

export function gridDateTimeFormatter({ value }: { value: GridCellValue }) {
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  return value;
}

export const GRID_DATE_COL_DEF: GridColTypeDef = {
  ...GRID_STRING_COL_DEF,
  type: 'date',
  sortComparator: gridDateComparator,
  valueFormatter: gridDateFormatter,
  filterOperators: getGridDateOperators(),
  renderEditCell: renderEditDateCell,
};

export const GRID_DATETIME_COL_DEF: GridColTypeDef = {
  ...GRID_STRING_COL_DEF,
  type: 'dateTime',
  sortComparator: gridDateComparator,
  valueFormatter: gridDateTimeFormatter,
  filterOperators: getGridDateOperators(true),
  renderEditCell: renderEditDateCell,
};
