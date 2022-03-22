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

export type GridPreProcessingGroup = keyof GridPreProcessingGroupLookup;

export interface GridPreProcessingGroupLookup {
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
   * @param {GridPreProcessor} callback The pre-processor to register.
   * @returns {() => void} A function to unregister the pre-processor.
   * @ignore - do not document.
   */
  unstable_registerPreProcessor: <G extends GridPreProcessingGroup>(
    group: GridPreProcessingGroup,
    id: string,
    callback: GridPreProcessor<G>,
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
