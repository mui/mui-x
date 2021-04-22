import { ElementSize } from '../elementSize';

/**
 * Object passed as parameter onto the resize event handler.
 */
export interface GridResizeParams {
  /**
   * The container size.
   */
  containerSize: ElementSize;
}
