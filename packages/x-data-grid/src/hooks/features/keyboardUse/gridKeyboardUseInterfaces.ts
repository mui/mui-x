/**
 * Whether the user is using the keyboard in the grid.
 */
export interface GridKeyboardUseState {
  /**
   * On after a key press in the grid, off after a pointer down in the grid.
   * Features use it to show keyboard-only hints, like `:focus-visible` does for the focus ring.
   */
  active: boolean;
}
