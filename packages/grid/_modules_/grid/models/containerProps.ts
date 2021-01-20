import { ElementSize } from './elementSize';

export interface ScrollBarState {
  /**
   * Indicates if a vertical scrollbar is visible.
   */
  hasScrollY: boolean;
  /**
   * Indicates if an horizontal scrollbar is visible.
   */
  hasScrollX: boolean;
  /**
   * The scrollbar size.
   */
  scrollBarSize: { x: number; y: number };
}

/**
 * the size of the container holding the set of rows visible to the user.
 */
export type ViewportSizeState = ElementSize;

/**
 * The set of container properties calculated on resize of the grid.
 */
export interface ContainerProps {
  /**
   * The maximum number of rows that will be rendered at any given time in the grid.
   */
  renderingZonePageSize: number;
  /**
   * The number of rows that fit in the viewport.
   */
  viewportPageSize: number;
  /**
   * The number of rows allocated for the rendered zone.
   */
  virtualRowsCount: number;
  /**
   * The last page number.
   */
  lastPage: number;
  /**
   * The total element size required to render the set of rows, including scrollbars.
   */
  totalSizes: ElementSize;
  /**
   * The viewport size including scrollbars.
   */
  windowSizes: ElementSize;
  /**
   * The size of the container containing all the rendered rows.
   */
  renderingZone: ElementSize;
  /**
   * The total element size required to render the full set of rows and columns, minus the scrollbars.
   */
  dataContainerSizes: ElementSize;
}
