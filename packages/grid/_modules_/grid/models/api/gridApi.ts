import { ColumnMenuApi } from './columnMenuApi';
import { ColumnResizeApi } from './columnResizeApi';
import { ComponentsApi } from './gridComponentsApi';
import { FilterApi } from './filterApi';
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
  ComponentsApi &
  GridStateApi &
  GridDensityApi &
  GridEventsApi &
  GridRowApi &
  GridColumnApi &
  ColumnReorderApi &
  GridSelectionApi &
  GridSortApi &
  GridVirtualizationApi &
  GridPaginationApi &
  GridCsvExportApi &
  FilterApi &
  ColumnMenuApi &
  ColumnResizeApi &
  PreferencesPanelApi &
  LocaleTextApi;
