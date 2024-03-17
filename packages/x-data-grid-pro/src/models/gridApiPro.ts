import {
  GridApiCommon,
  GridColumnReorderApi,
  GridRowMultiSelectionApi,
  GridRowProApi,
} from '@mui/x-data-grid';
import { GridPrivateOnlyApiCommon } from '@mui/x-data-grid/internals';
import type { GridInfiniteLoaderPrivateApi } from '@mui/x-data-grid/models/api/gridInfiniteLoaderApi';
import { GridInitialStatePro, GridStatePro } from './gridStatePro';
import type {
  GridColumnPinningApi,
  GridDetailPanelApi,
  GridRowPinningApi,
  GridDetailPanelPrivateApi,
} from '../hooks';
import type { DataGridProProcessedProps } from './dataGridProProps';

/**
 * The api of `DataGridPro`.
 */
export interface GridApiPro
  extends GridApiCommon<GridStatePro, GridInitialStatePro>,
    GridRowProApi,
    GridColumnPinningApi,
    GridDetailPanelApi,
    GridRowPinningApi,
    // APIs that are private in Community plan, but public in Pro and Premium plans
    GridRowMultiSelectionApi,
    GridColumnReorderApi {}

export interface GridPrivateApiPro
  extends GridApiPro,
    GridPrivateOnlyApiCommon<GridApiPro, GridPrivateApiPro, DataGridProProcessedProps>,
    GridDetailPanelPrivateApi,
    GridInfiniteLoaderPrivateApi {}
