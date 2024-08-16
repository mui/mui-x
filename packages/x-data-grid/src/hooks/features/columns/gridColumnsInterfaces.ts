import { GridColDef, GridStateColDef } from '../../../models/colDef/gridColDef';
import type { GridColumnDimensionProperties } from './gridColumnsUtils';

export enum GridPinnedColumnPosition {
  LEFT = 'left',
  RIGHT = 'right',
}

export type GridColumnLookup = {
  [field: string]: GridStateColDef;
};

export type GridColumnRawLookup = {
  [field: string]: GridColDef | GridStateColDef;
};

export interface GridColumnsState {
  orderedFields: string[];
  lookup: GridColumnLookup;
  columnVisibilityModel: GridColumnVisibilityModel;
}

export interface GridPinnedColumnFields {
  left?: string[];
  right?: string[];
}

export const EMPTY_PINNED_COLUMN_FIELDS = {
  left: [] as string[],
  right: [] as string[],
};

export interface GridPinnedColumns {
  left: GridStateColDef[];
  right: GridStateColDef[];
}

export type GridColumnPinningState = GridPinnedColumnFields;

export type GridColumnDimensions = { [key in GridColumnDimensionProperties]?: number };

export interface GridColumnsInitialState {
  columnVisibilityModel?: GridColumnVisibilityModel;
  orderedFields?: string[];
  dimensions?: Record<string, GridColumnDimensions>;
}

export type GridColumnsRawState = Omit<GridColumnsState, 'lookup'> & {
  lookup: GridColumnRawLookup;
};

export type GridHydrateColumnsValue = GridColumnsRawState;

export type GridColumnVisibilityModel = Record<GridColDef['field'], boolean>;
