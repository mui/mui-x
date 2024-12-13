import * as React from 'react';
import { GridCellClassNamePropType } from '../gridCellClass';
import { GridColumnHeaderClassNamePropType } from '../gridColumnHeaderClass';
import type { GridFilterOperator } from '../gridFilterOperator';
import {
  GridRenderCellParams,
  GridRenderEditCellParams,
  GridPreProcessEditCellProps,
} from '../params/gridCellParams';
import { GridColumnHeaderParams } from '../params/gridColumnHeaderParams';
import { GridComparatorFn, GridSortDirection } from '../gridSortModel';
import { GridColType } from './gridColType';
import { GridRowParams } from '../params/gridRowParams';
import { GridValueOptionsParams } from '../params/gridValueOptionsParams';
import { GridActionsCellItemProps } from '../../components/cell/GridActionsCellItem';
import { GridEditCellProps } from '../gridEditRowModel';
import type { GridValidRowModel } from '../gridRows';
import { GridApiCommunity } from '../api/gridApiCommunity';
/**
 * Alignment used in position elements in Cells.
 */
export type GridAlignment = 'left' | 'right' | 'center';

export type ValueOptions = string | number | { value: any; label: string } | Record<string, any>;

/**
 * Value that can be used as a key for grouping rows
 */
export type GridKeyValue = string | number | boolean;

export type GridApplyQuickFilter<R extends GridValidRowModel = GridValidRowModel, V = any> = (
  value: V,
  row: R,
  column: GridColDef,
  apiRef: React.MutableRefObject<GridApiCommunity>,
) => boolean;

export type GetApplyQuickFilterFn<R extends GridValidRowModel = GridValidRowModel, V = any> = (
  value: any,
  colDef: GridStateColDef<R, V>,
  apiRef: React.MutableRefObject<GridApiCommunity>,
) => null | GridApplyQuickFilter<R, V>;

export type GridValueGetter<
  R extends GridValidRowModel = GridValidRowModel,
  V = any,
  F = V,
  TValue = never,
> = (
  value: TValue,
  row: R,
  column: GridColDef<R, V, F>,
  apiRef: React.MutableRefObject<GridApiCommunity>,
) => V;

export type GridValueFormatter<
  R extends GridValidRowModel = GridValidRowModel,
  V = any,
  F = V,
  TValue = never,
> = (
  value: TValue,
  row: R,
  column: GridColDef<R, V, F>,
  apiRef: React.MutableRefObject<GridApiCommunity>,
) => F;

export type GridValueSetter<R extends GridValidRowModel = GridValidRowModel, V = any, F = V> = (
  value: V,
  row: R,
  column: GridColDef<R, V, F>,
  apiRef: React.MutableRefObject<GridApiCommunity>,
) => R;

export type GridValueParser<R extends GridValidRowModel = GridValidRowModel, V = any, F = V> = (
  value: F | undefined,
  row: R | undefined,
  column: GridColDef<R, V, F>,
  apiRef: React.MutableRefObject<GridApiCommunity>,
) => V;

export type GridColSpanFn<R extends GridValidRowModel = GridValidRowModel, V = any, F = V> = (
  value: V,
  row: R,
  column: GridColDef<R, V, F>,
  apiRef: React.MutableRefObject<GridApiCommunity>,
) => number | undefined;

/**
 * Column Definition base interface.
 */
