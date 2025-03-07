import type { GridColDef } from '@mui/x-data-grid-pro';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';

export type GridPivotingPropsOverrides = {
  rows: DataGridPremiumProcessedProps['rows'];
  columns: DataGridPremiumProcessedProps['columns'];
  rowGroupingModel: NonNullable<DataGridPremiumProcessedProps['rowGroupingModel']>;
  aggregationModel: NonNullable<DataGridPremiumProcessedProps['aggregationModel']>;
  getAggregationPosition: NonNullable<DataGridPremiumProcessedProps['getAggregationPosition']>;
  columnVisibilityModel: NonNullable<DataGridPremiumProcessedProps['columnVisibilityModel']>;
  columnGroupingModel: NonNullable<DataGridPremiumProcessedProps['columnGroupingModel']>;
  groupingColDef: NonNullable<DataGridPremiumProcessedProps['groupingColDef']>;
};

export interface GridPivotingState {
  model: GridPivotModel;
  enabled: boolean;
  panelOpen: boolean;
  propsOverrides: GridPivotingPropsOverrides | undefined;
  initialColumns: GridColDef[] | undefined;
}

export interface GridPivotingInitialState {
  model?: GridPivotModel;
  enabled?: boolean;
  panelOpen?: boolean;
}

export interface GridPivotModel {
  columns: { field: GridColDef['field']; sort?: 'asc' | 'desc'; hidden?: boolean }[];
  rows: {
    field: GridColDef['field'];
    hidden?: boolean;
  }[];
  values: {
    field: GridColDef['field'];
    aggFunc: string;
    hidden?: boolean;
  }[];
}

export interface GridPivotingApi {
  setPivotModel: (model: GridPivotModel | ((prev: GridPivotModel) => GridPivotModel)) => void;
  setPivotEnabled: (mode: boolean | ((prev: boolean) => boolean)) => void;
  setPivotPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}
