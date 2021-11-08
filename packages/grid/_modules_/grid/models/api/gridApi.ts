import { GridColumnApi } from './gridColumnApi';
import { GridColumnMenuApi } from './gridColumnMenuApi';
import { GridControlStateApi } from './gridControlStateApi';
import { GridCoreApi } from './gridCoreApi';
import { GridClipboardApi } from './gridClipboardApi';
import { GridCsvExportApi } from './gridCsvExportApi';
import { GridDensityApi } from './gridDensityApi';
import { GridEditRowApi } from './gridEditRowApi';
import { GridEventsApi } from './gridEventsApi';
import { GridFilterApi } from './gridFilterApi';
import { GridFocusApi } from './gridFocusApi';
import { GridLocaleTextApi } from './gridLocaleTextApi';
import { GridPageApi } from './gridPageApi';
import { GridPageSizeApi } from './gridPageSizeApi';
import { GridParamsApi } from './gridParamsApi';
import { GridPreferencesPanelApi } from './gridPreferencesPanelApi';
import { GridPrintExportApi } from './gridPrintExportApi';
import { GridDisableVirtualizationApi } from './gridDisableVirtualizationApi';
import { GridRowApi } from './gridRowApi';
import { GridSelectionApi } from './gridSelectionApi';
import { GridSortApi } from './gridSortApi';
import { GridStateApi } from './gridStateApi';
import { GridLoggerApi } from './gridLoggerApi';
import { GridScrollApi } from './gridScrollApi';
import type { GridPreProcessingApi } from '../../hooks/core/preProcessing';
import type { GridRowGroupsPreProcessingApi } from '../../hooks/core/rowGroupsPerProcessing';

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
    GridEventsApi,
    GridRowApi,
    GridEditRowApi,
    GridParamsApi,
    GridColumnApi,
    GridSelectionApi,
    GridSortApi,
    GridPageApi,
    GridPageSizeApi,
    GridCsvExportApi,
    GridFocusApi,
    GridFilterApi,
    GridColumnMenuApi,
    GridPreferencesPanelApi,
    GridPrintExportApi,
    GridDisableVirtualizationApi,
    GridLocaleTextApi,
    GridControlStateApi,
    GridClipboardApi,
    GridScrollApi {}