export interface GridBaseColDef<R extends GridValidRowModel = GridValidRowModel, V = any, F = V> {
  /**
   * The unique identifier of the column. Used to map with [[GridRowModel]] values.
   */
  field: string;
  /**
   * The title displayed in the column header cell.
   */
  headerName?: string;
  /**
   * The tooltip text shown when the column header name is truncated.
   */
  description?: string;
  /**
   * The width of the column in pixels.
   * @default 100
   */
  width?: number;
  /**
   * The flex grow factor of the column. Must be a positive number.
   */
  flex?: number;
  /**
   * The minimum width of the column in pixels.
   * @default 50
   */
  minWidth?: number;
  /**
   * The maximum width of the column in pixels.
   * @default Infinity
   */
  maxWidth?: number;
  /**
   * If `false`, removes the option to hide this column.
   * @default true
   */
  hideable?: boolean;
  /**
   * If `false`, disables sorting for this column.
   * @default true
   */
  sortable?: boolean;
  /**
   * The order of the sorting sequence.
   */
  sortingOrder?: readonly GridSortDirection[];
  /**
   * If `false`, disables resizing for this column.
   * @default true
   */
  resizable?: boolean;
  /**
   * If `true`, the cells of the column are editable.
   * @default false
   */
  editable?: boolean;
  /**
   * If `true`, the rows can be grouped based on this column values (pro-plan only).
   * Only available in DataGridPremium.
   * TODO: Use module augmentation to move it to `@mui/x-data-grid-premium` (need to modify how we handle column types default values).
   * @default true
   */
  groupable?: boolean;
  /**
   * If `false`, the menu items for column pinning menu will not be rendered.
   * Only available in DataGridPro.
   * TODO: Use module augmentation to move it to `@mui/x-data-grid-pro` (need to modify how we handle column types default values).
   * @default true
   */
  pinnable?: boolean;
  /**
   * A comparator function used to sort rows.
   */
  sortComparator?: GridComparatorFn<V>;
  /**
   * Provide an alternative comparator function for sorting.
   * Takes precedence over `sortComparator`.
   * @param {GridSortDirection} sortDirection The direction of the sort.
   * @returns {GridComparatorFn<V>} The comparator function to use.
   */
  getSortComparator?: (sortDirection: GridSortDirection) => GridComparatorFn<V> | undefined;
  /**
   * The type of the column.
   * @default 'string'
   * @see See {@link https://mui.com/x/react-data-grid/column-definition/#column-types column types docs} for more details.
   */
  type?: GridColType;
  /**
   * Align cell content.
   */
  align?: GridAlignment;
  /**
   * Function that returns specific data to render in the cell instead of using the field value.
   */
  valueGetter?: GridValueGetter<R, V, F>;
  /**
   * Function that returns a specific value to be used in row spanning.
   */
  rowSpanValueGetter?: GridValueGetter<R, V, F>;
  /**
   * Function that customizes how the entered value is stored in the row.
   * Only works with cell/row editing.
   * @returns {R} The row with the updated field.
   */
  valueSetter?: GridValueSetter<R, V, F>;
  /**
   * Formats the cell value before rendering.
   */
  valueFormatter?: GridValueFormatter<R, V, F>;
  /**
   * Function that takes the user-entered value and converts it to a value used internally.
   * @returns {V} The converted value to use internally.
   */
  valueParser?: GridValueParser<R, V, F>;
  /**
   * Class name added to cells in this column.
   */
  cellClassName?: GridCellClassNamePropType<R, V>;
  /**
   * Display mode for the cell:
   *  - 'text': For text-based cells (default)
   *  - 'flex': For cells with HTMLElement children
   */
  display?: 'text' | 'flex';
  /**
   * Override the component rendered as cell for this column.
   * @template R, V, F
   * @param {GridRenderCellParams<R, V, F>} params Object containing parameters for the renderer.
   * @returns {React.ReactNode} The element to be rendered.
   */
  renderCell?: (params: GridRenderCellParams<R, V, F>) => React.ReactNode;
  /**
   * Override the component rendered in edit cell mode for this column.
   * @param {GridRenderEditCellParams} params Object containing parameters for the renderer.
   * @returns {React.ReactNode} The element to be rendered.
   */
  renderEditCell?: (params: GridRenderEditCellParams<R, V, F>) => React.ReactNode;
  /**
   * Callback fired when the edit props of the cell changes.
   * Processes the props before being saved into the state.
   * @param {GridPreProcessEditCellProps} params Object containing parameters of the cell being edited.
   * @returns {GridEditCellProps | Promise<GridEditCellProps>} The new edit cell props.
   */
  preProcessEditCellProps?: (
    params: GridPreProcessEditCellProps,
  ) => GridEditCellProps | Promise<GridEditCellProps>;
  /**
   * Class name added to the column header cell.
   */
  headerClassName?: GridColumnHeaderClassNamePropType;
  /**
   * Override the component rendered in the column header cell.
   * @template R, V, F
   * @param {GridColumnHeaderParams<R, V, F>} params Object containing parameters for the renderer.
   * @returns {React.ReactNode} The element to be rendered.
   */
  renderHeader?: (params: GridColumnHeaderParams<R, V, F>) => React.ReactNode;
  /**
   * Align column header content.
   */
  headerAlign?: GridAlignment;
  /**
   * Toggle the visibility of the sort icons.
   * @default false
   */
  hideSortIcons?: boolean;
  /**
   * If `true`, the column menu is disabled for this column.
   * @default false
   */
  disableColumnMenu?: boolean;
  /**
   * If `true`, the column is filterable.
   * @default true
   */
  filterable?: boolean;
  /**
   * Allows setting the filter operators for this column.
   */
  filterOperators?: readonly GridFilterOperator<R, V, F>[];
  /**
   * The callback that generates a filtering function for a given quick filter value.
   * This function can return `null` to skip filtering for this value and column.
   * @param {any} value The value with which we want to filter the column.
   * @param {GridStateColDef} colDef The column from which we want to filter the rows.
   * @param {React.MutableRefObject<GridApiCommunity>} apiRef Deprecated: The API of the grid.
   * @returns {null | GridApplyQuickFilter} The function to call to check if a row pass this filter value or not.
   */
  getApplyQuickFilterFn?: GetApplyQuickFilterFn<R, V>;
  /**
   * If `true`, this column cannot be reordered.
   * @default false
   */
  disableReorder?: boolean;
  /**
   * If `true`, this column will not be included in exports.
   * @default false
   */
  disableExport?: boolean;
  /**
   * Number of columns a cell should span.
   * @default 1
   */
  colSpan?: number | GridColSpanFn<R, V, F>;
  /**
   * Example values that can be used by the grid to get more context about the column.
   */
  unstable_examples?: V[];
}

