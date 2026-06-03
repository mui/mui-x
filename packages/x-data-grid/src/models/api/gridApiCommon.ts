import { type Virtualizer } from '@mui/x-virtualizer';
import { type GridColumnApi } from './gridColumnApi';
import { type GridColumnMenuApi } from './gridColumnMenuApi';
import { type GridCoreApi, type GridCorePrivateApi } from './gridCoreApi';
import { type GridCsvExportApi } from './gridCsvExportApi';
import { type GridDensityApi } from './gridDensityApi';
import { type GridEditingApi, type GridEditingPrivateApi } from './gridEditingApi';
import { type GridFilterApi } from './gridFilterApi';
import { type GridFocusApi, type GridFocusPrivateApi } from './gridFocusApi';
import { type GridLocaleTextApi } from './gridLocaleTextApi';
import { type GridParamsApi, type GridParamsPrivateApi } from './gridParamsApi';
import { type GridPreferencesPanelApi } from './gridPreferencesPanelApi';
import { type GridPrintExportApi } from './gridPrintExportApi';
import { type GridRowApi, type GridRowProPrivateApi } from './gridRowApi';
import { type GridRowsMetaApi, type GridRowsMetaPrivateApi } from './gridRowsMetaApi';
import { type GridRowSelectionApi } from './gridRowSelectionApi';
import { type GridSortApi } from './gridSortApi';
import { type GridStateApi, type GridStatePrivateApi } from './gridStateApi';
import { type GridLoggerApi } from './gridLoggerApi';
import { type GridScrollApi } from './gridScrollApi';
import {
  type GridVirtualizationApi,
  type GridVirtualizationPrivateApi,
} from './gridVirtualizationApi';
import {
  type GridPipeProcessingApi,
  type GridPipeProcessingPrivateApi,
} from '../../hooks/core/pipeProcessing';
import {
  type GridColumnSpanningApi,
  type GridColumnSpanningPrivateApi,
} from './gridColumnSpanning';
import { type GridStrategyProcessingApi } from '../../hooks/core/strategyProcessing';
import {
  type GridDimensionsApi,
  type GridDimensionsPrivateApi,
} from '../../hooks/features/dimensions/gridDimensionsApi';
import { type GridPaginationApi } from '../../hooks/features/pagination';
import { type GridStatePersistenceApi } from '../../hooks/features/statePersistence';
import { type GridColumnGroupingApi } from './gridColumnGroupingApi';
import { type GridInitialStateCommunity, type GridStateCommunity } from '../gridStateCommunity';
import {
  type GridHeaderFilteringApi,
  type GridHeaderFilteringPrivateApi,
} from './gridHeaderFilteringApi';
import { type DataGridProcessedProps } from '../props/DataGridProps';
import { type GridColumnResizeApi } from '../../hooks/features/columnResize';
import { type GridPivotingPrivateApiCommunity } from '../../hooks/features/pivoting/gridPivotingInterfaces';

export interface GridApiCommon<
  GridState extends GridStateCommunity = GridStateCommunity,
  GridInitialState extends GridInitialStateCommunity = GridInitialStateCommunity,
>
  extends
    GridCoreApi,
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
>
  extends
    GridCorePrivateApi<Api, PrivateApi, Props>,
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
    GridParamsPrivateApi,
    GridPivotingPrivateApiCommunity {
  virtualizer: Virtualizer;
}

export interface GridPrivateApiCommon
  extends
    GridApiCommon,
    GridPrivateOnlyApiCommon<GridApiCommon, GridPrivateApiCommon, DataGridProcessedProps> {}
