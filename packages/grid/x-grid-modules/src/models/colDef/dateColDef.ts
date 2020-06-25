import { ColTypeDef } from './colDef';
import { isDate } from '../../utils';
import { dateComparer } from '../../utils/';
import { STRING_COL_DEF } from './stringColDef';
import { CellValue } from '../rows';

export const dateFormatter = ({ value }: { value: CellValue }) => {
  if (isDate(value)) {
    return value.toLocaleDateString();
  }
  return value;
};

export const dateTimeFormatter = ({ value }: { value: CellValue }) => {
  if (isDate(value)) {
    return value.toLocaleString();
  }
  return value;
};

export const DATE_COL_DEF: ColTypeDef = {
  ...STRING_COL_DEF,
  type: 'date',
  width: 100,
  sortComparator: dateComparer,
  valueFormatter: dateFormatter,
};
export const DATETIME_COL_DEF: ColTypeDef = {
  ...STRING_COL_DEF,
  type: 'dateTime',
  width: 100,
  sortComparator: dateComparer,
  valueFormatter: dateTimeFormatter,
};
