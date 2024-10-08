import { GridRowId } from './gridRows';

export type GridRowSelectionPropagation = {
  descendants?: boolean;
  parents?: boolean;
};

export type GridInputRowSelectionModel = readonly GridRowId[] | GridRowId;

export type GridRowSelectionModel = readonly GridRowId[];
