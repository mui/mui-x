import { RowApi } from './rowApi';
import { ColumnApi } from './columnApi';
import { SelectionApi } from './selectionApi';
import { SortApi } from './sortApi';
import { PaginationApi } from './paginationApi';
import { VirtualizationApi } from './virtualizationApi';
import { CoreApi } from './coreApi';
import { EventsApi } from './eventsApi';

/**
 * The full Grid API.
 */
export type GridApi = CoreApi &
  EventsApi &
  RowApi &
  ColumnApi &
  SelectionApi &
  SortApi &
  VirtualizationApi &
  PaginationApi;
