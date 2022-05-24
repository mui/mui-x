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

export type GridStrategyProcessorName = keyof GridStrategyProcessingLookup;

export type GridStrategyGroup =
  GridStrategyProcessingLookup[keyof GridStrategyProcessingLookup]['group'];

export interface GridStrategyProcessingLookup {
  rowTreeCreation: {
    group: 'rowTree';
    params: GridRowTreeCreationParams;
    value: GridRowTreeCreationValue;
  };
  filtering: {
    group: 'rowTree';
    params: GridFilteringMethodParams;
    value: GridFilteringMethodValue;
  };
  sorting: {
    group: 'rowTree';
    params: GridSortingMethodParams;
    value: GridSortingMethodValue;
  };
}

export type GridStrategyProcessor<P extends GridStrategyProcessorName> = (
  params: GridStrategyProcessingLookup[P]['params'],
) => GridStrategyProcessingLookup[P]['value'];

export interface GridStrategyProcessingApi {
  /**
   * Registers a strategy processor.
   * If the strategy is active, it emits an event to notify the agents to re-apply the processor.
   * @template P
   * @param {string} strategyName The name of the strategy on which this processor should be applied.
   * @param {GridStrategyProcessorName} processorName The name of the processor.
   * @param {GridStrategyProcessor<P>} processor The processor to register.
   * @returns {() => void} A function to unregister the processor.
   * @ignore - do not document.
   */
  unstable_registerStrategyProcessor: <P extends GridStrategyProcessorName>(
    strategyName: string,
    processorName: P,
    callback: GridStrategyProcessor<P>,
  ) => () => void;
  /**
   * Set a callback to know if a strategy is available.
   * @param {string} strategyName The name of the strategy.
   * @param {boolean} callback A callback to know if this strategy is available.
   * @ignore - do not document.
   */
  unstable_setStrategyAvailability: (
    strategyGroup: GridStrategyGroup,
    strategyName: string,
    callback: () => boolean,
  ) => void;
  /**
   * Returns the name of the active strategy of a given strategy group
   * @param {GridStrategyGroup} strategyGroup The group from which we want the active strategy.
   * @returns {string} The name of the active strategy.
   * @ignore - do not document.
   */
  unstable_getActiveStrategy: (strategyGroup: GridStrategyGroup) => string;
  /**
   * Run the processor registered for the active strategy.
   * @param {GridStrategyProcessorName} processorName The name of the processor to run.
   * @param {GridStrategyProcessingLookup[P]['params']} params Additional params to pass to the processor.
   * @returns {GridStrategyProcessingLookup[P]['value']} The value returned by the processor.
   * @ignore - do not document.
   */
  unstable_applyStrategyProcessor: <P extends GridStrategyProcessorName>(
    processorName: P,
    params: GridStrategyProcessingLookup[P]['params'],
  ) => GridStrategyProcessingLookup[P]['value'];
}
