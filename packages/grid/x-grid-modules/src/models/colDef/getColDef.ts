import { ColType } from './colType';
import { DEFAULT_COL_TYPE_KEY } from './defaultColumnTypes';

export const getColDef = (columnTypes: any, type: ColType | undefined) => {
  if (!type) {
    return columnTypes[DEFAULT_COL_TYPE_KEY];
  }
  return columnTypes[type];
};
