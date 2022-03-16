import type { GridRowId } from '../../../models';
import { GridColDef, GridStateColDef } from '../../../models/colDef/gridColDef';
import type { GridColumnDimensionProperties } from './gridColumnsUtils';

export type GridColumnLookup = {
  [field: string]: GridStateColDef;
};

export type GridColumnRawLookup = {
  [field: string]: GridColDef | GridStateColDef;
};

export interface GridColumnsState {
  /**
   * TODO v6: Rename `all` to `orderedFields`
   */
  all: string[];
  lookup: GridColumnLookup;
  /**
   * The column lookup without any pre-processing.
   * It is used when we need to remove a wrapped around a user column.
   */
  lookupBeforePreProcessing: GridColumnRawLookup;
  columnVisibilityModel: GridColumnVisibilityModel;
}

export type GridColumnDimensions = Pick<GridStateColDef, GridColumnDimensionProperties>;

export interface GridColumnsInitialState {
  columnVisibilityModel?: GridColumnVisibilityModel;
  orderedFields?: string[];
  dimensions?: Record<string, GridColumnDimensions>;
}

export type GridColumnsRawState = Omit<GridColumnsState, 'lookup'> & {
  lookup: GridColumnRawLookup;
};

export type GridHydrateColumnsValue = Omit<GridColumnsRawState, 'columnVisibilityModel'>;

export type GridColumnVisibilityModel = Record<GridRowId, boolean>;