/**
 * Column Definition interface used for columns with the `actions` type.
 * @demos
 *   - [Special column properties](/x/react-data-grid/column-definition/#special-properties)
 */
export interface GridActionsColDef<R extends GridValidRowModel = any, V = any, F = V>
  extends GridBaseColDef<R, V, F> {
  /**
   * The type of the column.
   * @default 'actions'
   */
  type: 'actions';
  /**
   * Function that returns the actions to be shown.
   * @param {GridRowParams} params The params for each row.
   * @returns {readonly React.ReactElement<GridActionsCellItemProps>[]} An array of [[GridActionsCell]] elements.
   */
  getActions: (params: GridRowParams<R>) => readonly React.ReactElement<GridActionsCellItemProps>[];
}

/**
 * Column Definition interface used for columns with the `singleSelect` type.
 * @demos
 *   - [Special column properties](/x/react-data-grid/column-definition/#special-properties)
 */
export interface GridSingleSelectColDef<R extends GridValidRowModel = any, V = any, F = V>
  extends GridBaseColDef<R, V, F> {
  /**
   * The type of the column.
   * @default 'singleSelect'
   */
  type: 'singleSelect';
  /**
   * To be used in combination with `type: 'singleSelect'`. This is an array (or a function returning an array) of the possible cell values and labels.
   */
  valueOptions?: Array<ValueOptions> | ((params: GridValueOptionsParams<R>) => Array<ValueOptions>);
  /**
   * Used to determine the label displayed for a given value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The text to be displayed.
   */
  getOptionLabel?: (value: ValueOptions) => string;
  /**
   * Used to determine the value used for a value option.
   * @param {ValueOptions} value The current value option.
   * @returns {string} The value to be used.
   */
  getOptionValue?: (value: ValueOptions) => any;
}

/**
 * Column Definition interface.
 * @demos
 *   - [Column definition](/x/react-data-grid/column-definition/)
 */
export type GridColDef<R extends GridValidRowModel = any, V = any, F = V> =
  | GridBaseColDef<R, V, F>
  | GridActionsColDef<R, V, F>
  | GridSingleSelectColDef<R, V, F>;

/**
 * Column Definition interface used for the list view column.
 * @demos
 *   - [List view](/x/react-data-grid/list-view/)
 */
export type GridListColDef<R extends GridValidRowModel = any, V = any, F = V> = Pick<
  GridBaseColDef<R, V, F>,
  'field' | 'renderCell' | 'align' | 'cellClassName' | 'display'
>;

export type GridColTypeDef<V = any, F = V> = Omit<GridBaseColDef<any, V, F>, 'field'>;

export type GridStateColDef<R extends GridValidRowModel = any, V = any, F = V> = GridColDef<
  R,
  V,
  F
> & {
  computedWidth: number;
  /**
   * If `true`, it means that at least one of the dimension's property of this column has been modified since the last time the column prop has changed.
   */
  hasBeenResized?: boolean;
};

/**
 * Meta Info about columns.
 */
export interface GridColumnsMeta {
  totalWidth: number;
  positions: number[];
}
