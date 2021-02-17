import { isDate } from '../../utils/utils';
import { gridDateComparer } from '../../utils/sortingUtils';
import { CellValue } from '../cell';
import { getGridDateOperators } from './gridDateOperators';
import { GRID_STRING_COL_DEF } from './gridStringColDef';
import { ColTypeDef } from './colDef';

export function gridDateFormatter({ value }: { value: CellValue }) {
  if (isDate(value)) {
    return value.toLocaleDateString();
  }
  return value;
}

export function gridDateTimeFormatter({ value }: { value: CellValue }) {
  if (isDate(value)) {
    return value.toLocaleString();
  }
  return value;
}

export const GRID_DATE_COL_DEF: ColTypeDef = {
  ...GRID_STRING_COL_DEF,
  type: 'date',
  sortComparator: gridDateComparer,
  valueFormatter: gridDateFormatter,
  filterOperators: getGridDateOperators(),
};

export const GRID_DATETIME_COL_DEF: ColTypeDef = {
  ...GRID_STRING_COL_DEF,
  type: 'dateTime',
  sortComparator: gridDateComparer,
  valueFormatter: gridDateTimeFormatter,
  filterOperators: getGridDateOperators(true),
};
