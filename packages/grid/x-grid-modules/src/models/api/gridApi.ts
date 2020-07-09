import { EventEmitter } from 'events';
import { RowApi } from './rowApi';
import { ColumnApi } from './columnApi';
import { SelectionApi } from './selectionApi';
import { SortApi } from './sortApi';
import { PaginationApi } from './paginationApi';
import { VirtualizationApi } from './virtualizationApi';

export interface CoreApi extends EventEmitter {
  isInitialised: boolean;
  registerEvent: (event: string, handler: (param: any) => void) => () => void;
  onUnmount: (handler: (param: any) => void) => void;
  onResize: (handler: (param: any) => void) => void;
  resize: () => void;
}

export type GridApi = RowApi &
  ColumnApi &
  SelectionApi &
  SortApi &
  VirtualizationApi &
  CoreApi &
  PaginationApi;
