import { type GridPrivateOnlyApiCommon } from '@mui/x-data-grid/internals';
import {
  type GridApiCommon,
  type GridColumnPinningApi,
  type GridDetailPanelApi,
  type GridDetailPanelPrivateApi,
  type GridRowPinningApi,
  type GridRowMultiSelectionApi,
  type GridColumnReorderApi,
  type GridRowProApi,
} from '@mui/x-data-grid-pro';
import { type GridRowReorderPrivateApi } from '@mui/x-data-grid-pro/internals';
import { type GridInitialStatePremium, type GridStatePremium } from './gridStatePremium';
import {
  type GridRowGroupingApi,
  type GridExcelExportApi,
  type GridAggregationApi,
} from '../hooks';
import { type GridCellSelectionApi } from '../hooks/features/cellSelection/gridCellSelectionInterfaces';
import { type DataGridPremiumProcessedProps } from './dataGridPremiumProps';
import {
  type GridDataSourcePremiumPrivateApi,
  type GridDataSourceApiPremium,
} from '../hooks/features/dataSource/models';
import { type GridAggregationPrivateApi } from '../hooks/features/aggregation/gridAggregationInterfaces';
import {
  type GridPivotingApi,
  type GridPivotingPrivateApi,
} from '../hooks/features/pivoting/gridPivotingInterfaces';
import { type GridAiAssistantApi } from '../hooks/features/aiAssistant/gridAiAssistantInterfaces';
import { type GridSidebarApi } from '../hooks/features/sidebar/gridSidebarInterfaces';
import {
  type GridChartsIntegrationApi,
  type GridChartsIntegrationPrivateApi,
} from '../hooks/features/chartsIntegration/gridChartsIntegrationInterfaces';
import { type GridHistoryApi } from '../hooks/features/history/gridHistoryInterfaces';

/**
 * The api of Data Grid Premium.
 * TODO: Do not redefine manually the pro features
 */
export interface GridApiPremium
  extends
    GridApiCommon<GridStatePremium, GridInitialStatePremium>,
    GridRowProApi,
    GridColumnPinningApi,
    GridDetailPanelApi,
    GridRowGroupingApi,
    GridExcelExportApi,
    GridAggregationApi,
    GridRowPinningApi,
    GridDataSourceApiPremium,
    GridCellSelectionApi,
    GridPivotingApi,
    GridAiAssistantApi,
    GridSidebarApi,
    GridChartsIntegrationApi,
    GridHistoryApi,
    // APIs that are private in Community plan, but public in Pro and Premium plans
    GridRowMultiSelectionApi,
    GridColumnReorderApi {}

export interface GridPrivateApiPremium
  extends
    GridApiPremium,
    GridPrivateOnlyApiCommon<GridApiPremium, GridPrivateApiPremium, DataGridPremiumProcessedProps>,
    GridDataSourcePremiumPrivateApi,
    GridAggregationPrivateApi,
    GridDetailPanelPrivateApi,
    GridRowReorderPrivateApi,
    GridPivotingPrivateApi,
    GridChartsIntegrationPrivateApi {}
