import { GridColType } from './gridColType';
import { DEFAULT_GRID_COL_TYPE_KEY } from './gridDefaultColumnTypes';

export const getGridColDef = (columnTypes: any, type: GridColType | undefined) => {
  if (!type) {
    return columnTypes[DEFAULT_GRID_COL_TYPE_KEY];
  }
  return columnTypes[type];
};
