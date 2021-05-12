import { ElementSize } from './elementSize';

export interface GridScrollBarState {
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
export type GridViewportSizeState = ElementSize;

/**
 * The set of container properties calculated on resize of the grid.
 */
export interface GridContainerProps {
  /**
   * If `true`, the grid is virtualizing the rendering of rows.
   */
  isVirtualized: boolean;
  /**
   * The number of rows that fit in the rendering zone.
   */
  renderingZonePageSize: number;
  /**
   * The number of rows that fit in the viewport.
   */
  viewportPageSize: number;
  /**
   * The total number of rows that are scrollable in the viewport. If pagination then it would be page size. If not, it would be the full set of rows.
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
   * The size of the available scroll height in the rendering zone container.
   */
  renderingZoneScrollHeight: number;
  /**
   * The total element size required to render the full set of rows and columns, minus the scrollbars.
   */
  dataContainerSizes: ElementSize;
}
