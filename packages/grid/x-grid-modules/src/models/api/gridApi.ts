import { EventEmitter } from 'events';
import { RowApi } from './rowApi';
import { ColumnApi } from './columnApi';
import { SelectionApi } from './selectionApi';
import { SortApi } from './sortApi';
import { PaginationApi } from './paginationApi';
import { VirtualizationApi } from './virtualizationApi';

/**
 * The core API interface that is available in the grid [[apiRef]].
 */
export interface CoreApi extends EventEmitter {
  /**
   * Property that comes true when the grid has its EventEmitter initialised.
   */
  isInitialised: boolean;
  /**
   * Allows to register a handler for an event.
   *
   * @param event
   * @param handler
   */
  registerEvent: (event: string, handler: (param: any) => void) => () => void;
  /**
   * Add a handler that will be triggered when the component unmount.
   *
   * @param handler
   */
  onUnmount: (handler: (param: any) => void) => void;
  /**
   * Add a handler that will be triggered when the component resize.
   *
   * @param handler
   */
  onResize: (handler: (param: any) => void) => void;
  /**
   * Trigger a resize of the component, and recalculation of width and height.
   *
   * @param handler
   */
  resize: () => void;
}

/**
 * The full Grid API.
 */
export type GridApi = RowApi &
  ColumnApi &
  SelectionApi &
  SortApi &
  VirtualizationApi &
  CoreApi &
  PaginationApi;
