import { GridRowId } from './gridRows';

export type GridRowSelectionPropagation = 'none' | 'parents' | 'children' | 'both';

export type GridInputRowSelectionModel = readonly GridRowId[] | GridRowId;

export type GridRowSelectionModel = readonly GridRowId[];
