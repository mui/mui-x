import { GridColumnApi } from './gridColumnApi';
import { GridColumnMenuApi } from './gridColumnMenuApi';
import { GridCoreApi } from './gridCoreApi';
import { GridClipboardApi } from './gridClipboardApi';
import { GridCsvExportApi } from './gridCsvExportApi';
import { GridDensityApi } from './gridDensityApi';
import { GridEditRowApi } from './gridEditRowApi';
import { GridFilterApi } from './gridFilterApi';
import { GridFocusApi } from './gridFocusApi';
import { GridLocaleTextApi } from './gridLocaleTextApi';
import { GridParamsApi } from './gridParamsApi';
import { GridPreferencesPanelApi } from './gridPreferencesPanelApi';
import { GridPrintExportApi } from './gridPrintExportApi';
import { GridDisableVirtualizationApi } from './gridDisableVirtualizationApi';
import { GridRowApi } from './gridRowApi';
import { GridRowsMetaApi } from './gridRowsMetaApi';
import { GridSelectionApi } from './gridSelectionApi';
import { GridSortApi } from './gridSortApi';
import { GridStateApi } from './gridStateApi';
import { GridLoggerApi } from './gridLoggerApi';
import { GridScrollApi } from './gridScrollApi';
import { GridColumnPinningApi } from './gridColumnPinningApi';
import { GridVirtualScrollerApi } from './gridVirtualScrollerApi';
import type { GridPreProcessingApi } from '../../hooks/core/preProcessing';
import type { GridRowGroupsPreProcessingApi } from '../../hooks/core/rowGroupsPerProcessing';
import type { GridDimensionsApi } from '../../hooks/features/dimensions';
import type { GridRowGroupingApi } from '../../hooks/features/rowGrouping';
import type { GridPaginationApi } from '../../hooks/features/pagination';
import { GridStateCommunity, GridStatePro } from '../gridState';

type GridStateApiUntyped = { [key in keyof GridStateApi<any>]: any };

export interface GridApiCommon
  extends GridCoreApi,
    GridLoggerApi,
    GridPreProcessingApi,
    GridRowGroupsPreProcessingApi,
    GridDensityApi,
    GridDimensionsApi,
    GridRowApi,
    GridRowsMetaApi,
    GridEditRowApi,
    GridParamsApi,
    GridColumnApi,
    GridSelectionApi,
    GridSortApi,
    GridPaginationApi,
    GridCsvExportApi,
    GridFocusApi,
    GridFilterApi,
    GridColumnMenuApi,
    GridPreferencesPanelApi,
    GridPrintExportApi,
    GridDisableVirtualizationApi,
    GridLocaleTextApi,
    GridClipboardApi,
    GridScrollApi,
    GridStateApiUntyped {}

/**
 * The api of `DataGrid`.
 * TODO: Move to `x-data-grid` folder
 */
export interface GridApiCommunity
  extends Omit<GridApiCommon, keyof GridStateApiUntyped>,
    GridStateApi<GridStateCommunity> {}

/**
 * The api of `DataGridPro`.
 * TODO: Move to `x-data-grid-pro` folder
 */
export interface GridApiPro
  extends Omit<GridApiCommon, keyof GridStateApiUntyped>,
    GridStateApi<GridStatePro>,
    GridRowGroupingApi,
    GridVirtualScrollerApi,
    GridColumnPinningApi {}

/**
 * The full grid API.
 * @deprecated Use `GridApiCommunity` or `GridApiPro` instead.
 */
export interface GridApi extends GridApiPro {}
