import type { GridDataSourceApi } from '../../hooks/features/dataSource/models';
import type { GridInitialStateCommunity, GridStateCommunity } from '../gridStateCommunity';
import type { DataGridProcessedProps } from '../props/DataGridProps';
import type { GridApiCommon, GridPrivateOnlyApiCommon } from './gridApiCommon';
import type { GridColumnReorderApi } from './gridColumnApi';
import type { GridRowProApi } from './gridRowApi';
import type { GridRowMultiSelectionApi } from './gridRowSelectionApi';

/**
 * The API of the community version of the Data Grid.
 */
export interface GridApiCommunity
  extends GridApiCommon<GridStateCommunity, GridInitialStateCommunity>,
    // Public APIs that are explicitly redefined in Pro and Premium plans
    GridDataSourceApi {}

export interface GridPrivateApiCommunity
  extends GridApiCommunity,
    GridPrivateOnlyApiCommon<GridApiCommunity, GridPrivateApiCommunity, DataGridProcessedProps>,
    // APIs that are private in Community plan, but public in Pro and Premium plans
    GridRowMultiSelectionApi,
    GridColumnReorderApi,
    GridRowProApi {}
