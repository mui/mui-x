import type { GridColumnApi } from './gridColumnApi';
import type { GridColumnMenuApi } from './gridColumnMenuApi';
import type { GridCoreApi, GridCorePrivateApi } from './gridCoreApi';
import type { GridCsvExportApi } from './gridCsvExportApi';
import type { GridDensityApi } from './gridDensityApi';
import type { GridEditingApi, GridEditingPrivateApi } from './gridEditingApi';
import type { GridFilterApi } from './gridFilterApi';
import type { GridFocusApi, GridFocusPrivateApi } from './gridFocusApi';
import type { GridLocaleTextApi } from './gridLocaleTextApi';
import type { GridParamsApi, GridParamsPrivateApi } from './gridParamsApi';
import type { GridPreferencesPanelApi } from './gridPreferencesPanelApi';
import type { GridPrintExportApi } from './gridPrintExportApi';
import type { GridRowApi, GridRowProPrivateApi } from './gridRowApi';
import type { GridRowsMetaApi, GridRowsMetaPrivateApi } from './gridRowsMetaApi';
import type { GridRowSelectionApi } from './gridRowSelectionApi';
import type { GridSortApi } from './gridSortApi';
import type { GridStateApi, GridStatePrivateApi } from './gridStateApi';
import type { GridLoggerApi } from './gridLoggerApi';
import type { GridScrollApi } from './gridScrollApi';
import type { GridVirtualizationApi, GridVirtualizationPrivateApi } from './gridVirtualizationApi';
import type {
  GridPipeProcessingApi,
  GridPipeProcessingPrivateApi,
} from '../../hooks/core/pipeProcessing';
import type { GridColumnSpanningApi, GridColumnSpanningPrivateApi } from './gridColumnSpanning';
import type { GridStrategyProcessingApi } from '../../hooks/core/strategyProcessing';
import type {
  GridDimensionsApi,
  GridDimensionsPrivateApi,
} from '../../hooks/features/dimensions/gridDimensionsApi';
import type { GridPaginationApi } from '../../hooks/features/pagination';
import type { GridStatePersistenceApi } from '../../hooks/features/statePersistence';
import type { GridColumnGroupingApi } from './gridColumnGroupingApi';
import type { GridInitialStateCommunity, GridStateCommunity } from '../gridStateCommunity';
import type {
  GridHeaderFilteringApi,
  GridHeaderFilteringPrivateApi,
} from './gridHeaderFilteringApi';
import type { DataGridProcessedProps } from '../props/DataGridProps';
import type { GridColumnResizeApi } from '../../hooks/features/columnResize';

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
    GridHeaderFilteringApi,
    GridColumnResizeApi {}

export interface GridPrivateOnlyApiCommon<
  Api extends GridApiCommon,
  PrivateApi extends GridPrivateApiCommon,
  Props extends DataGridProcessedProps,
> extends GridCorePrivateApi<Api, PrivateApi, Props>,
    GridStatePrivateApi<PrivateApi['state']>,
    GridPipeProcessingPrivateApi,
    GridStrategyProcessingApi,
    GridColumnSpanningPrivateApi,
    GridRowsMetaPrivateApi,
    GridDimensionsPrivateApi,
    GridEditingPrivateApi,
    GridLoggerApi,
    GridFocusPrivateApi,
    GridHeaderFilteringPrivateApi,
    GridVirtualizationPrivateApi,
    GridRowProPrivateApi,
    GridParamsPrivateApi {}

export interface GridPrivateApiCommon
  extends GridApiCommon,
    GridPrivateOnlyApiCommon<GridApiCommon, GridPrivateApiCommon, DataGridProcessedProps> {}
