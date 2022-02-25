import {
  GridRowTreeCreationParams,
  GridRowTreeCreationValue,
} from '../../features/rows/gridRowsState';
import {
  GridFilteringMethodParams,
  GridFilteringMethodValue,
} from '../../features/filter/gridFilterState';
import {
  GridSortingMethodParams,
  GridSortingMethodValue,
} from '../../features/sorting/gridSortingState';

export type GridStrategyProcessingGroup = keyof GridStrategyProcessingLookup;

export interface GridStrategyProcessingLookup {
  rowTreeCreation: {
    params: GridRowTreeCreationParams;
    value: GridRowTreeCreationValue;
  };
  filtering: {
    params: GridFilteringMethodParams;
    value: GridFilteringMethodValue;
  };
  sorting: {
    params: GridSortingMethodParams;
    value: GridSortingMethodValue;
  };
}

export type GridStrategyProcessor<G extends GridStrategyProcessingGroup> = (
  params: GridStrategyProcessingLookup[G]['params'],
) => GridStrategyProcessingLookup[G]['value'];

export interface GridStrategyProcessingApi {
  /**
   * Register a strategy processor and emit an event if the strategy is active, to notify the agents to re-apply the processor.
   * @param {strategyName} string The name of the strategy on which this processor should be applied.
   * @param {GridStrategyProcessingGroup} group The name of the group to bind this strategy processor to.
   * @param {GridStrategyProcessor} processor The processor to register.
   * @returns {() => void} A function to unregister the processor.
   * @ignore - do not document.
   */
  unstable_registerStrategyProcessor: <G extends GridStrategyProcessingGroup>(
    strategyName: string,
    group: G,
    callback: GridStrategyProcessor<G>,
  ) => () => void;
  /**
   * Set a callback to know a strategy is available.
   * @param {string} strategyName The name of the strategy.
   * @param {boolean} callback A callback to know if this strategy is available.
   * @ignore - do not document.
   */
  unstable_setStrategyAvailability: (strategyName: string, callback: () => boolean) => void;
  /**
   * Returns the name of the active strategy.
   * @returns {string} The name of the active strategy.
   * @ignore - do not document.
   */
  unstable_getActiveStrategy: () => string;
  /**
   * Run the processor registered for the active strategy of the given group.
   * @param {GridStrategyProcessingGroup} group The name of the processing group.
   * @param {any} params Additional params to pass to the processor.
   * @returns {any} The value returned by the processor of the strategy.
   * @ignore - do not document.
   */
  unstable_applyStrategyProcessor: <G extends GridStrategyProcessingGroup>(
    group: G,
    params: GridStrategyProcessingLookup[G]['params'],
  ) => GridStrategyProcessingLookup[G]['value'];
}
