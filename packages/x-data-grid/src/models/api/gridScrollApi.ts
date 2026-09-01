import type { GridCellIndexCoordinates } from '../gridCell';
import type { GridScrollParams } from '../params/gridScrollParams';

/**
 * The scroll API interface that is available in the grid [[apiRef]].
 */
export interface GridScrollApi {
  /**
   * Triggers the viewport to scroll to the given positions (in pixels).
   * @param {GridScrollParams} params An object containing the `left` or `top` position to scroll.
   */
  scroll: (params: Partial<GridScrollParams>) => void;
  /**
   * Returns the current scroll position.
   * @returns {GridScrollParams} The scroll positions.
   */
  getScrollPosition: () => GridScrollParams;
  /**
   * Triggers the viewport to scroll to the cell at indexes given by `params`.
   * `rowIndex` is the zero-based index in the full filtered and sorted row list, not the index within the current page.
   * When pagination is enabled, `rowIndex` must point to a row on the current page.
   * `colIndex` is the zero-based index in the visible columns.
   * Invalid indexes return `false` without scrolling.
   * @param {GridCellIndexCoordinates} params The indexes of the cell.
   * @returns {boolean} `true` if the grid had to scroll to reach the target, `false` if no scrolling was needed or an index is invalid.
   */
  scrollToIndexes: (params: Partial<GridCellIndexCoordinates>) => boolean;
}
