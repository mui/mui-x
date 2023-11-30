import { DEFAULT_GRID_COL_TYPE_KEY } from '../../colDef/gridDefaultColumnTypes';
import { GridColTypeDef } from './gridColDef';
import { GridColType } from './gridColType';

export type GridColumnTypesRecord = Record<
  GridColType | typeof DEFAULT_GRID_COL_TYPE_KEY,
  GridColTypeDef
>;
