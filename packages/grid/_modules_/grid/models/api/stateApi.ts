import * as React from 'react';
import { GridState } from '../../hooks/features/core/gridState';
import { StateChangeParams } from '../params/stateChangeParams';

export interface StateApi {
  /**
   * Property that contains the whole state of the grid.
   */
  state: GridState;
  /**
   * Allows to get the whole state of the grid if stateId is null or to get a part of the state if stateId has a value.
   */
  getState: <T>(stateId?: string) => T;
  /**
   * Allows to set/reset the whole state of the grid.
   */
  setState: (state: GridState | ((previousState: GridState) => GridState)) => void;
  /**
   * Allows forcing the grid to rerender after a state update.
   */
  forceUpdate: React.Dispatch<any>;
  /**
   * Allows assigning a handler that is triggered when the state change.
   */
  onStateChange: (handler: (param: StateChangeParams) => void) => void;
}
