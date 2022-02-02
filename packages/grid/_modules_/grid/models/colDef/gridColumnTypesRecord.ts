import { GridColTypeDef } from './gridColDef';
import { GridColType } from './gridColType';
import { GridApiCommon, GridApiCommunity } from '../api';

export type GridColumnTypesRecord<Api extends GridApiCommon = GridApiCommunity> = Record<
  GridColType,
  GridColTypeDef<Api>
>;
