import type { GridRowId, GridStateColDef, GridColDef } from '../../../models';
import type { ColumnsDimensionProperties } from './gridColumnsUtils';

export type GridColumnLookup = { [field: string]: GridStateColDef };

export type GridColumnRawLookup = { [field: string]: GridColDef | GridStateColDef };

export interface GridColumnsState {
  /**
   * TODO v6: Rename `orderedFields`
   */
  all: string[];
  lookup: GridColumnLookup;
  columnVisibilityModel: GridColumnVisibilityModel;
}

export type GridColumnDimensions = Pick<GridStateColDef, ColumnsDimensionProperties>;

export interface GridColumnsInitialState {
  columnVisibilityModel?: GridColumnVisibilityModel;
  orderedFields?: string[];
  dimensions?: Record<string, GridColumnDimensions>;
}

export type GridColumnsRawState = Omit<GridColumnsState, 'lookup'> & {
  lookup: GridColumnRawLookup;
};

export type GridColumnVisibilityModel = Record<GridRowId, boolean>;
