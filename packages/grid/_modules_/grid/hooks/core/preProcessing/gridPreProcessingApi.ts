import { GridCellIndexCoordinates, GridColDef, GridScrollParams } from '../../../models';
import { GridFilteringMethodCollection } from '../../features/filter/gridFilterState';
import { GridSortingMethodCollection } from '../../features/sorting/gridSortingState';
import { GridCanBeReorderedPreProcessingContext } from '../../features/columnReorder/columnReorderInterfaces';
import { GridColumnsRawState } from '../../features/columns/gridColumnsInterfaces';

export type PreProcessorCallback = (value: any, params?: any) => any;

export enum GridPreProcessingGroup {
  hydrateColumns = 'hydrateColumns',
  scrollToIndexes = 'scrollToIndexes',
  columnMenu = 'columnMenu',
  canBeReordered = 'canBeReordered',
  filteringMethod = 'filteringMethod',
  sortingMethod = 'sortingMethod',
}

interface GridPreProcessingGroupLookup {
  [GridPreProcessingGroup.hydrateColumns]: { value: GridColumnsRawState };
  [GridPreProcessingGroup.scrollToIndexes]: {
    value: Partial<GridScrollParams>;
    context: Partial<GridCellIndexCoordinates>;
  };
  [GridPreProcessingGroup.columnMenu]: { value: JSX.Element[]; context: GridColDef };
  [GridPreProcessingGroup.canBeReordered]: {
    value: boolean;
    context: GridCanBeReorderedPreProcessingContext;
  };
  [GridPreProcessingGroup.filteringMethod]: { value: GridFilteringMethodCollection };
  [GridPreProcessingGroup.sortingMethod]: { value: GridSortingMethodCollection };
}

export type GridPreProcessor<P extends GridPreProcessingGroup> = (
  value: GridPreProcessingGroupLookup[P]['value'],
  context: GridPreProcessingGroupLookup[P] extends { context: any }
    ? GridPreProcessingGroupLookup[P]['context']
    : undefined,
) => GridPreProcessingGroupLookup[P]['value'];

type GridPreProcessorsApplierArg<
  P extends GridPreProcessingGroup,
  T extends { value: any },
> = T extends { context: any } ? [P, T['value'], T['context']] : [P, T['value']];

type GridPreProcessorsApplier = <P extends GridPreProcessingGroup>(
  ...params: GridPreProcessorsApplierArg<P, GridPreProcessingGroupLookup[P]>
) => GridPreProcessingGroupLookup[P]['value'];

export interface GridPreProcessingApi {
  /**
   * Register a pre-processor and emit an event to notify the agents to re-apply the pre-processors.
   * @param {GridPreProcessingGroup} group The name of the group to bind this pre-processor to.
   * @param {number} id An unique and static identifier of the pre-processor.
   * @param {PreProcessorCallback} callback The pre-processor to register.
   * @returns {() => void} A function to unregister the pre-processor.
   * @ignore - do not document.
   */
  unstable_registerPreProcessor: (
    group: GridPreProcessingGroup,
    id: string,
    callback: PreProcessorCallback,
  ) => () => void;
  /**
   * Apply on the value the pre-processors registered on the given group.
   * @param {GridPreProcessingGroup} group The name of the processing group.
   * @param {any} value The value to pass to the first pre-processor.
   * @param {any} params Additional params to pass to the pre-processors.
   * @returns {any} The value after passing through all pre-processors.
   * @ignore - do not document.
   */
  unstable_applyPreProcessors: GridPreProcessorsApplier;
}
