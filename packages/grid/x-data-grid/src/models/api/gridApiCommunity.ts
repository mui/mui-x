import type { GridStateApi, GridStatePrivateApi } from './gridStateApi';
import type { GridInitialStateCommunity, GridStateCommunity } from '../gridStateCommunity';
import type {
  GridApiCommon,
  GridPrivateApiCommon,
  GridApiCommonUntyped,
  GridPrivateApiCommonUntyped,
} from './gridApiCommon';
import type { GridCorePrivateApi } from './gridCoreApi';
import type { GridStatePersistenceApi } from '../../hooks/features/statePersistence';

/**
 * The api of `DataGrid`.
 */
export interface GridApiCommunity
  extends Omit<GridApiCommon, keyof GridApiCommonUntyped>,
    GridStateApi<GridStateCommunity>,
    GridStatePersistenceApi<GridInitialStateCommunity> {}

export interface GridPrivateApiCommunity
  extends Omit<GridPrivateApiCommon, keyof GridPrivateApiCommonUntyped>,
    GridStatePrivateApi<GridStateCommunity>,
    GridCorePrivateApi<GridApiCommunity, GridPrivateApiCommunity> {}

export interface GridInternalApiCommunity extends GridApiCommunity, GridPrivateApiCommunity {}
