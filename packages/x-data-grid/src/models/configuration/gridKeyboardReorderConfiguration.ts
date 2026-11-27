import type { GridRowId } from '../gridRows';

/**
 * The description of the keys that move a row or a column, for the cell that holds the tab stop.
 */
export interface GridKeyboardReorderCellDescription {
  /**
   * The field of the cell that gets the description.
   */
  field: string;
  /**
   * The ids of the description nodes, separated by spaces.
   */
  describedBy: string;
}

export interface GridKeyboardReorderInternalHooks {
  /**
   * Returns whether a keyboard reorder press would move the row, to mark it.
   * Called once per rendered row, so the implementation may use hooks.
   * @param {GridRowId} rowId The row id.
   * @returns {boolean} `true` when the row is marked.
   */
  useIsRowKeyboardReorderTarget: (rowId: GridRowId) => boolean;
  /**
   * Returns whether a keyboard reorder press would move the column, to mark its header.
   * Called once per rendered column header, so the implementation may use hooks.
   * @param {string} field The column field.
   * @returns {boolean} `true` when the header is marked.
   */
  useIsColumnKeyboardReorderTarget: (field: string) => boolean;
  /**
   * Returns the description of the reorder keys for a cell of the row, for screen readers.
   * Called once per rendered row, so the implementation may use hooks.
   * @param {GridRowId} rowId The row id.
   * @returns {GridKeyboardReorderCellDescription | null} The cell and its description, or `null` when no cell of the row gets one.
   */
  useKeyboardReorderCellDescription: (
    rowId: GridRowId,
  ) => GridKeyboardReorderCellDescription | null;
  /**
   * Returns the `aria-describedby` of a column header, to describe the reorder keys to screen readers.
   * Called once per rendered column header, so the implementation may use hooks.
   * @param {string} field The column field.
   * @returns {string | undefined} The id of the description node, or `undefined` when the header has none.
   */
  useKeyboardReorderColumnHeaderDescribedBy: (field: string) => string | undefined;
}
