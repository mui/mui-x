import { GridRowId } from '../gridRows';

/**
 * The Row Hydration API interface that is available in the grid `apiRef`.
 */
export interface GridRowsHydrationApi {
  /**
   * Gets target row height.
   * @param {GridRowId} id The id of the row.
   * @returns {number} The target row height.
   * @ignore - do not document.
   */
  unstable_getTargetRowHeight: (id: GridRowId) => number;
}
