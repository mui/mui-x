import * as React from 'react';
import {
  GridEventListener,
  GridCallbackDetails,
  GridRowParams,
  GridRowId,
  GridValidRowModel,
  GridGroupNode,
  GridFeatureMode,
} from '@mui/x-data-grid';
import type {
  GridExperimentalFeatures,
  DataGridPropsWithoutDefaultValue,
  DataGridPropsWithDefaultValues,
  DataGridPropsWithComplexDefaultValueAfterProcessing,
  DataGridPropsWithComplexDefaultValueBeforeProcessing,
  GridPinnedColumnFields,
  DataGridProSharedPropsWithDefaultValue,
  DataGridProSharedPropsWithoutDefaultValue,
  GridDataSourceCache,
  GridGetRowsParams,
} from '@mui/x-data-grid/internals';
import type { GridPinnedRowsProp } from '../hooks/features/rowPinning';
import { GridApiPro } from './gridApiPro';
import {
  GridGroupingColDefOverride,
  GridGroupingColDefOverrideParams,
} from './gridGroupingColDefOverride';
import { GridInitialStatePro } from './gridStatePro';
import { GridProSlotsComponent } from './gridProSlotsComponent';
import type { GridProSlotProps } from './gridProSlotProps';

export interface GridExperimentalProFeatures extends GridExperimentalFeatures {}

interface DataGridProPropsWithComplexDefaultValueBeforeProcessing
  extends Omit<DataGridPropsWithComplexDefaultValueBeforeProcessing, 'components'> {
  /**
   * Overridable components.
   */
  slots?: Partial<GridProSlotsComponent>;
}

/**
 * The props users can give to the `DataGridProProps` component.
 */
export interface DataGridProProps<R extends GridValidRowModel = any>
  extends Omit<
    Partial<DataGridProPropsWithDefaultValue<R>> &
      DataGridProPropsWithComplexDefaultValueBeforeProcessing &
      DataGridProPropsWithoutDefaultValue<R>,
    DataGridProForcedPropsKey
  > {}

interface DataGridProPropsWithComplexDefaultValueAfterProcessing
  extends Omit<DataGridPropsWithComplexDefaultValueAfterProcessing, 'slots'> {
  slots: GridProSlotsComponent;
}

/**
 * The props of the `DataGridPro` component after the pre-processing phase.
 */
export interface DataGridProProcessedProps<R extends GridValidRowModel = any>
  extends DataGridProPropsWithDefaultValue<R>,
    DataGridProPropsWithComplexDefaultValueAfterProcessing,
    Omit<DataGridProPropsWithoutDefaultValue<R>, 'componentsProps'> {}

export type DataGridProForcedPropsKey = 'signature';

/**
 * The `DataGridPro` options with a default value overridable through props
 * None of the entry of this interface should be optional, they all have default values and `DataGridProps` already applies a `Partial<DataGridSimpleOptions>` for the public interface
 * The controlled model do not have a default value at the prop processing level, so they must be defined in `DataGridOtherProps`
 */
export interface DataGridProPropsWithDefaultValue<R extends GridValidRowModel = any>
  extends DataGridPropsWithDefaultValues<R>,
    DataGridProSharedPropsWithDefaultValue {
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
   * @param {GridGroupNode} node The node of the group to test.
   * @returns {boolean} A boolean indicating if the group is expanded.
   */
  isGroupExpandedByDefault?: (node: GridGroupNode) => boolean;
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
   * Function that returns the height of the row detail panel.
   * @param {GridRowParams} params With all properties from [[GridRowParams]].
   * @returns {number | string} The height in pixels or "auto" to use the content height.
   * @default "() => 500"
   */
  getDetailPanelHeight: (params: GridRowParams) => number | 'auto';
  /**
   * If `true`, the reordering of rows is enabled.
   * @default false
   */
  rowReordering: boolean;
  /**
   * Loading rows can be processed on the server or client-side.
   * Set it to 'client' if you would like enable infnite loading.
   * Set it to 'server' if you would like to enable lazy loading.
   * * @default "client"
   */
  rowsLoadingMode: GridFeatureMode;
  /**
   * If `true`, moving the mouse pointer outside the grid before releasing the mouse button
   * in a column re-order action will not cause the column to jump back to its original position.
   * @default false
   */
  keepColumnPositionIfDraggedOutside: boolean;
}

interface DataGridProDataSourceProps {
  unstable_dataSourceCache?: GridDataSourceCache | null;
  unstable_onDataSourceError?: (error: Error, params: GridGetRowsParams) => void;
}

interface DataGridProRegularProps<R extends GridValidRowModel> {
  /**
   * Determines the path of a row in the tree data.
   * For instance, a row with the path ["A", "B"] is the child of the row with the path ["A"].
   * Note that all paths must contain at least one element.
   * @template R
   * @param {R} row The row from which we want the path.
   * @returns {string[]} The path to the row.
   */
  getTreeDataPath?: (row: R) => string[];
}

export interface DataGridProPropsWithoutDefaultValue<R extends GridValidRowModel = any>
  extends Omit<
      DataGridPropsWithoutDefaultValue<R>,
      'initialState' | 'componentsProps' | 'slotProps'
    >,
    DataGridProRegularProps<R>,
    DataGridProDataSourceProps,
    DataGridProSharedPropsWithoutDefaultValue {
  /**
   * The ref object that allows grid manipulation. Can be instantiated with `useGridApiRef()`.
   */
  apiRef?: React.MutableRefObject<GridApiPro>;
  /**
   * The initial state of the DataGridPro.
   * The data in it will be set in the state on initialization but will not be controlled.
   * If one of the data in `initialState` is also being controlled, then the control state wins.
   */
  initialState?: GridInitialStatePro;
  /**
   * Unstable features, breaking changes might be introduced.
   * For each feature, if the flag is not explicitly set to `true`, the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures?: Partial<GridExperimentalProFeatures>;
  /**
   * Callback fired when scrolling to the bottom of the grid viewport.
   * @param {GridRowScrollEndParams} params With all properties from [[GridRowScrollEndParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowsScrollEnd?: GridEventListener<'rowsScrollEnd'>;
  /**
   * The column fields to display pinned to left or right.
   */
  pinnedColumns?: GridPinnedColumnFields;
  /**
   * Callback fired when the pinned columns have changed.
   * @param {GridPinnedColumnFields} pinnedColumns The changed pinned columns.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onPinnedColumnsChange?: (
    pinnedColumns: GridPinnedColumnFields,
    details: GridCallbackDetails,
  ) => void;
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
   * @returns {React.JSX.Element} The row detail element.
   */
  getDetailPanelContent?: (params: GridRowParams<R>) => React.ReactNode;
  /**
   * Callback fired when a row is being reordered.
   * @param {GridRowOrderChangeParams} params With all properties from [[GridRowOrderChangeParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowOrderChange?: GridEventListener<'rowOrderChange'>;
  /**
   * Callback fired when rowCount is set and the next batch of virtualized rows is rendered.
   * @param {GridFetchRowsParams} params With all properties from [[GridFetchRowsParams]].
   * @param {MuiEvent<{}>} event The event object.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onFetchRows?: GridEventListener<'fetchRows'>;
  /**
   * Rows data to pin on top or bottom.
   */
  pinnedRows?: GridPinnedRowsProp<R>;
  /**
   * Overridable components props dynamically passed to the component at rendering.
   */
  slotProps?: GridProSlotProps;
}
