import type { GridColTypeDef } from './gridColDef';
import type { GridColType } from './gridColType';

// multiSelect is a Pro feature, so it's optional in Community
export type GridColumnTypesRecord = Omit<Record<GridColType, GridColTypeDef>, 'multiSelect'> &
  Partial<Pick<Record<GridColType, GridColTypeDef>, 'multiSelect'>>;
