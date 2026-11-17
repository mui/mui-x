/**
 * The keyboard reorder state.
 */
export interface GridKeyboardReorderState {
  /**
   * Whether the row and the column a press would move are marked.
   * On while the keyboard is used, off after a pointer down in the grid.
   */
  showTarget: boolean;
}
