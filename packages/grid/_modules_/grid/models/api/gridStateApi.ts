import * as React from 'react';
import { GridState } from '../../hooks/features/core/gridState';

export interface GridStateApi {
  /**
   * Property that contains the whole state of the grid.
   */
  state: GridState;
  /**
   * Returns the state of the grid.
   * @returns {GridState} The state of the grid.
   * @ignore - do not document.
   */
  getState: () => GridState;
  /**
   * Sets the whole state of the grid.
   * @param {function} state The new state or a function to return the new state.
   */
  setState: (state: GridState | ((previousState: GridState) => GridState)) => void;
  /**
   * Forces the grid to rerender. It's often used after a state update.
   */
  forceUpdate: React.Dispatch<any>;
}
