// TODO: Move to `x-data-grid-pro` folder
import { GridRowModel, GridRowTreeNodeConfig } from '../gridRows';
import { GridEventListener, GridEvents } from '../events';
import { GridCallbackDetails, GridPinnedColumns } from '../api';
import { GridGroupingColDefOverride, GridGroupingColDefOverrideParams } from '../colDef';
import {
  DataGridPropsWithoutDefaultValue,
  DataGridPropsWithDefaultValues,
  DataGridPropsWithComplexDefaultValueAfterProcessing,
  DataGridPropsWithComplexDefaultValueBeforeProcessing,
  DATA_GRID_PROPS_DEFAULT_VALUES,
} from './DataGridProps';
import type { GridRowGroupingModel } from '../../hooks/features/rowGrouping';

export type GridExperimentalProFeatures =
  /**
   * Will be part of the premium-plan when fully ready.
   */
  'rowGrouping';

/**
 * The props users can give to the `DataGridProProps` component.
 */
export interface DataGridProProps
  extends Omit<
    Partial<DataGridProPropsWithDefaultValue> &
      DataGridPropsWithComplexDefaultValueBeforeProcessing &
      DataGridProPropsWithoutDefaultValue,
    DataGridProForcedPropsKey
  > {
  /**
   * Features under development.
   * For each feature, if the flag is not explicitly set to `true`, the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures?: { [key in GridExperimentalProFeatures]?: boolean };
}

/**
 * The props of the `DataGridPro` component after the pre-processing phase.
 */
export interface DataGridProProcessedProps
  extends DataGridProPropsWithDefaultValue,
    DataGridPropsWithComplexDefaultValueAfterProcessing,
    DataGridProPropsWithoutDefaultValue {}

export type DataGridProForcedPropsKey = 'signature';

/**
 * The `DataGridPro` options with a default value overridable through props
 * None of the entry of this interface should be optional, they all have default values and `DataGridProps` already applies a `Partial<DataGridSimpleOptions>` for the public interface
 * The controlled model do not have a default value at the prop processing level, so they must be defined in `DataGridOtherProps`
 */
export interface DataGridProPropsWithDefaultValue extends DataGridPropsWithDefaultValues {
  /**
   * Set the area in `px` at the bottom of the grid viewport where onRowsScrollEnd is called.
   * @default 80
   */
  scrollEndThreshold: number;
  /**
   * If `true`, the rows will be gathered in a tree structure according to the `getTreeDataPath` prop.
   * @default false
   */
  treeData: boolean;
  /**
   * If above 0, the row children will be expanded up to this depth.
   * If equal to -1, all the row children will be expanded.
   * @default 0
   */
  defaultGroupingExpansionDepth: number;
  /**
   * Determines if a group should be expanded after its creation.
   * This prop takes priority over the `defaultGroupingExpansionDepth` prop.
   * @param {GridRowTreeNodeConfig} node The node of the group to test.
   * @returns {boolean} A boolean indicating if the group is expanded.
   */
  isGroupExpandedByDefault?: (node: GridRowTreeNodeConfig) => boolean;
  /**
   * If `true`, the column pinning is disabled.
   * @default false
   */
  disableColumnPinning: boolean;
  /**
   * If `true`, the filtering will only be applied to the top level rows when grouping rows with the `treeData` prop.
   * @default false
   */
  disableChildrenFiltering: boolean;
  /**
   * If `true`, the sorting will only be applied to the top level rows when grouping rows with the `treeData` prop.
   * @default false
   */
  disableChildrenSorting: boolean;
  /**
   * If `true`, the row grouping is disabled.
   * @default false
   */
  disableRowGrouping: boolean;
  /**
   * If `single`, all column we are grouping by will be represented in the same grouping the same column.
   * If `multiple`, each column we are grouping by will be represented in its own column.
   * @default 'single'
   */
  rowGroupingColumnMode: 'single' | 'multiple';
}

/**
 * The default values of `DataGridProPropsWithDefaultValue` to inject in the props of DataGridPro.
 */
export const DATA_GRID_PRO_PROPS_DEFAULT_VALUES: DataGridProPropsWithDefaultValue = {
  ...DATA_GRID_PROPS_DEFAULT_VALUES,
  scrollEndThreshold: 80,
  treeData: false,
  defaultGroupingExpansionDepth: 0,
  disableColumnPinning: false,
  disableRowGrouping: false,
  disableChildrenFiltering: false,
  disableChildrenSorting: false,
  rowGroupingColumnMode: 'single',
};

export interface DataGridProPropsWithoutDefaultValue extends DataGridPropsWithoutDefaultValue {
  /**
   * Determines the path of a row in the tree data.
   * For instance, a row with the path ["A", "B"] is the child of the row with the path ["A"].
   * Note that all paths must contain at least one element.
   * @param {GridRowModel} row The row from which we want the path.
   * @returns {string[]} The path to the row.
   */
  getTreeDataPath?: (row: GridRowModel) => string[];
  /**
   * Callback fired while a column is being resized.
   * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnResize?: GridEventListener<GridEvents.columnResize>;
  /**
   * Callback fired when the width of a column is changed.
   * @param {GridColumnResizeParams} params With all properties from [[GridColumnResizeParams]].
   * @param {MuiEvent<React.MouseEvent>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onColumnWidthChange?: GridEventListener<GridEvents.columnWidthChange>;
  /**
   * Callback fired when scrolling to the bottom of the grid viewport.
   * @param {GridRowScrollEndParams} params With all properties from [[GridRowScrollEndParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowsScrollEnd?: GridEventListener<GridEvents.rowsScrollEnd>;
  /**
   * The column fields to display pinned to left or right.
   */
  pinnedColumns?: GridPinnedColumns;
  /**
   * Callback fired when the pinned columns have changed.
   * @param {GridPinnedColumns} pinnedColumns The changed pinned columns.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPinnedColumnsChange?: (pinnedColumns: GridPinnedColumns, details: GridCallbackDetails) => void;
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
   * The grouping column used by the tree data.
   */
  groupingColDef?:
    | GridGroupingColDefOverride
    | ((params: GridGroupingColDefOverrideParams) => GridGroupingColDefOverride | undefined | null);
}
