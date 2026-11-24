import type { GridRowId } from '@mui/x-data-grid';

/**
 * Moves a row or a column by one position, or as far as allowed, without a drag.
 * The keyboard calls these methods, and other inputs can too, such as a menu item.
 * Each call validates the move like a drop, publishes the order change event, and announces the result.
 */
export interface GridKeyboardReorderPrivateApi {
  /**
   * Moves a row of a flat tree up or down, within the current page.
   * @param {GridRowId} rowId The row to move.
   * @param {'up' | 'down'} direction The direction of the move.
   * @param {object} options The options.
   * @param {boolean} options.toEdge Whether to move as far as allowed instead of one row.
   * @returns {Promise<void>} Resolves once the row moved, or the move was refused.
   */
  stepRowReorder: (
    rowId: GridRowId,
    direction: 'up' | 'down',
    options: { toEdge: boolean },
  ) => Promise<void>;
  /**
   * Moves a column left or right on screen.
   * @param {string} field The column to move.
   * @param {'left' | 'right'} direction The visual direction of the move.
   * @param {object} options The options.
   * @param {boolean} options.toEdge Whether to move as far as allowed instead of one position.
   */
  stepColumnReorder: (
    field: string,
    direction: 'left' | 'right',
    options: { toEdge: boolean },
  ) => void;
}
