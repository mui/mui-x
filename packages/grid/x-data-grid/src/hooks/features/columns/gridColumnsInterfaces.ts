import type { GridRowId } from '../../../models';
import { GridColDef, GridStateColDef } from '../../../models/colDef/gridColDef';

export type GridColumnLookup = {
  [field: string]: GridStateColDef;
};

export type GridColumnRawLookup = {
  [field: string]: GridColDef | GridStateColDef;
};

export interface GridColumnsState {
  /**
   * TODO v6: Rename `orderedFields`.
   */
  all: string[];
  lookup: GridColumnLookup;
  columnVisibilityModel: GridColumnVisibilityModel;
}

export interface GridColumnsInitialState {
  columnVisibilityModel?: GridColumnVisibilityModel;
}

export type GridColumnsRawState = Omit<GridColumnsState, 'lookup'> & {
  lookup: GridColumnRawLookup;
};

export type GridColumnVisibilityModel = Record<GridRowId, boolean>;
