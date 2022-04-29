import * as React from 'react';
import { GridCellClassNamePropType } from '../gridCellClass';
import { GridColumnHeaderClassNamePropType } from '../gridColumnHeaderClass';
import { GridFilterOperator } from '../gridFilterOperator';
import {
  GridCellParams,
  GridRenderCellParams,
  GridRenderEditCellParams,
  GridValueFormatterParams,
  GridValueGetterParams,
  GridValueSetterParams,
  GridPreProcessEditCellProps,
} from '../params/gridCellParams';
import { GridColumnHeaderParams } from '../params/gridColumnHeaderParams';
import { GridComparatorFn, GridSortDirection } from '../gridSortModel';
import { GridColType, GridNativeColTypes } from './gridColType';
import { GridRowParams } from '../params/gridRowParams';
import { GridValueOptionsParams } from '../params/gridValueOptionsParams';
import { GridActionsCellItemProps } from '../../components/cell/GridActionsCellItem';
import { GridEditCellProps } from '../gridEditRowModel';
import type { GridValidRowModel } from '../gridRows';

/**
 * Alignment used in position elements in Cells.
 */
export type GridAlignment = 'left' | 'right' | 'center';

export type ValueOptions = string | number | { value: any; label: string };

/**
 * Value that can be used as a key for grouping rows
 */
export type GridKeyValue = string | number | boolean;

/**
 * Column Definition interface.
 */
export interface GridColDef<R extends GridValidRowModel = any, V = any, F = V> {
  /**
   * The column identifier. It's used to map with [[GridRowModel]] values.
   */
  field: string;
  /**
   * The title of the column rendered in the column header cell.
   */
  headerName?: string;
  /**
   * The description of the column rendered as tooltip if the column header name is not fully displayed.
   */
  description?: string;
  /**
   * Set the width of the column.
   * @default 100
   */
  width?: number;
  /**
   * If set, it indicates that a column has fluid width. Range [0, ∞).
   */
  flex?: number;
  /**
   * Sets the minimum width of a column.
   * @default 50
   */
  minWidth?: number;
  /**
   * Sets the maximum width of a column.
   * @default Infinity
   */
  maxWidth?: number;
  /**
   * If `true`, hide the column.
   * @deprecated Use the `columnVisibility` prop instead.
   * @default false
   */
  hide?: boolean;
  /**
   * If `false`, removes the buttons for hiding this column.
   * @default true
   */
  hideable?: boolean;
  /**
   * If `true`, the column is sortable.
   * @default true
   */
  sortable?: boolean;
  /**
   * The order of the sorting sequence.
   */
  sortingOrder?: GridSortDirection[];
  /**
   * If `true`, the column is resizable.
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
   * Type allows to merge this object with a default definition [[GridColDef]].
   * @default 'string'
   */
  type?: GridColType;
  /**
   * To be used in combination with `type: 'singleSelect'`. This is an array (or a function returning an array) of the possible cell values and labels.
   */
  valueOptions?: Array<ValueOptions> | ((params: GridValueOptionsParams<R>) => Array<ValueOptions>);
  /**
   * Allows to align the column values in cells.
   */
  align?: GridAlignment;
  /**
   * Function that allows to get a specific data instead of field to render in the cell.
   * @template R, V
   * @param {GridValueGetterParams<any, R>} params Object containing parameters for the getter.
   * @returns {V} The cell value.
   */
  valueGetter?: (params: GridValueGetterParams<any, R>) => V;
  /**
   * Function that allows to customize how the entered value is stored in the row.
   * It only works with cell/row editing.
   * @template R, V
   * @param {GridValueSetterParams<R, V>} params Object containing parameters for the setter.
   * @returns {R} The row with the updated field.
   */
  valueSetter?: (params: GridValueSetterParams<R, V>) => R;
  /**
   * Function that allows to apply a formatter before rendering its value.
   * @template V, F
   * @param {GridValueFormatterParams<V>} params Object containing parameters for the formatter.
   * @returns {F} The formatted value.
   */
  valueFormatter?: (params: GridValueFormatterParams<V>) => F;
  /**
   * Function that takes the user-entered value and converts it to a value used internally.
   * @template R, V, F
   * @param {F | undefined} value The user-entered value.
   * @param {GridCellParams<V, R, F>} params The params when called before saving the value.
   * @returns {V} The converted value to use internally.
   */
  valueParser?: (value: F | undefined, params?: GridCellParams<V, R, F>) => V;
  /**
   * Class name that will be added in cells for that column.
   */
  cellClassName?: GridCellClassNamePropType;
  /**
   * Allows to override the component rendered as cell for this column.
   * @template R, V, F
   * @param {GridRenderCellParams<V, R, F>} params Object containing parameters for the renderer.
   * @returns {React.ReactNode} The element to be rendered.
   */
  renderCell?: (params: GridRenderCellParams<V, R, F>) => React.ReactNode;
  /**
   * Allows to override the component rendered in edit cell mode for this column.
   * @param {GridRenderEditCellParams} params Object containing parameters for the renderer.
   * @returns {React.ReactNode} The element to be rendered.
   */
  renderEditCell?: (params: GridRenderEditCellParams<V>) => React.ReactNode;
  /**
   * Callback fired when the edit props of the cell changes.
   * It allows to process the props that saved into the state.
   * @param {GridPreProcessEditCellProps} params Object containing parameters of the cell being edited.
   * @returns {GridEditCellProps | Promise<GridEditCellProps>} The new edit cell props.
   */
  preProcessEditCellProps?: (
    params: GridPreProcessEditCellProps,
  ) => GridEditCellProps | Promise<GridEditCellProps>;
  /**
   * Class name that will be added in the column header cell.
   */
  headerClassName?: GridColumnHeaderClassNamePropType;
  /**
   * Allows to render a component in the column header cell.
   * @template V, R, F
   * @param {GridColumnHeaderParams<V, R, F>} params Object containing parameters for the renderer.
   * @returns {React.ReactNode} The element to be rendered.
   */
  renderHeader?: (params: GridColumnHeaderParams<V, R, F>) => React.ReactNode;
  /**
   * Header cell element alignment.
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
  filterOperators?: GridFilterOperator<R, V, F>[];
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
  colSpan?: number | ((params: GridCellParams<V, R, F>) => number | undefined);
}

export interface GridActionsColDef extends GridColDef {
  /**
   * Type allows to merge this object with a default definition [[GridColDef]].
   * @default 'actions'
   */
  type: 'actions';
  /**
   * Function that returns the actions to be shown.
   * @param {GridRowParams} params The params for each row.
   * @returns {React.ReactElement<GridActionsCellItemProps>[]} An array of [[GridActionsCell]] elements.
   */
  getActions: (params: GridRowParams) => React.ReactElement<GridActionsCellItemProps>[];
}

export type GridEnrichedColDef<R extends GridValidRowModel = any, V = any, F = V> =
  | GridColDef<R, V, F>
  | GridActionsColDef;

export type GridColumns<R extends GridValidRowModel = any> = GridEnrichedColDef<R>[];

export type GridColTypeDef<V = any, F = V> = Omit<GridColDef<V, any, F>, 'field'> & {
  extendType?: GridNativeColTypes;
};

export type GridStateColDef<R extends GridValidRowModel = any, V = any, F = V> = GridEnrichedColDef<
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
