import * as React from 'react';
import {
  GridEventEmitter,
  GridSubscribeEventOptions,
} from '../../utils/eventEmitter/GridEventEmitter';
import { ControlStateItem } from '../controlStateItem';

/**
 * The core API interface that is available in the grid `apiRef`.
 */
export interface GridCoreApi extends GridEventEmitter {
  controlStateRef: React.RefObject<Record<string, ControlStateItem<any, any>>>;
  /**
   * The react ref of the grid root container div element.
   * @ignore - do not document.
   */
  rootElementRef?: React.RefObject<HTMLDivElement>;
  /**
   * The react ref of the grid column container virtualized div element.
   * @ignore - do not document.
   */
  columnHeadersContainerElementRef?: React.RefObject<HTMLDivElement>;
  /**
   * The react ref of the grid column headers container element.
   * @ignore - do not document.
   */
  columnHeadersElementRef?: React.RefObject<HTMLDivElement>;
  /**
   * The react ref of the grid window container element.
   * @ignore - do not document.
   */
  windowRef?: React.RefObject<HTMLDivElement>;
  /**
   * The react ref of the grid data rendering zone.
   * @ignore - do not document.
   */
  renderingZoneRef?: React.RefObject<HTMLDivElement>;
  /**
   * The react ref of the grid header element.
   * @ignore - do not document.
   */
  headerRef?: React.RefObject<HTMLDivElement>;
  /**
   * The react ref of the grid footer element.
   * @ignore - do not document.
   */
  footerRef?: React.RefObject<HTMLDivElement>;
  /**
   * Registers a handler for an event.
   * @param {string} event The name of the event.
   * @param {function} handler The handler to be called.
   * @param {object} options Additional options for this listener.
   * @returns {function} A function to unsubscribe from this event.
   */
  subscribeEvent: (
    event: string,
    handler: (params: any, event?: React.SyntheticEvent) => void,
    options?: GridSubscribeEventOptions,
  ) => () => void;
  /**
   * Emits an event.
   * @param {string} name The name of the event.
   * @param {...*} args Arguments to be passed to the handlers.
   */
  publishEvent: (name: string, ...args: any[]) => void;
  /**
   * Displays the error overlay component.
   * @param {any} props Props to be passed to the `ErrorOverlay` component.
   */
  showError: (props: any) => void;
}
