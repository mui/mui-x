/**
 * The row reorder API interface.
 */
export interface GridRowReorderApi {
  /**
   * Sets the row drag active state.
   * @param {boolean} isActive Whether a row drag operation is currently active.
   */
  setRowDragActive: (isActive: boolean) => void;
}