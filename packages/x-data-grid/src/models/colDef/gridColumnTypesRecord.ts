import type { GridColTypeDef } from './gridColDef';
import type { GridColType } from './gridColType';

export interface GridColumnTypesRecord
  extends Omit<Record<GridColType, GridColTypeDef>, 'multiSelect'> {}
