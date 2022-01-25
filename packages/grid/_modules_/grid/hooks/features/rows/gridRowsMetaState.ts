/**
 * The grid rows total height and row possitions.
 */
export interface GridRowsMetaState {
  /**
   * The sum of of all visible grid rows in the current rows.
   */
  currentPageTotalHeight: number;
  /**
   * The grid rows possitions.
   */
  positions: number[];
}
