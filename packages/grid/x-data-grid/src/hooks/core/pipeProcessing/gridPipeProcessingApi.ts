import * as React from 'react';
import { GridCellIndexCoordinates, GridScrollParams } from '../../../models';
import { GridInitialStateCommunity } from '../../../models/gridStateCommunity';
import { GridColDef } from '../../../models/colDef/gridColDef';
import {
  GridRestoreStatePreProcessingContext,
  GridRestoreStatePreProcessingValue,
} from '../../features/statePersistence/gridStatePersistenceInterface';
import { GridHydrateColumnsValue } from '../../features/columns/gridColumnsInterfaces';
import { GridRowEntry } from '../../../models/gridRows';
import { GridPreferencePanelsValue } from '../../features/preferencesPanel';

export type GridPipeProcessorGroup = keyof GridPipeProcessingLookup;

export interface GridPipeProcessingLookup {
  hydrateColumns: {
    value: GridHydrateColumnsValue;
  };
  scrollToIndexes: {
    value: Partial<GridScrollParams>;
    context: Partial<GridCellIndexCoordinates>;
  };
  columnMenu: { value: React.ReactNode[]; context: GridColDef };
  exportState: { value: GridInitialStateCommunity };
  restoreState: {
    value: GridRestoreStatePreProcessingValue;
    context: GridRestoreStatePreProcessingContext<GridInitialStateCommunity>;
  };
  rowHeight: { value: Record<string, number>; context: GridRowEntry };
  preferencePanel: { value: React.ReactNode; context: GridPreferencePanelsValue };
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
   * Register a pre-processor and emit an event to notify the agents to re-apply the pre-processors.
   * @param {GridPipeProcessorGroup} group The group on which this processor should be applied.
   * @param {number} id An unique and static identifier of the processor.
   * @param {GridPipeProcessor} processor The processor to register.
   * @returns {() => void} A function to unregister the processor.
   * @ignore - do not document.
   */
  unstable_registerPipeProcessor: <G extends GridPipeProcessorGroup>(
    processorName: GridPipeProcessorGroup,
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
}
