import type { GridRowGroupingResult, GridRowGroupParams } from '../../core/rowGroupsPerProcessing';
import { GridRowsProp } from '../../../models/gridRows';

export type GridRowInternalCacheValue = Omit<GridRowGroupParams, 'previousTree'>;

export interface GridRowsInternalCacheState {
  value: GridRowInternalCacheValue;
  /**
   * The rows as they were the last time all the rows have been updated at once
   * It is used to avoid processing several time the same set of rows
   */
  rowsBeforePartialUpdates: GridRowsProp;
}

export interface GridRowsInternalCache {
  state: GridRowsInternalCacheState;
  timeout: NodeJS.Timeout | null;
  lastUpdateMs: number;
}

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
