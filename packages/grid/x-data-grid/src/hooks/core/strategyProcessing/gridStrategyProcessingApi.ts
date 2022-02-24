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
   * Register a pre-processor and emit an event to notify the agents to re-apply the pre-processors.
   * @param {GridPreProcessingGroup} group The name of the group to bind this pre-processor to.
   * @param {number} id An unique and static identifier of the pre-processor.
   * @param {GridStrategyProcessor} callback The pre-processor to register.
   * @returns {() => void} A function to unregister the pre-processor.
   * @ignore - do not document.
   */
  unstable_registerStrategyProcessor: <G extends GridStrategyProcessingGroup>(
    group: GridStrategyProcessingGroup,
    id: string,
    callback: GridStrategyProcessor<G>,
  ) => () => void;
  /**
   * Apply on the value the pre-processors registered on the given group.
   * @param {GridPreProcessingGroup} group The name of the processing group.
   * @param {any} value The value to pass to the first pre-processor.
   * @param {any} params Additional params to pass to the pre-processors.
   * @returns {any} The value after passing through all pre-processors.
   * @ignore - do not document.
   */
  unstable_applyStrategyProcessor: <G extends GridStrategyProcessingGroup>(
    group: G,
    strategyName: string,
    params: GridStrategyProcessingLookup[G]['params'],
  ) => GridStrategyProcessingLookup[G]['value'];
}
