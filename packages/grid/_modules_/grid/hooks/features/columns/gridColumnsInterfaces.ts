import type { GridRowId, GridStateColDef, GridColDef } from '../../../models';

export type GridColumnLookup = { [field: string]: GridStateColDef };

export type GridColumnRawLookup = { [field: string]: GridColDef | GridStateColDef };

export interface GridColumnsState {
  all: string[];
  lookup: GridColumnLookup;
  columnVisibilityModel: GridColumnVisibilityModel;
}

export type GridPortableColDef = Pick<
  GridStateColDef,
  'field' | 'maxWidth' | 'minWidth' | 'width' | 'flex'
>;

export interface GridColumnsInitialState {
  columnVisibilityModel?: GridColumnVisibilityModel;
  columns?: GridPortableColDef[];
}

export type GridColumnsRawState = Omit<GridColumnsState, 'lookup'> & {
  lookup: GridColumnRawLookup;
};

export type GridColumnVisibilityModel = Record<GridRowId, boolean>;
