import { ColType } from './colType';
import { DEFAULT_GRID_COL_TYPE_KEY } from './defaultGridColumnTypes';

export const getGridColDef = (columnTypes: any, type: ColType | undefined) => {
  if (!type) {
    return columnTypes[DEFAULT_GRID_COL_TYPE_KEY];
  }
  return columnTypes[type];
};
