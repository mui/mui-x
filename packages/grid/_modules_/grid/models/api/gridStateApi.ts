import * as React from 'react';
import { GridState } from '../gridState';

export interface GridStateApi {
  /**
   * Property that contains the whole state of the grid.
   */
  state: GridState;
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
