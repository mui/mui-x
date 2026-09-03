import type {
  GridApiCommon,
  GridCallbackDetails,
  GridColumnReorderApi,
  GridControlledStateReasonLookup,
  GridRowMultiSelectionApi,
  GridRowProApi,
} from '@mui/x-data-grid';
import type {
  GridPrivateOnlyApiCommon,
  GridInfiniteLoaderPrivateApi,
} from '@mui/x-data-grid/internals';
import type { GridInitialStatePro, GridStatePro } from './gridStatePro';
import type {
  GridColumnPinningApi,
  GridDetailPanelApi,
  GridRowPinningApi,
  GridDetailPanelPrivateApi,
} from '../hooks';
import type { GridRowReorderPrivateApi } from './gridRowReorderApi';
import type {
  GridDataSourceApiPro,
  GridDataSourcePrivateApiPro,
} from '../hooks/features/dataSource/models';
import type { DataGridProProcessedProps } from './dataGridProProps';

/**
 * The api of Data Grid Pro.
 */
export interface GridApiPro
  extends
    GridApiCommon<GridStatePro, GridInitialStatePro>,
    GridRowProApi,
    GridColumnPinningApi,
    GridDetailPanelApi,
    GridRowPinningApi,
    GridDataSourceApiPro,
    // APIs that are private in Community plan, but public in Pro and Premium plans
    GridRowMultiSelectionApi,
    GridColumnReorderApi {}

export interface GridPrivateApiPro
  extends
    GridApiPro,
    GridPrivateOnlyApiCommon<GridApiPro, GridPrivateApiPro, DataGridProProcessedProps>,
    GridDetailPanelPrivateApi,
    GridInfiniteLoaderPrivateApi,
    GridRowReorderPrivateApi,
    GridDataSourcePrivateApiPro {}

/**
 * The details passed to the callbacks of Data Grid Pro, with `apiRef` typed to `GridApiPro`.
 */
export type GridCallbackDetailsPro<K extends keyof GridControlledStateReasonLookup = any> =
  GridCallbackDetails<K, GridApiPro>;
