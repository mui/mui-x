import type { GridRowId, GridStateColDef, GridColDef } from '../../../models';

export type GridColumnLookup = { [field: string]: GridStateColDef };

export type GridColumnRawLookup = { [field: string]: GridColDef | GridStateColDef };

export interface GridColumnsState {
  all: string[];
  lookup: GridColumnLookup;
  visibleColumnsModel: GridVisibleColumnsModel;
}

export interface GridColumnsInitialState {
  visibleColumnsModel?: GridVisibleColumnsModel;
}

export type GridColumnsRawState = Omit<GridColumnsState, 'lookup'> & {
  lookup: GridColumnRawLookup;
};

export type GridVisibleColumnsModel = GridRowId[];
