import type { GridInitialStateCommunity, GridStateCommunity } from '../gridStateCommunity';
import type { GridApiCommon, GridPrivateOnlyApiCommon } from './gridApiCommon';
import { GridMultiSelectionApi } from './gridRowSelectionApi';

/**
 * The api of `DataGrid`.
 */
export interface GridApiCommunity
  extends GridApiCommon<GridStateCommunity, GridInitialStateCommunity> {}

export interface GridPrivateApiCommunity
  extends GridApiCommunity,
    GridPrivateOnlyApiCommon<GridApiCommunity, GridPrivateApiCommunity>,
    // it's private in Community plan, but public in Pro and Premium plans
    GridMultiSelectionApi {}
