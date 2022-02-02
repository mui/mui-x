import type { GridStateApi } from './gridStateApi';
import type { GridStateCommunity } from '../gridStateCommunity';
import type { GridApiCommon } from './gridApiCommon';

type GridStateApiUntyped = { [key in keyof GridStateApi<any>]: any };

/**
 * The api of `DataGrid`.
 * TODO: Move to `x-data-grid` folder
 */
export interface GridApiCommunity
  extends Omit<GridApiCommon, keyof GridStateApiUntyped>,
    GridStateApi<GridStateCommunity> {}
