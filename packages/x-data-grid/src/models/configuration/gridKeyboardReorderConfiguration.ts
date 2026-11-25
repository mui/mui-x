import type { GridRowId } from '../gridRows';

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
}
