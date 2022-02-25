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
   * Register a strategy processor and emit an event to notify the agents to re-apply the pre-processors.
   * @param {GridStrategyProcessingGroup} group The name of the group to bind this strategy processor to.
   * @param {strategyName} string The name of the strategy processor to register.
   * @param {GridStrategyProcessor} processor The processor to register.
   * @returns {() => void} A function to unregister the processor.
   * @ignore - do not document.
   */
  unstable_registerStrategyProcessor: <G extends GridStrategyProcessingGroup>(
    group: G,
    strategyName: string,
    callback: GridStrategyProcessor<G>,
  ) => () => void;
  /**
   * Set the availability of a strategy.
   * @param {string} strategyName The name of the strategy to update.
   * @param {boolean} isAvailable The availability status of the strategy.
   * @ignore - do not document.
   */
  unstable_setStrategyAvailability: (strategyName: string, isAvailable: boolean) => void;
  /**
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
