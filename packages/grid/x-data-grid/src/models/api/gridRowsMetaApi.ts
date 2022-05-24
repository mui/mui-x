import { GridRowId } from '../gridRows';

/**
 * The Row Meta API interface that is available in the grid `apiRef`.
 */
export interface GridRowsMetaApi {
  /**
   * Gets base row height without considering additional height a row may take.
   * @param {GridRowId} id The id of the row.
   * @returns {number} The target row height.
   * @ignore - do not document.
   */
  unstable_getRowHeight: (id: GridRowId) => number;
  /**
   * Gets all sizes that compose the total height that the given row takes.
   * @param {GridRowId} id The id of the row.
   * @returns {Record<string, number>} The object containing the sizes.
   * @ignore - do not document.
   */
  unstable_getRowInternalSizes: (id: GridRowId) => Record<string, number> | undefined;
  /**
   * Updates the base height of a row.
   * @param {GridRowId} id The id of the row.
   * @param {number} height The new height.
   * @ignore - do not document.
   */
  unstable_setRowHeight: (id: GridRowId, height: number) => void;
}
