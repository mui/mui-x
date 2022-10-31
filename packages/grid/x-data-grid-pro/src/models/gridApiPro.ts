import { GridApiCommon, GridRowMultiSelectionApi } from '@mui/x-data-grid';
import { GridPrivateOnlyApiCommon } from '@mui/x-data-grid/internals';
import { GridInitialStatePro, GridStatePro } from './gridStatePro';
import type {
  GridColumnPinningApi,
  GridDetailPanelApi,
  GridRowPinningApi,
  GridDetailPanelPrivateApi,
} from '../hooks';

/**
 * The api of `DataGridPro`.
 */
export interface GridApiPro
  extends GridApiCommon<GridStatePro, GridInitialStatePro>,
    GridColumnPinningApi,
    GridDetailPanelApi,
    GridRowPinningApi,
    // it's private in Community plan, but public in Pro and Premium plans
    GridRowMultiSelectionApi {}
export interface GridPrivateApiPro
  extends GridApiPro,
    GridPrivateOnlyApiCommon<GridApiPro, GridPrivateApiPro>,
    GridDetailPanelPrivateApi {}
