import * as React from 'react';
import { GridCellIndexCoordinates, GridScrollParams, GridColDef } from '../../../models';
import { GridInitialStateCommunity } from '../../../models/gridStateCommunity';
import {
  GridRestoreStatePreProcessingContext,
  GridRestoreStatePreProcessingValue,
} from '../../features/statePersistence/gridStatePersistenceInterface';
import { GridHydrateColumnsValue } from '../../features/columns/gridColumnsInterfaces';
import { GridRowEntry } from '../../../models/gridRows';
import { GridPreferencePanelsValue } from '../../features/preferencesPanel';

export type GridPipeProcessorGroup = keyof GridPipeProcessingLookup;

export interface GridPipeProcessingLookup {
  columnMenu: { value: React.ReactNode[]; context: GridColDef };
  exportState: { value: GridInitialStateCommunity };
  hydrateColumns: {
    value: GridHydrateColumnsValue;
  };
  exportMenu: { value: { component: React.ReactElement; componentName: string }[]; context: any };
  preferencePanel: { value: React.ReactNode; context: GridPreferencePanelsValue };
  restoreState: {
    value: GridRestoreStatePreProcessingValue;
    context: GridRestoreStatePreProcessingContext<GridInitialStateCommunity>;
  };
  rowHeight: { value: Record<string, number>; context: GridRowEntry };
  scrollToIndexes: {
    value: Partial<GridScrollParams>;
    context: Partial<GridCellIndexCoordinates>;
  };
}

export type GridPipeProcessor<P extends GridPipeProcessorGroup> = (
  value: GridPipeProcessingLookup[P]['value'],
  context: GridPipeProcessingLookup[P] extends { context: any }
    ? GridPipeProcessingLookup[P]['context']
    : undefined,
) => GridPipeProcessingLookup[P]['value'];

type GridPipeProcessorsApplierArgs<
  P extends GridPipeProcessorGroup,
  T extends { value: any },
> = T extends { context: any } ? [P, T['value'], T['context']] : [P, T['value']];

type GridPipeProcessorsApplier = <P extends GridPipeProcessorGroup>(
  ...params: GridPipeProcessorsApplierArgs<P, GridPipeProcessingLookup[P]>
) => GridPipeProcessingLookup[P]['value'];

export interface GridPipeProcessingApi {
  /**
   * Register a processor and run all the appliers of the group.
   * @param {GridPipeProcessorGroup} group The group on which this processor should be applied.
   * @param {string} id An unique and static identifier of the processor.
   * @param {GridPipeProcessor} processor The processor to register.
   * @returns {() => void} A function to unregister the processor.
   * @ignore - do not document.
   */
  unstable_registerPipeProcessor: <G extends GridPipeProcessorGroup>(
    group: GridPipeProcessorGroup,
    id: string,
    callback: GridPipeProcessor<G>,
  ) => () => void;
  /**
   * Run all the processors registered for the given group.
   * @template T
   * @param {GridPipeProcessorGroup} group The group from which we want to apply the processors.
   * @param {T['value']} value The initial value to pass to the first processor.
   * @param {T['context]} context Context object that will be passed to each processor.
   * @returns {T['value]} The value after passing through all pre-processors.
   * @ignore - do not document.
   */
  unstable_applyPipeProcessors: GridPipeProcessorsApplier;
  /**
   * Register an applier.
   * @param {GridPipeProcessorGroup} group The group of this applier
   * @param {string} id An unique and static identifier of the applier.
   * @param {() => void} applier The applier to register.
   * @returns {() => void} A function to unregister the applier.
   * @ignore - do not document.
   */
  unstable_registerPipeApplier: (
    group: GridPipeProcessorGroup,
    id: string,
    applier: () => void,
  ) => () => void;
  /**
   * Imperatively run all the appliers of a group.
   * Most of the time, the applier should run because a processor is re-registered,
   * but sometimes we want to re-apply the processing even if the processor deps have not changed.
   * This may occur when the change requires a `isDeepEqual` check.
   * @param {GridPipeProcessorGroup} group The group to apply.
   * @ignore - do not document.
   */
  unstable_requestPipeProcessorsApplication: (group: GridPipeProcessorGroup) => void;
}
