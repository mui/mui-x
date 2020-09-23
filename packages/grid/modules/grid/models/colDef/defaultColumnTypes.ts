import { ColumnTypesRecord } from './colTypeDef';
import { STRING_COL_DEF } from './stringColDef';
import { NUMERIC_COL_DEF } from './numericColDef';
import { DATE_COL_DEF, DATETIME_COL_DEF } from './dateColDef';

export const DEFAULT_COL_TYPE_KEY = '__default__';
export const DEFAULT_COLUMN_TYPES: ColumnTypesRecord = {
  string: STRING_COL_DEF,
  number: NUMERIC_COL_DEF,
  date: DATE_COL_DEF,
  dateTime: DATETIME_COL_DEF,
};
DEFAULT_COLUMN_TYPES[DEFAULT_COL_TYPE_KEY] = STRING_COL_DEF;
