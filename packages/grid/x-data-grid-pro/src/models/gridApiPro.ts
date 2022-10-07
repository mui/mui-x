import { GridApiCommon } from '@mui/x-data-grid';
import { GridPrivateOnlyApiCommon, GridSelectionPrivateApi } from '@mui/x-data-grid/internals';
import { GridInitialStatePro, GridStatePro } from './gridStatePro';
import type { GridColumnPinningApi, GridDetailPanelApi, GridRowPinningApi } from '../hooks';

/**
 * The api of `DataGridPro`.
 */
export interface GridApiPro
  extends GridApiCommon<GridStatePro, GridInitialStatePro>,
    GridColumnPinningApi,
    GridDetailPanelApi,
    GridRowPinningApi,
    // it's private in Community plan, but public in Pro and Premium plans
    GridSelectionPrivateApi {}

export interface GridPrivateOnlyApiPro
  extends GridPrivateOnlyApiCommon<GridApiPro, GridPrivateApiPro> {}

export interface GridPrivateApiPro extends GridApiPro, GridPrivateOnlyApiPro {}
