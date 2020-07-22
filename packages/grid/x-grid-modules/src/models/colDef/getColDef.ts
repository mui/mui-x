import { DATE_COL_DEF, DATETIME_COL_DEF } from './dateColDef';
import { NUMERIC_COL_DEF } from './numericColDef';
import { STRING_COL_DEF } from './stringColDef';
import { ColType } from './colType';
import { ColumnTypesRecord } from './colDef';

export const DEFAULT_COL_TYPE_KEY = '__default__';
export type NATIVE_COL_TYPE_KEYS = 'string' | 'number' | 'date' | 'dateTime';
export const DEFAULT_COLUMN_TYPES: ColumnTypesRecord = {
  string: STRING_COL_DEF,
  number: NUMERIC_COL_DEF,
  date: DATE_COL_DEF,
  dateTime: DATETIME_COL_DEF,
};
DEFAULT_COLUMN_TYPES[DEFAULT_COL_TYPE_KEY] = STRING_COL_DEF;

export const getColDef = (columnTypes: ColumnTypesRecord, type: ColType | undefined) => {
  if (!type) {
    return columnTypes[DEFAULT_COL_TYPE_KEY];
  }
  return columnTypes[type];
};
