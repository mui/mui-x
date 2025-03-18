import { RefObject } from '@mui/x-internals/types';
import {
  GridCallbackDetails,
  GridValidRowModel,
  GridGroupNode,
  GridEventListener,
  GridGetRowsError,
  GridUpdateRowError,
  type GridColDef,
} from '@mui/x-data-grid-pro';
import {
  GridExperimentalProFeatures,
  DataGridProPropsWithDefaultValue,
  DataGridProPropsWithoutDefaultValue,
  DataGridPropsWithComplexDefaultValueAfterProcessing,
  DataGridPropsWithComplexDefaultValueBeforeProcessing,
  DataGridPremiumSharedPropsWithDefaultValue,
} from '@mui/x-data-grid-pro/internals';
import type { GridRowGroupingModel } from '../hooks/features/rowGrouping';
import type {
  GridAggregationModel,
  GridAggregationFunction,
  GridAggregationFunctionDataSource,
  GridAggregationPosition,
} from '../hooks/features/aggregation';
import { GridPremiumSlotsComponent } from './gridPremiumSlotsComponent';
import { GridInitialStatePremium } from './gridStatePremium';
import { GridApiPremium } from './gridApiPremium';
import { GridCellSelectionModel } from '../hooks/features/cellSelection';
import type {
  GridPivotingColDefOverrides,
  GridPivotModel,
} from '../hooks/features/pivoting/gridPivotingInterfaces';
import {
  GridDataSourcePremium as GridDataSource,
  GridGetRowsParamsPremium as GridGetRowsParams,
} from '../hooks/features/dataSource/models';

export interface GridExperimentalPremiumFeatures extends GridExperimentalProFeatures {
  pivoting?: boolean;
}

export interface DataGridPremiumPropsWithComplexDefaultValueBeforeProcessing
  extends Pick<DataGridPropsWithComplexDefaultValueBeforeProcessing, 'localeText'> {
  /**
   * Overridable components.
   */
  slots?: Partial<GridPremiumSlotsComponent>;
}

/**
 * The props users can give to the `DataGridPremiumProps` component.
 */
export interface DataGridPremiumProps<R extends GridValidRowModel = any>
  extends Omit<
    Partial<DataGridPremiumPropsWithDefaultValue<R>> &
      DataGridPremiumPropsWithComplexDefaultValueBeforeProcessing &
      DataGridPremiumPropsWithoutDefaultValue<R>,
    DataGridPremiumForcedPropsKey
  > {}

export interface DataGridPremiumPropsWithComplexDefaultValueAfterProcessing
  extends Pick<DataGridPropsWithComplexDefaultValueAfterProcessing, 'localeText'> {
  slots: GridPremiumSlotsComponent;
}

/**
 * The props of the Data Grid Premium component after the pre-processing phase.
 */
export interface DataGridPremiumProcessedProps
  extends DataGridPremiumPropsWithDefaultValue,
    DataGridPremiumPropsWithComplexDefaultValueAfterProcessing,
    DataGridPremiumPropsWithoutDefaultValue {}

export type DataGridPremiumForcedPropsKey = 'signature';

/**
 * The Data Grid Premium options with a default value overridable through props.
 * None of the entry of this interface should be optional, they all have default values and `DataGridProps` already applies a `Partial<DataGridSimpleOptions>` for the public interface.
 * The controlled model do not have a default value at the prop processing level, so they must be defined in `DataGridOtherProps`.
 */
export interface DataGridPremiumPropsWithDefaultValue<R extends GridValidRowModel = any>
  extends DataGridProPropsWithDefaultValue<R>,
    DataGridPremiumSharedPropsWithDefaultValue {
  /**
   * If `true`, aggregation is disabled.
   * @default false
   */
  disableAggregation: boolean;
  /**
   * If `true`, the row grouping is disabled.
   * @default false
   */
  disableRowGrouping: boolean;
  /**
   * If `single`, all the columns that are grouped are represented in the same grid column.
   * If `multiple`, each column that is grouped is represented in its own grid column.
   * @default 'single'
   */
  rowGroupingColumnMode: 'single' | 'multiple';
  /**
   * Aggregation functions available on the grid.
   * @default GRID_AGGREGATION_FUNCTIONS when `dataSource` is not provided, `{}` when `dataSource` is provided
   */
  aggregationFunctions:
    | Record<string, GridAggregationFunction>
    | Record<string, GridAggregationFunctionDataSource>;
  /**
   * Rows used to generate the aggregated value.
   * If `filtered`, the aggregated values are generated using only the rows currently passing the filtering process.
   * If `all`, the aggregated values are generated using all the rows.
   * @default "filtered"
   */
  aggregationRowsScope: 'filtered' | 'all';
  /**
   * Determines the position of an aggregated value.
   * @param {GridGroupNode} groupNode The current group.
   * @returns {GridAggregationPosition | null} Position of the aggregated value (if `null`, the group isn't aggregated).
   * @default (groupNode) => groupNode == null ? 'footer' : 'inline'
   */
  getAggregationPosition: (groupNode: GridGroupNode) => GridAggregationPosition | null;
  /**
   * If `true`, the clipboard paste is disabled.
   * @default false
   */
  disableClipboardPaste: boolean;
  /**
   * The function is used to split the pasted text into rows and cells.
   * @param {string} text The text pasted from the clipboard.
   * @returns {string[][] | null} A 2D array of strings. The first dimension is the rows, the second dimension is the columns.
   * @default (pastedText) => { const text = pastedText.replace(/\r?\n$/, ''); return text.split(/\r\n|\n|\r/).map((row) => row.split('\t')); }
   */
  splitClipboardPastedText: (text: string) => string[][] | null;
  /**
   * If `true`, the pivoting feature is disabled.
   * @default false
   */
  disablePivoting: boolean;
  /**
   * Allows to generate derived columns from actual columns that will be used for pivoting.
   * Useful e.g. for date columns to generate year, quarter, month, etc.
   * @param {GridColDef} column The column to generate derived columns for.
   * @returns {GridColDef[] | undefined} The derived columns.
   * @default {defaultGetPivotDerivedColumns} Creates year and quarter columns for date columns.
   */
  getPivotDerivedColumns: ((column: GridColDef) => GridColDef[] | undefined) | null;
}

