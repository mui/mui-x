import type {
  GridRowTreeCreationParams,
  GridRowTreeCreationValue,
  GridRowsState,
} from '../../features/rows/gridRowsInterfaces';
import type {
  GridFilteringMethodParams,
  GridFilteringMethodValue,
  GridFilterState,
  GridVisibleRowsLookupState,
} from '../../features/filter/gridFilterState';
import type {
  GridSortingMethodParams,
  GridSortingMethodValue,
} from '../../features/sorting/gridSortingState';
import type {
  GridGetRowsParams,
  GridGetRowsResponse,
  GridGetRowsOptions,
} from '../../../models/gridDataSource';
import type { GridRowId } from '../../../models/gridRows';

export type GridStrategyProcessorName = keyof GridStrategyProcessingLookup;

export enum GridStrategyGroup {
  DataSource = 'dataSource',
  RowTree = 'rowTree',
}

export type GridStrategyGroupValue = `${GridStrategyGroup}`;

export interface GridStrategyProcessingLookup {
  dataSourceRootRowsUpdate: {
    group: GridStrategyGroup.DataSource;
    params:
      | {
          response: GridGetRowsResponse;
          fetchParams: GridGetRowsParams;
          options: GridGetRowsOptions;
        }
      | {
          error: Error;
          fetchParams: GridGetRowsParams;
          options: GridGetRowsOptions;
        };
    value: void;
  };
  dataSourceNestedRowsUpdate: {
    group: GridStrategyGroup.DataSource;
    params:
      | {
          parentId: GridRowId;
          path: string[];
          response: GridGetRowsResponse;
          fetchParams: GridGetRowsParams;
        }
      | {
          parentId: GridRowId;
          path: string[];
          error: Error;
          fetchParams: GridGetRowsParams;
        };
    value: void;
  };
  rowTreeCreation: {
    group: GridStrategyGroup.RowTree;
    params: GridRowTreeCreationParams;
    value: GridRowTreeCreationValue;
  };
  filtering: {
    group: GridStrategyGroup.RowTree;
    params: GridFilteringMethodParams;
    value: GridFilteringMethodValue;
  };
  sorting: {
    group: GridStrategyGroup.RowTree;
    params: GridSortingMethodParams;
    value: GridSortingMethodValue;
  };
  visibleRowsLookupCreation: {
    group: GridStrategyGroup.RowTree;
    params: {
      tree: GridRowsState['tree'];
      filteredRowsLookup: GridFilterState['filteredRowsLookup'];
    };
    value: GridVisibleRowsLookupState;
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
   */
  registerStrategyProcessor: <P extends GridStrategyProcessorName>(
    strategyName: string,
    processorName: P,
    processor: GridStrategyProcessor<P>,
  ) => () => void;
  /**
   * Set a callback to know if a strategy is available.
   * @param {GridStrategyGroupValue} strategyGroup The group for which we set strategy availability.
   * @param {string} strategyName The name of the strategy.
   * @param {boolean} callback A callback to know if this strategy is available.
   */
  setStrategyAvailability: (
    strategyGroup: GridStrategyGroupValue,
    strategyName: string,
    callback: () => boolean,
  ) => void;
  /**
   * Returns the name of the active strategy of a given strategy group
   * @param {GridStrategyGroupValue} strategyGroup The group from which we want the active strategy.
   * @returns {string} The name of the active strategy.
   */
  getActiveStrategy: (strategyGroup: GridStrategyGroupValue) => string;
  /**
   * Run the processor registered for the active strategy.
   * @param {GridStrategyProcessorName} processorName The name of the processor to run.
   * @param {GridStrategyProcessingLookup[P]['params']} params Additional params to pass to the processor.
   * @returns {GridStrategyProcessingLookup[P]['value']} The value returned by the processor.
   */
  applyStrategyProcessor: <P extends GridStrategyProcessorName>(
    processorName: P,
    params: GridStrategyProcessingLookup[P]['params'],
  ) => GridStrategyProcessingLookup[P]['value'];
}
