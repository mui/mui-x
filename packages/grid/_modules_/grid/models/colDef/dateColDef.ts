import { isDate } from '../../utils/utils';
import { dateComparer } from '../../utils/sortingUtils';
import { CellValue } from '../cell';
import { getDateOperators } from './dateOperators';
import { STRING_COL_DEF } from './stringColDef';
import { ColTypeDef } from './colDef';

export function dateFormatter({ value }: { value: CellValue }) {
  if (isDate(value)) {
    return value.toLocaleDateString();
  }
  return value;
}

export function dateTimeFormatter({ value }: { value: CellValue }) {
  if (isDate(value)) {
    return value.toLocaleString();
  }
  return value;
}

export const DATE_COL_DEF: ColTypeDef = {
  ...STRING_COL_DEF,
  type: 'date',
  sortComparator: dateComparer,
  valueFormatter: dateFormatter,
  filterOperators: getDateOperators(),
};

export const DATETIME_COL_DEF: ColTypeDef = {
  ...STRING_COL_DEF,
  type: 'dateTime',
  sortComparator: dateComparer,
  valueFormatter: dateTimeFormatter,
  filterOperators: getDateOperators(true),
};
