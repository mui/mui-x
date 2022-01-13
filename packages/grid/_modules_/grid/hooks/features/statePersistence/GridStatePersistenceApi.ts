import { GridInitialState } from '../../../models';

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
  /**
   * Functions to run after the state has been updated but before re-rendering.
   * This is usually used to apply derived states like `applyFilters` or `applySorting`
   */
  callbacks: (() => void)[];
}

export interface GridRestoreStatePreProcessingContext {
  stateToRestore: GridInitialState;
}
