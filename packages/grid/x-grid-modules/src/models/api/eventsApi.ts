import * as React from 'react';

/**
 * The events API interface that is available in the grid [[apiRef]].
 */
export interface EventsApi {
  /**
   * The react ref of the grid root container div element.
   */
  rootElementRef?: React.RefObject<HTMLDivElement>;
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
