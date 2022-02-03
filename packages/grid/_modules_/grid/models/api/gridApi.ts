import { GridColumnApi } from './gridColumnApi';
import { GridColumnMenuApi } from './gridColumnMenuApi';
import { GridCoreApi } from './gridCoreApi';
import { GridClipboardApi } from './gridClipboardApi';
import { GridCsvExportApi } from './gridCsvExportApi';
import { GridDensityApi } from './gridDensityApi';
import { GridEditingApi } from './gridEditingApi';
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
import type { GridStatePersistenceApi } from '../../hooks/features/statePersistence';

/**
 * The full grid API.
 */
export interface GridApi
  extends GridCoreApi,
    GridStateApi,
    GridLoggerApi,
    GridPreProcessingApi,
    GridRowGroupsPreProcessingApi,
    GridDensityApi,
    GridDimensionsApi,
    GridRowApi,
    GridRowsMetaApi,
    GridEditingApi,
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
    GridRowGroupingApi,
    GridVirtualScrollerApi,
    GridColumnPinningApi,
    GridStatePersistenceApi {}
