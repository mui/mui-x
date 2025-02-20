import { GridRowId } from './gridRows';

export type GridRowSelectionPropagation = {
  descendants?: boolean;
  parents?: boolean;
};

export type GridRowSelectionModel = { type: 'include' | 'exclude'; ids: Set<GridRowId> };
