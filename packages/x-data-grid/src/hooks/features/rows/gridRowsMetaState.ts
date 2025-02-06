/**
 * The grid rows total height and row positions.
 */
export interface GridRowsMetaState {
  /**
   * The sum of all visible grid rows in the current rows.
   */
  currentPageTotalHeight: number;
  /**
   * The grid rows positions.
   */
  positions: number[];
  /**
   * The total height of the pinned top rows.
   */
  pinnedTopRowsTotalHeight: number;
  /**
   * The total height of the pinned bottom rows.
   */
  pinnedBottomRowsTotalHeight: number;
}
