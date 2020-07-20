import { ElementSize } from './elementSize';

/**
 * The set of container properties calculated on resize of the grid.
 */
export interface ContainerProps {
  /**
   * Our rendering Zone constitute the maximum number of rows that will be rendered at any given time in the grid
   */
  renderingZonePageSize: number;
  /**
   * The number of rows that fit in the viewport
   */
  viewportPageSize: number;
  /**
   * The last page number
   */
  lastPage: number;

  /**
   * Indicates if a vertical scrollbar is visible
   */
  hasScrollY: boolean;
  /**
   * Indicates if an horizontal scrollbar is visible
   */
  hasScrollX: boolean;
  /**
   * The scrollbar size
   */
  scrollBarSize: number;
  /**
   * The total Element size required to render the set of rows including scrollbars
   */
  totalSizes: ElementSize;
  /**
   * The viewport size including scrollbars
   */
  windowSizes: ElementSize;
  /**
   * The size of the container containing all the rendered rows
   */
  renderingZone: ElementSize;
  /**
   * the size of the container holding the set of rows visible to the user
   */
  viewportSize: ElementSize;
  /**
   * The total Element size required to render the full set of rows minus the scrollbars
   */
  dataContainerSizes: ElementSize;
}
