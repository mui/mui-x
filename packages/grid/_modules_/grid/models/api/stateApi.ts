import * as React from 'react';
import { GridState } from '../../hooks/features/core/gridState';

export interface StateApi {
  /**
   * Property that contains the whole state of the grid.
   */
  state: GridState;
  /**
   * allows to get the whole state of the grid if stateId is null or to get a part of the state if stateId has a value.
   */
  getState: <T>(stateId?: string) => T;
  /**
   * Allows forcing the grid to rerender after a state update.
   */
  forceUpdate: React.Dispatch<any>;
}
