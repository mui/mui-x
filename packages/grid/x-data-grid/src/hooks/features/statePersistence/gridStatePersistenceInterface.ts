import { GridInitialStateCommunity } from '../../../models/gridStateCommunity';

export interface GridStatePersistenceApi<InitialState extends GridInitialStateCommunity> {
  /**
   * Generates a serializable object containing the exportable parts of the DataGrid state.
   * These values can then be passed to the `initialState` prop or injected using the `restoreState` method.
   * @param {GridExportStateParams} params With all properties from [[GridExportStateParams]]
   * @returns {GridInitialState} The exported state.
   */
  exportState: (params?: GridExportStateParams) => InitialState;
  /**
   * Inject the given values into the state of the DataGrid.
   * @param {GridInitialState} stateToRestore The exported state to restore.
   */
  restoreState: (stateToRestore: InitialState) => void;
}

export interface GridRestoreStatePreProcessingValue {
  /**
   * Functions to run after the state has been updated but before re-rendering.
   * This is usually used to apply derived states like `applyFilters` or `applySorting`
   */
  callbacks: (() => void)[];
}

export interface GridExportStateParams {
  /**
   * By default, the grid only exports the models that are either controlled, initialized or modified.
   * For instance, if you don't control or initialize the `filterModel` and you did not apply any filter, the model won't be exported.
   * You can pass this property to `true` to force the systematic export of all the models.
   * @default false
   */
  shouldExportUnusedModels?: boolean;
}

export interface GridRestoreStatePreProcessingContext<I extends GridInitialStateCommunity> {
  stateToRestore: I;
}
