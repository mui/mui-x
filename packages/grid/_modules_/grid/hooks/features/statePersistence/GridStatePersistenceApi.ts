import { GridInitialState, GridState } from '../../../models';

export interface GridStatePersistenceApi {
  /**
   * Generates a serializable object containing the exportable parts of the DataGrid state.
   * These values can then be passed to the `initialState` prop or injected using the `restoreState` method.
   * @returns {GridInitialState} The exported state.
   */
  exportState: () => GridInitialState;
  /**
   * Inject the given values into the state of the DataGrid.
   * @param {GridInitialState} stateToRestore The exported state to restore.
   */
  restoreState: (stateToRestore: GridInitialState) => void;
}

export interface GridRestoreStatePreProcessingValue {
  state: GridState;
  callbacks: (() => void)[];
}

export interface GridRestoreStatePreProcessingContext {
  stateToRestore: GridInitialState;
}
