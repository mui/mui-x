import type { GridStateColDef } from '../../../models';
import { GridColDef } from '../../../models';

export type GridColumnLookup = { [field: string]: GridStateColDef };

export type GridColumnRawLookup = { [field: string]: GridColDef | GridStateColDef };

export interface GridColumnsState {
  all: string[];
  lookup: GridColumnLookup;
}

export type GridColumnsRawState = Omit<GridColumnsState, 'lookup'> & {
  lookup: GridColumnRawLookup;
};
