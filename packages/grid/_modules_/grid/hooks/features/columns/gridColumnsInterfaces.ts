import type { GridRowId, GridApiCommon } from '../../../models';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridColDef, GridStateColDef } from '../../../models/colDef/gridColDef';
import type { GridColumnDimensionProperties } from './gridColumnsUtils';

export type GridColumnLookup<Api extends GridApiCommon = GridApiCommunity> = {
  [field: string]: GridStateColDef<Api>;
};

export type GridColumnRawLookup<Api extends GridApiCommon = GridApiCommunity> = {
  [field: string]: GridColDef<Api> | GridStateColDef<Api>;
};

export interface GridColumnsState<Api extends GridApiCommon = GridApiCommunity> {
  /**
   * TODO v6: Rename `orderedFields`
   */
  all: string[];
  lookup: GridColumnLookup<Api>;
  columnVisibilityModel: GridColumnVisibilityModel;
}

export type GridColumnDimensions = Pick<GridStateColDef, GridColumnDimensionProperties>;

export interface GridColumnsInitialState {
  columnVisibilityModel?: GridColumnVisibilityModel;
  orderedFields?: string[];
  dimensions?: Record<string, GridColumnDimensions>;
}

export type GridColumnsRawState<Api extends GridApiCommon = GridApiCommunity> = Omit<
  GridColumnsState<Api>,
  'lookup'
> & {
  lookup: GridColumnRawLookup<Api>;
};

export type GridColumnVisibilityModel = Record<GridRowId, boolean>;
