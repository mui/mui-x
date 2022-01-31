import type { GridRowId, GridStateColDef, GridColDef, GridApiCommon } from '../../../models';

export type GridColumnLookup<GridApi extends GridApiCommon = GridApiCommon> = {
  [field: string]: GridStateColDef<GridApi>;
};

export type GridColumnRawLookup<GridApi extends GridApiCommon = GridApiCommon> = {
  [field: string]: GridColDef<GridApi> | GridStateColDef<GridApi>;
};

export interface GridColumnsState<GridApi extends GridApiCommon = GridApiCommon> {
  all: string[];
  lookup: GridColumnLookup<GridApi>;
  columnVisibilityModel: GridColumnVisibilityModel;
}

export interface GridColumnsInitialState {
  columnVisibilityModel?: GridColumnVisibilityModel;
}

export type GridColumnsRawState<GridApi extends GridApiCommon = GridApiCommon> = Omit<
  GridColumnsState<GridApi>,
  'lookup'
> & {
  lookup: GridColumnRawLookup<GridApi>;
};

export type GridColumnVisibilityModel = Record<GridRowId, boolean>;
