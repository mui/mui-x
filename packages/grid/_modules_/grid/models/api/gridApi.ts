import { ColumnMenuApi } from './columnMenuApi';
import { ColumnResizeApi } from './columnResizeApi';
import { ComponentsApi } from './componentsApi';
import { FilterApi } from './filterApi';
import { PreferencesPanelApi } from './preferencesPanelApi';
import { RowApi } from './rowApi';
import { ColumnApi } from './columnApi';
import { ColumnReorderApi } from './columnReorderApi';
import { SelectionApi } from './selectionApi';
import { SortApi } from './sortApi';
import { PaginationApi } from './paginationApi';
import { StateApi } from './stateApi';
import { VirtualizationApi } from './virtualizationApi';
import { CoreApi } from './coreApi';
import { EventsApi } from './eventsApi';
import { DensityApi } from './densityApi';
import { LocaleTextApi } from './localeTextApi';

/**
 * The full grid API.
 */
export type GridApi = CoreApi &
  ComponentsApi &
  StateApi &
  DensityApi &
  EventsApi &
  RowApi &
  ColumnApi &
  ColumnReorderApi &
  SelectionApi &
  SortApi &
  VirtualizationApi &
  PaginationApi &
  FilterApi &
  ColumnMenuApi &
  ColumnResizeApi &
  PreferencesPanelApi &
  LocaleTextApi;
