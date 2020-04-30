import { ColTypeDef } from './colDef';
import { isDate } from '../../utils';
import { dateComparer } from '../../utils/';
import { STRING_COL_DEF } from './stringColDef';

export const dateFormatter = ({ value }) => {
  if (isDate(value)) {
    return value.toLocaleDateString();
  }
  return value;
};

export const dateTimeFormatter = ({ value }) => {
  if (isDate(value)) {
    return value.toLocaleString();
  }
  return value;
};

export const DATE_COL_DEF: ColTypeDef = {
  ...STRING_COL_DEF,
  type: 'date',
  width: 100,
  comparator: dateComparer,
  valueFormatter: dateFormatter,
};
export const DATETIME_COL_DEF: ColTypeDef = {
  ...STRING_COL_DEF,
  type: 'dateTime',
  width: 100,
  comparator: dateComparer,
  valueFormatter: dateTimeFormatter,
};
