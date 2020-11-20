import * as React from 'react';
import { EventEmitter } from '../../utils/EventEmitter';

/**
 * The core API interface that is available in the grid [[apiRef]].
 */
export interface CoreApi extends EventEmitter {
  /**
   * Property that comes true when the grid has its EventEmitter initialised.
   */
  isInitialised: boolean;
  /**
   * The react ref of the grid root container div element.
   */
  rootElementRef?: React.RefObject<HTMLDivElement>;
  /**
   * The react ref of the grid column container div element.
   */
  columnHeadersElementRef?: React.RefObject<HTMLDivElement>;
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
  /**
   * Store the request animation timer, that coordinates all requestAnimationFrame().
   */
  rafTimer: number;
}
