import type { GridRowId } from '../../../models/gridRows';

/**
 * The row reorder state.
 */
export interface GridRowReorderState {
  /**
   * Whether a row drag operation is currently active.
   */
  isActive: boolean;
  /**
   * The row ID being dragged.
   */
  draggedRowId: GridRowId | null;
  /**
   * The current drop target information.
   */
  dropTarget: {
    /**
     * The row ID where the drop indicator should be shown.
     */
    rowId: GridRowId | null;
    /**
     * The position of the drop indicator relative to the target row.
     */
    position: 'above' | 'below' | 'over' | null;
  };
}
