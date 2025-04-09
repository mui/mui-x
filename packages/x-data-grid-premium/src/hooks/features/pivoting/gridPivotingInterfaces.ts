import type { GridColDef } from '@mui/x-data-grid-pro';
import type {
  GridPivotingPrivateApiCommunity,
  GridPivotingStatePartial,
} from '@mui/x-data-grid/internals';
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
  headerFilters: NonNullable<DataGridPremiumProcessedProps['headerFilters']>;
  disableAggregation: NonNullable<DataGridPremiumProcessedProps['disableAggregation']>;
  disableRowGrouping: NonNullable<DataGridPremiumProcessedProps['disableRowGrouping']>;
};

export interface GridPivotingState extends GridPivotingStatePartial {
  model: GridPivotModel;
  propsOverrides: GridPivotingPropsOverrides | undefined;
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

export type DropPosition = 'top' | 'bottom' | null;

export interface GridPivotingApi {
  /**
   * Sets the pivot model to use in the pivot mode.
   * @param {GridPivotModel | ((prev: GridPivotModel) => GridPivotModel)} model - The pivot model to set.
   */
  setPivotModel: (model: GridPivotModel | ((prev: GridPivotModel) => GridPivotModel)) => void;
  /**
   * Sets whether the pivot mode is active.
   * @param {boolean | ((prev: boolean) => boolean)} active - The new value of the pivot mode state.
   */
  setPivotActive: (active: boolean | ((prev: boolean) => boolean)) => void;
  /**
   * Sets whether the pivot panel is open.
   * @param {boolean | ((prev: boolean) => boolean)} open - The new value of the pivot panel open state.
   */
  setPivotPanelOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export interface GridPivotingPrivateApi extends GridPivotingPrivateApiCommunity {
  updatePivotModel: (params: {
    field: string;
    targetSection: 'columns' | 'rows' | 'values' | null;
    originSection: 'columns' | 'rows' | 'values' | null;
    targetField?: string;
    targetFieldPosition?: DropPosition;
  }) => void;
}

export type GridPivotingColDefOverrides = Pick<
  GridColDef,
  | 'width'
  | 'flex'
  | 'headerName'
  | 'description'
  | 'align'
  | 'headerAlign'
  | 'cellClassName'
  | 'headerClassName'
  | 'display'
  | 'maxWidth'
  | 'minWidth'
  | 'resizable'
  | 'sortingOrder'
>;
