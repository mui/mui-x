import { ColumnMenuApi } from './columnMenuApi';
import { ColumnResizeApi } from './columnResizeApi';
import { GridNavigationApi } from './gridNavigationApi';
import { GridParamsApi } from './gridParamsApi';
import { GridComponentsApi } from './gridComponentsApi';
import { FilterApi } from './filterApi';
import { GridEditRowApi } from './gridEditRowApi';
import { PreferencesPanelApi } from './preferencesPanelApi';
import { GridRowApi } from './gridRowApi';
import { GridColumnApi } from './gridColumnApi';
import { ColumnReorderApi } from './columnReorderApi';
import { GridSelectionApi } from './gridSelectionApi';
import { GridSortApi } from './gridSortApi';
import { GridPaginationApi } from './gridPaginationApi';
import { GridStateApi } from './gridStateApi';
import { GridVirtualizationApi } from './gridVirtualizationApi';
import { GridCoreApi } from './gridCoreApi';
import { GridEventsApi } from './gridEventsApi';
import { GridDensityApi } from './gridDensityApi';
import { LocaleTextApi } from './gridLocaleTextApi';
import { GridCsvExportApi } from './gridCsvExportApi';

/**
 * The full grid API.
 */
export type GridApi = GridCoreApi &
  GridComponentsApi &
  GridStateApi &
  GridDensityApi &
  GridEventsApi &
  GridRowApi &
  GridEditRowApi &
  GridParamsApi &
  GridColumnApi &
  ColumnReorderApi &
  GridSelectionApi &
  GridSortApi &
  GridVirtualizationApi &
  GridPaginationApi &
  GridCsvExportApi &
  GridNavigationApi &
  FilterApi &
  ColumnMenuApi &
  ColumnResizeApi &
  PreferencesPanelApi &
  LocaleTextApi;
