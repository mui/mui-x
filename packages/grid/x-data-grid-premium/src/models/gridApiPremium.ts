import { GridPrivateOnlyApiCommon } from '@mui/x-data-grid/internals';
import {
  GridApiCommon,
  GridColumnPinningApi,
  GridDetailPanelApi,
  GridRowPinningApi,
  GridRowMultiSelectionApi,
  GridColumnReorderApi,
} from '@mui/x-data-grid-pro';
import { GridInitialStatePremium, GridStatePremium } from './gridStatePremium';
import type { GridRowGroupingApi, GridExcelExportApi, GridAggregationApi } from '../hooks';

/**
 * The api of `DataGridPremium`.
 * TODO: Do not redefine manually the pro features
 */
export interface GridApiPremium
  extends GridApiCommon<GridStatePremium, GridInitialStatePremium>,
    GridColumnPinningApi,
    GridDetailPanelApi,
    GridRowGroupingApi,
    GridExcelExportApi,
    GridAggregationApi,
    GridRowPinningApi,
    // APIs that are private in Community plan, but public in Pro and Premium plans
    GridRowMultiSelectionApi,
    GridColumnReorderApi {}

export interface GridPrivateApiPremium
  extends GridApiPremium,
    GridPrivateOnlyApiCommon<GridApiPremium, GridPrivateApiPremium> {}
