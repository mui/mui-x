import { DATE_COL_DEF, DATETIME_COL_DEF } from './dateColDef';
import { NUMERIC_COL_DEF } from './numericColDef';
import { STRING_COL_DEF } from './stringColDef';
import { ColType } from './colType';

export const getColDef = (type: ColType | undefined) => {
  switch (type) {
    case 'string':
      return STRING_COL_DEF;
    case 'number':
      return NUMERIC_COL_DEF;
    case 'date':
      return DATE_COL_DEF;
    case 'dateTime':
      return DATETIME_COL_DEF;
    default:
      return STRING_COL_DEF;
  }
};
