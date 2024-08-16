import { GridPinnedColumnPosition } from '@mui/x-data-grid';
import { GridPinnedColumnFields } from '@mui/x-data-grid/internals';

/**
 * The column pinning API interface that is available in the grid [[apiRef]].
 */
export interface GridColumnPinningApi {
  /**
   * Pins a column to the left or right side of the grid.
   * @param {string} field The column field to pin.
   * @param {GridPinnedColumnPosition} side Which side to pin the column.
   */
  pinColumn: (field: string, side: GridPinnedColumnPosition) => void;
  /**
   * Unpins a column.
   * @param {string} field The column field to unpin.
   */
  unpinColumn: (field: string) => void;
  /**
   * Returns which columns are pinned.
   * @returns {GridPinnedColumnFields} An object containing the pinned columns.
   */
  getPinnedColumns: () => GridPinnedColumnFields;
  /**
   * Changes the pinned columns.
   * @param {GridPinnedColumnFields} pinnedColumns An object containing the columns to pin.
   */
  setPinnedColumns: (pinnedColumns: GridPinnedColumnFields) => void;
  /**
   * Returns which side a column is pinned to.
   * @param {string} field The column field to check.
   * @returns {string | false} Which side the column is pinned or `false` if not pinned.
   */
  isColumnPinned: (field: string) => GridPinnedColumnPosition | false;
}

export interface GridColumnPinningInternalCache {
  /**
   * Stores the fields in their original position, before being pinned.
   */
  orderedFieldsBeforePinningColumns: string[] | null;
}
