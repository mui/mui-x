import { ControlStateItem } from '../../hooks/features/core/useControlState';
import { GridColumnMenuApi } from './gridColumnMenuApi';
import { GridFocusApi } from './gridFocusApi';
import { GridParamsApi } from './gridParamsApi';
import { GridComponentsApi } from './gridComponentsApi';
import { GridFilterApi } from './gridFilterApi';
import { GridEditRowApi } from './gridEditRowApi';
import { GridPreferencesPanelApi } from './gridPreferencesPanelApi';
import { GridRowApi } from './gridRowApi';
import { GridColumnApi } from './gridColumnApi';
import { GridSelectionApi } from './gridSelectionApi';
import { GridSortApi } from './gridSortApi';
import { GridPaginationApi } from './gridPaginationApi';
import { GridStateApi } from './gridStateApi';
import { GridVirtualizationApi } from './gridVirtualizationApi';
import { GridCoreApi } from './gridCoreApi';
import { GridEventsApi } from './gridEventsApi';
import { GridDensityApi } from './gridDensityApi';
import { GridLocaleTextApi } from './gridLocaleTextApi';
import { GridCsvExportApi } from './gridCsvExportApi';

export interface GridControlStateApi {
  registerControlState: (controlState: ControlStateItem)=> void;
}

/**
 * The full grid API.
 */
export interface GridApi
  extends GridCoreApi,
    GridComponentsApi,
    GridStateApi,
    GridDensityApi,
    GridEventsApi,
    GridRowApi,
    GridEditRowApi,
    GridParamsApi,
    GridColumnApi,
    GridSelectionApi,
    GridSortApi,
    GridVirtualizationApi,
    GridPaginationApi,
    GridCsvExportApi,
    GridFocusApi,
    GridFilterApi,
    GridColumnMenuApi,
    GridPreferencesPanelApi,
    GridLocaleTextApi,
    GridControlStateApi {}
