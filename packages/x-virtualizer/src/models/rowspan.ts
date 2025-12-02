import { RowId, RowRange } from './core';

type ColumnIndex = number;

export interface RowSpanningCaches {
  spannedCells: Record<RowId, Record<ColumnIndex, number>>;
  hiddenCells: Record<RowId, Record<ColumnIndex, boolean>>;
  /**
   * For each hidden cell, it contains the row index corresponding to the cell that is
   * the origin of the hidden cell. i.e. the cell which is spanned.
   * Used by the virtualization to properly keep the spanned cells in view.
   */
  hiddenCellOriginMap: Record<number, Record<ColumnIndex, number>>;
}

export interface RowSpanningState {
  caches: RowSpanningCaches;
  processedRange: RowRange;
}
