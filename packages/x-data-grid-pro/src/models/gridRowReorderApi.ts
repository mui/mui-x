/**
 * The row reorder private API interface.
 */
export interface GridRowReorderPrivateApi {
  /**
   * Sets the row drag active state.
   * @param {boolean} isActive Whether a row drag operation is currently active.
   */
  setRowDragActive: (isActive: boolean) => void;
}
