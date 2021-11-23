export interface GridPinnedColumns {
  left?: string[];
  right?: string[];
}

export enum GridPinnedPosition {
  left = 'left',
  right = 'right',
}

/**
 * The column pinning API interface that is available in the grid [[apiRef]].
 */
export interface GridColumnPinningApi {
  /**
   * Pins a column to the left or right side of the grid.
   * @param {string} field The column field to pin.
   * @param {GridPinnedPosition} side Which side to pin the column.
   */
  pinColumn: (field: string, side: GridPinnedPosition) => void;
  /**
   * Unpins a column.
   * @param {string} field The column field to unpin.
   */
  unpinColumn: (field: string) => void;
  /**
   * Returns which columns are pinned.
   * @returns {GridPinnedColumns} An object containing the pinned columns.
   */
  getPinnedColumns: () => GridPinnedColumns;
  /**
   * Changes the pinned columns.
   * @param {GridPinnedColumns} pinnedColumns An object containing the columns to pin.
   */
  setPinnedColumns: (pinnedColumns: GridPinnedColumns) => void;
  /**
   * Returns which side a column is pinned to.
   * @param {string} field The column field to check.
   * @returns {string | false} Which side the column is pinned or `false` if not pinned.
   */
  isColumnPinned: (field: string) => GridPinnedPosition | false;
}
