import type { GridInitialStateCommunity, GridStateCommunity } from '../gridStateCommunity';
import type { GridApiCommon } from './gridApiCommon';

/**
 * The api of `DataGrid`.
 */
export interface GridApiCommunity
  extends GridApiCommon<GridStateCommunity, GridInitialStateCommunity> {}
