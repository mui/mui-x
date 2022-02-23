import type { GridStateApi } from './gridStateApi';
import type { GridInitialStateCommunity, GridStateCommunity } from '../gridStateCommunity';
import type { GridApiCommon } from './gridApiCommon';
import type { GridStatePersistenceApi } from '../../hooks/features/statePersistence';

type GridStateApiUntyped = {
  [key in keyof (GridStateApi<any> & GridStatePersistenceApi<any>)]: any;
};

/**
 * The api of `DataGrid`.
 * TODO: Move to `x-data-grid` folder
 */
export interface GridApiCommunity
  extends Omit<GridApiCommon, keyof GridStateApiUntyped>,
    GridStateApi<GridStateCommunity>,
    GridStatePersistenceApi<GridInitialStateCommunity> {}
