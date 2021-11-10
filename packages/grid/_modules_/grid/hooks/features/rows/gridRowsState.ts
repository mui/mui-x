import { GridRowGroupingResult } from '../../core/rowGroupsPerProcessing';

export interface GridRowsState extends GridRowGroupingResult {
  /**
   * Amount of rows before applying the filtering.
   * It also count the expanded and collapsed children rows.
   */
  totalRowCount: number;

  /**
   * Amount of rows before applying the filtering.
   * It does not count the expanded children rows.
   */
  totalTopLevelRowCount: number;
}
