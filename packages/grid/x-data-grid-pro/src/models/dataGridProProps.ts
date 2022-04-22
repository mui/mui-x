import * as React from 'react';
import {
  GridRowTreeNodeConfig,
  GridEventListener,
  GridEvents,
  GridCallbackDetails,
  GridRowParams,
  GridRowId,
  GridValidRowModel,
} from '@mui/x-data-grid';
import {
  GridExperimentalFeatures,
  DataGridPropsWithoutDefaultValue,
  DataGridPropsWithDefaultValues,
  DataGridPropsWithComplexDefaultValueAfterProcessing,
  DataGridPropsWithComplexDefaultValueBeforeProcessing,
} from '@mui/x-data-grid/internals';
import type { GridPinnedColumns } from '../hooks/features/columnPinning';
import { GridApiPro } from './gridApiPro';
import {
  GridGroupingColDefOverride,
  GridGroupingColDefOverrideParams,
} from './gridGroupingColDefOverride';
import type { GridRowGroupingModel } from '../hooks/features/rowGrouping';
import { GridInitialStatePro } from './gridStatePro';

export interface GridExperimentalProFeatures extends GridExperimentalFeatures {
  /**
   * Will be part of the premium-plan when fully ready.
   */
  rowGrouping: boolean;
}

/**
 * The props users can give to the `DataGridProProps` component.
 */
export interface DataGridProProps<R extends GridValidRowModel = any>
  extends Omit<
    Partial<DataGridProPropsWithDefaultValue> &
      DataGridPropsWithComplexDefaultValueBeforeProcessing &
      DataGridProPropsWithoutDefaultValue<R>,
    DataGridProForcedPropsKey
  > {
  /**
   * Features under development.
   * For each feature, if the flag is not explicitly set to `true`, the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures?: Partial<GridExperimentalProFeatures>;
}

/**
 * The props of the `DataGridPro` component after the pre-processing phase.
 */
export interface DataGridProProcessedProps<R extends GridValidRowModel = any>
  extends DataGridProPropsWithDefaultValue,
    DataGridPropsWithComplexDefaultValueAfterProcessing,
    DataGridProPropsWithoutDefaultValue<R> {}

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
  /**
   * Function that returns the height of the row detail panel.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {number} The height in pixels.
   * @default "() => 500"
   */
  getDetailPanelHeight: (params: GridRowParams) => number;
  /**
   * If `true`, the reordering of rows is enabled.
   * @default false
   */
  rowReordering: boolean;
}

export interface DataGridProPropsWithoutDefaultValue<R extends GridValidRowModel = any>
  extends Omit<DataGridPropsWithoutDefaultValue<R>, 'initialState'> {
  /**
   * The ref object that allows grid manipulation. Can be instantiated with [[useGridApiRef()]].
   */
  apiRef?: React.MutableRefObject<GridApiPro>;
  /**
   * The initial state of the DataGridPro.
   * The data in it will be set in the state on initialization but will not be controlled.
   * If one of the data in `initialState` is also being controlled, then the control state wins.
   */
  initialState?: GridInitialStatePro;
  /**
   * Determines the path of a row in the tree data.
   * For instance, a row with the path ["A", "B"] is the child of the row with the path ["A"].
   * Note that all paths must contain at least one element.
   * @template R
   * @param {R} row The row from which we want the path.
   * @returns {string[]} The path to the row.
   */
  getTreeDataPath?: (row: R) => string[];
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
    | GridGroupingColDefOverride<R>
    | ((
        params: GridGroupingColDefOverrideParams,
      ) => GridGroupingColDefOverride<R> | undefined | null);
  /**
   * The row ids to show the detail panel.
   */
  detailPanelExpandedRowIds?: GridRowId[];
  /**
   * Callback fired when the detail panel of a row is opened or closed.
   * @param {GridRowId[]} ids The ids of the rows which have the detail panel open.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onDetailPanelExpandedRowIdsChange?: (ids: GridRowId[], details: GridCallbackDetails) => void;
  /**
   * Function that returns the element to render in row detail.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {JSX.Element} The row detail element.
   */
  getDetailPanelContent?: (params: GridRowParams<R>) => React.ReactNode;
  /**
   * Callback fired when a row is being reordered.
   * @param {GridRowOrderChangeParams} params With all properties from [[GridRowOrderChangeParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowOrderChange?: GridEventListener<GridEvents.rowOrderChange>;
}
