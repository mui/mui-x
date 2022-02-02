import { GridColTypeDef } from './gridColDef';
import { GridColType } from './gridColType';
import { GridApiCommon } from '../api';
import { GridApiCommunity } from '../api/gridApiCommunity';

export type GridColumnTypesRecord<Api extends GridApiCommon = GridApiCommunity> = Record<
  GridColType,
  GridColTypeDef<Api>
>;
