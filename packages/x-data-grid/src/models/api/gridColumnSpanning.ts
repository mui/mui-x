import type { GridStateColDef } from '../colDef/gridColDef';
import type { GridColumnIndex, GridCellColSpanInfo } from '../gridColumnSpanning';
import type { GridRowId } from '../gridRows';

/**
 * The Column Spanning API interface that is available in the grid `apiRef`.
 */
export interface GridColumnSpanningApi {
  /**
   * Returns cell colSpan info.
   * @param {GridRowId} rowId The row id
   * @param {number} columnIndex The column index (0-based)
   * @returns {GridCellColSpanInfo|undefined} Cell colSpan info
   * @ignore - do not document.
   */
  unstable_getCellColSpanInfo: (
    rowId: GridRowId,
    columnIndex: GridColumnIndex,
  ) => GridCellColSpanInfo | undefined;
}

export interface GridColumnSpanningPrivateApi {
  /** Reset the colspan cache */
  resetColSpan: () => void;
  /**
   * Calculate column spanning for each cell in the row
   * @param {GridRowId} rowId The row id
   * @param {number} minFirstColumn First visible column index
   * @param {number} maxLastColumn Last visible column index
   * @param {GridStateColDef[]} columns List of columns to calculate colSpan for
   */
  calculateColSpan: (
    rowId: GridRowId,
    minFirstColumn: number,
    maxLastColumn: number,
    columns: GridStateColDef[],
  ) => void;
}
