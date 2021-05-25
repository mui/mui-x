import * as React from 'react';
import {
  GridEventEmitter,
  GridSubscribeEventOptions,
} from '../../utils/eventEmitter/GridEventEmitter';

/**
 * The core API interface that is available in the grid [[apiRef]].
 */
export interface GridCoreApi extends GridEventEmitter {
  /**
   * The react ref of the grid root container div element.
   */
  rootElementRef?: React.RefObject<HTMLDivElement>;
  /**
   * The react ref of the grid column container div element.
   */
  columnHeadersContainerElementRef?: React.RefObject<HTMLDivElement>;
  columnHeadersElementRef?: React.RefObject<HTMLDivElement>;
  windowRef?: React.RefObject<HTMLDivElement>;
  renderingZoneRef?: React.RefObject<HTMLDivElement>;
  headerRef?: React.RefObject<HTMLDivElement>;
  footerRef?: React.RefObject<HTMLDivElement>;
  /**
   * Allows to register a handler for an event.
   * @param event
   * @param handler
   * @param options
   * @returns Unsubscribe Function
   */
  subscribeEvent: (
    event: string,
    handler: (params: any, event?: React.SyntheticEvent) => void,
    options?: GridSubscribeEventOptions,
  ) => () => void;
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
