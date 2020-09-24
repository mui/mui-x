import { EventEmitter } from 'events';

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
   * @param event
   * @param handler
   * @returns Unsubscribe Function
   */
  subscribeEvent: (event: string, handler: (param: any) => void) => () => void;
  /**
   * Allows to emit an event.
   * @param name
   * @param args
   */
  publishEvent: (name: string, ...args: any[]) => void;
  /**
   * Display the error overlay component.
   */
  showError: (props: any) => void;
}