export interface DataGridPremiumPropsWithoutDefaultValue<R extends GridValidRowModel = any>
  extends Omit<
    DataGridProPropsWithoutDefaultValue<R>,
    'initialState' | 'apiRef' | 'dataSource' | 'onDataSourceError'
  > {
  /**
   * The ref object that allows grid manipulation. Can be instantiated with `useGridApiRef()`.
   */
  apiRef?: RefObject<GridApiPremium | null>;
  /**
   * The initial state of the DataGridPremium.
   * The data in it is set in the state on initialization but isn't controlled.
   * If one of the data in `initialState` is also being controlled, then the control state wins.
   */
  initialState?: GridInitialStatePremium;
  /**
   * Set the row grouping model of the grid.
   */
  rowGroupingModel?: GridRowGroupingModel;
  /**
   * Callback fired when the row grouping model changes.
   * @param {GridRowGroupingModel} model Columns used as grouping criteria.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowGroupingModelChange?: (model: GridRowGroupingModel, details: GridCallbackDetails) => void;
  /**
   * Set the aggregation model of the grid.
   */
  aggregationModel?: GridAggregationModel;
  /**
   * Callback fired when the row grouping model changes.
   * @param {GridAggregationModel} model The aggregated columns.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onAggregationModelChange?: (model: GridAggregationModel, details: GridCallbackDetails) => void;
  /**
   * Set the cell selection model of the grid.
   */
  cellSelectionModel?: GridCellSelectionModel;
  /**
   * Callback fired when the selection state of one or multiple cells changes.
   * @param {GridCellSelectionModel} cellSelectionModel Object in the shape of [[GridCellSelectionModel]] containing the selected cells.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onCellSelectionModelChange?: (
    cellSelectionModel: GridCellSelectionModel,
    details: GridCallbackDetails,
  ) => void;
  /**
   * Callback fired when the state of the Excel export changes.
   * @param {string} inProgress Indicates if the task is in progress.
   */
  onExcelExportStateChange?: (inProgress: 'pending' | 'finished') => void;
  /**
   * Callback fired before the clipboard paste operation starts.
   * Use it to confirm or cancel the paste operation.
   * @param {object} params Params passed to the callback.
   * @param {string[][]} params.data The raw pasted data split by rows and cells.
   * @returns {Promise<any>} A promise that resolves to confirm the paste operation, and rejects to cancel it.
   */
  onBeforeClipboardPasteStart?: (params: { data: string[][] }) => Promise<any>;
  /**
   * Callback fired when the clipboard paste operation starts.
   */
  onClipboardPasteStart?: GridEventListener<'clipboardPasteStart'>;
  /**
   * Callback fired when the clipboard paste operation ends.
   */
  onClipboardPasteEnd?: GridEventListener<'clipboardPasteEnd'>;
  /**
   * Unstable features, breaking changes might be introduced.
   * For each feature, if the flag is not explicitly set to `true`, then the feature is fully disabled, and neither property nor method calls will have any effect.
   */
  experimentalFeatures?: Partial<GridExperimentalPremiumFeatures>;
  /**
   * Data source object.
   */
  dataSource?: GridDataSource;
  /**
   * Callback fired when a data source request fails.
   * @param {GridGetRowsError | GridUpdateRowError} error The data source error object.
   */
  onDataSourceError?: (error: GridGetRowsError<GridGetRowsParams> | GridUpdateRowError) => void;
  /**
   * The pivot model of the grid.
   * Will be used to generate the pivot data.
   * In case of `pivotEnabled` being `false`, the pivot model is still used to populate the pivot panel.
   */
  pivotModel?: GridPivotModel;
  /**
   * Callback fired when the pivot model changes.
   * @param {GridPivotModel} pivotModel The new pivot model.
   */
  onPivotModelChange?: (pivotModel: GridPivotModel) => void;
  /**
   * If `true`, the data grid will show data in pivot mode using the `pivotModel`.
   * @default false
   */
  pivotEnabled?: boolean;
  /**
   * Callback fired when the pivot enabled state changes.
   * @param {boolean} isPivot Whether the data grid is in pivot mode.
   */
  onPivotEnabledChange?: (isPivot: boolean) => void;
  /**
   * If `true`, the pivot side panel is visible.
   * @default false
   */
  pivotPanelOpen?: boolean;
  /**
   * Callback fired when the pivot side panel open state changes.
   * @param {boolean} pivotPanelOpen Whether the pivot side panel is visible.
   */
  onPivotPanelOpenChange?: (pivotPanelOpen: boolean) => void;

  /**
   * The column definition overrides for the columns generated by the pivoting feature.
   * @param {string} originalColumnField The field of the original column.
   * @param {string[]} columnGroupPath The path of the column groups the column belongs to.
   * @returns {Partial<GridPivotingColDefOverrides> | undefined | void} The column definition overrides.
   */
  pivotingColDef?: (
    originalColumnField: GridColDef['field'],
    columnGroupPath: string[],
  ) => Partial<GridPivotingColDefOverrides> | undefined;
}
