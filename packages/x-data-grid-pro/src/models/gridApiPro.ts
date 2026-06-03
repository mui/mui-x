import {
  type GridApiCommon,
  type GridColumnReorderApi,
  type GridRowMultiSelectionApi,
  type GridRowProApi,
} from '@mui/x-data-grid';
import {
  type GridPrivateOnlyApiCommon,
  type GridInfiniteLoaderPrivateApi,
} from '@mui/x-data-grid/internals';
import { type GridInitialStatePro, type GridStatePro } from './gridStatePro';
import {
  type GridColumnPinningApi,
  type GridDetailPanelApi,
  type GridRowPinningApi,
  type GridDetailPanelPrivateApi,
} from '../hooks';
import { type GridRowReorderPrivateApi } from './gridRowReorderApi';
import {
  type GridDataSourceApiPro,
  type GridDataSourcePrivateApiPro,
} from '../hooks/features/dataSource/models';
import { type DataGridProProcessedProps } from './dataGridProProps';

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
