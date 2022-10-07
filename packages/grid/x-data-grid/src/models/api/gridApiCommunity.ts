import type { GridInitialStateCommunity, GridStateCommunity } from '../gridStateCommunity';
import type { GridApiCommon, GridPrivateOnlyApiCommon } from './gridApiCommon';
import { GridSelectionPrivateApi } from './gridSelectionApi';

/**
 * The api of `DataGrid`.
 */
export interface GridApiCommunity
  extends GridApiCommon<GridStateCommunity, GridInitialStateCommunity> {}

export interface GridPrivateOnlyApiCommunity
  extends GridPrivateOnlyApiCommon<GridApiCommunity, GridPrivateApiCommunity>,
    // it's private in Community plan, but public in Pro and Premium plans
    GridSelectionPrivateApi {}

export interface GridPrivateApiCommunity extends GridApiCommunity, GridPrivateOnlyApiCommunity {}
