import { GridColumnApi } from './gridColumnApi';
import { GridColumnMenuApi } from './gridColumnMenuApi';
import { GridCoreApi, GridCorePrivateApi } from './gridCoreApi';
import { GridCsvExportApi } from './gridCsvExportApi';
import { GridDensityApi } from './gridDensityApi';
import { GridEditingApi, GridEditingPrivateApi } from './gridEditingApi';
import { GridFilterApi } from './gridFilterApi';
import { GridFocusApi, GridFocusPrivateApi } from './gridFocusApi';
import { GridLocaleTextApi } from './gridLocaleTextApi';
import type { GridParamsApi } from './gridParamsApi';
import { GridPreferencesPanelApi } from './gridPreferencesPanelApi';
import { GridPrintExportApi } from './gridPrintExportApi';
import { GridRowApi } from './gridRowApi';
import { GridRowsMetaApi, GridRowsMetaPrivateApi } from './gridRowsMetaApi';
import { GridRowSelectionApi } from './gridRowSelectionApi';
import { GridSortApi } from './gridSortApi';
import { GridStateApi, GridStatePrivateApi } from './gridStateApi';
import { GridLoggerApi } from './gridLoggerApi';
import { GridScrollApi } from './gridScrollApi';
import { GridVirtualizationApi } from './gridVirtualizationApi';
import type {
  GridPipeProcessingApi,
  GridPipeProcessingPrivateApi,
} from '../../hooks/core/pipeProcessing';
import { GridColumnSpanningApi, GridColumnSpanningPrivateApi } from './gridColumnSpanning';
import type { GridStrategyProcessingApi } from '../../hooks/core/strategyProcessing';
import type {
  GridDimensionsApi,
  GridDimensionsPrivateApi,
} from '../../hooks/features/dimensions/gridDimensionsApi';
import type { GridPaginationApi } from '../../hooks/features/pagination';
import type { GridStatePersistenceApi } from '../../hooks/features/statePersistence';
import { GridColumnGroupingApi } from './gridColumnGroupingApi';
import type { GridInitialStateCommunity, GridStateCommunity } from '../gridStateCommunity';
import { GridHeaderFilteringApi, GridHeaderFilteringPrivateApi } from './gridHeaderFilteringApi';

export interface GridApiCommon<
  GridState extends GridStateCommunity = any,
  GridInitialState extends GridInitialStateCommunity = any,
> extends GridCoreApi,
    GridPipeProcessingApi,
    GridDensityApi,
    GridDimensionsApi,
    GridRowApi,
    GridRowsMetaApi,
    GridEditingApi,
    GridParamsApi,
    GridColumnApi,
    GridRowSelectionApi,
    GridSortApi,
    GridPaginationApi,
    GridCsvExportApi,
    GridFocusApi,
    GridFilterApi,
    GridColumnMenuApi,
    GridPreferencesPanelApi,
    GridPrintExportApi,
    GridVirtualizationApi,
    GridLocaleTextApi,
    GridScrollApi,
    GridColumnSpanningApi,
    GridStateApi<GridState>,
    GridStatePersistenceApi<GridInitialState>,
    GridColumnGroupingApi,
    GridHeaderFilteringApi {}

export interface GridPrivateOnlyApiCommon<
  Api extends GridApiCommon,
  PrivateApi extends GridPrivateApiCommon,
> extends GridCorePrivateApi<Api, PrivateApi>,
    GridStatePrivateApi<PrivateApi['state']>,
    GridPipeProcessingPrivateApi,
    GridStrategyProcessingApi,
    GridColumnSpanningPrivateApi,
    GridRowsMetaPrivateApi,
    GridDimensionsPrivateApi,
    GridEditingPrivateApi,
    GridLoggerApi,
    GridFocusPrivateApi,
    GridHeaderFilteringPrivateApi {}

export interface GridPrivateApiCommon
  extends GridApiCommon,
    GridPrivateOnlyApiCommon<GridApiCommon, GridPrivateApiCommon> {}
