import type { GridRowId } from '../../../models/gridRows';

export interface GridVisibleRowsState {
  /**
   * Visibility status for each row.
   * A row is visible if it is passing the filters AND if its parents are expanded.
   * If a row is not registered in this lookup, it is visible.
   */
  lookup: Record<GridRowId, boolean>;
}

export type GridVisibleRowsMethodValue = GridVisibleRowsState;
