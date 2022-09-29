import * as React from 'react';
import { GridCellMode } from '../gridCell';
import {
  GridRowId,
  GridRowModel,
  GridTreeNode,
  GridTreeNodeWithRender,
  GridValidRowModel,
} from '../gridRows';
import type { GridStateColDef } from '../colDef/gridColDef';
import { GridEditCellProps } from '../gridEditRowModel';

/**
 * Object passed as parameter in the column [[GridColDef]] cell renderer.
 */
export interface GridCellParams<
  V = any,
  R extends GridValidRowModel = any,
  F = V,
  N extends GridTreeNode = GridTreeNode,
> {
  /**
   * The grid row id.
   */
  id: GridRowId;
  /**
   * The column field of the cell that triggered the event.
   */
  field: string;
  /**
   * The cell value.
   * If the column has `valueGetter`, use `params.row` to directly access the fields.
   */
  value?: V | undefined;
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue?: F | undefined;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: GridRowModel<R>;
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: N;
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: GridStateColDef;
  /**
   * If true, the cell is editable.
   */
  isEditable?: boolean;
  /**
   * The mode of the cell.
   */
  cellMode: GridCellMode;
  /**
   * If true, the cell is the active element.
   */
  hasFocus: boolean;
  /**
   * the tabIndex value.
   */
  tabIndex: 0 | -1;
  /**
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {any} The cell value.
   * @deprecated Use `params.row` to directly access the fields you want instead.
   */
  getValue: (id: GridRowId, field: string) => any;
}

export interface FocusElement {
  focus(): void;
}

/**
 * GridCellParams containing api.
 */
export interface GridRenderCellParams<
  V = any,
  R extends GridValidRowModel = any,
  F = V,
  N extends GridTreeNodeWithRender = GridTreeNodeWithRender,
> extends GridCellParams<V, R, F, N> {
  /**
   * GridApi that let you manipulate the grid.
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api: any;
  /**
   * A ref allowing to set imperative focus.
   * It can be passed to the element that should receive focus.
   * @ignore - do not document.
   */
  focusElementRef?: React.Ref<FocusElement>;
}

/**
 * GridEditCellProps containing api.
 */
export interface GridRenderEditCellParams<
  V = any,
  R extends GridValidRowModel = any,
  F = V,
  N extends GridTreeNodeWithRender = GridTreeNodeWithRender,
> extends GridCellParams<V, R, F, N>,
    GridEditCellProps<V> {
  /**
   * GridApi that let you manipulate the grid.
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api: any;
}

/**
 * Parameters passed to `colDef.valueGetter`.
 */
export interface GridValueGetterParams<
  V = any,
  R extends GridValidRowModel = GridValidRowModel,
  N extends GridTreeNodeWithRender = GridTreeNodeWithRender,
> extends Omit<GridCellParams<V, R, any, N>, 'formattedValue' | 'isEditable'> {
  /**
   * GridApi that let you manipulate the grid.
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api: any;
  /**
   * The default value for the cell that the `valueGetter` is overriding.
   */
  value: GridCellParams<V, R, any>['value'];
}

/**
 * Object passed as parameter in the column [[GridColDef]] value setter callback.
 */
export interface GridValueSetterParams<R extends GridValidRowModel = any, V = any> {
  /**
   * The new cell value.
   */
  value: V;
  /**
   * The row that is being edited.
   */
  row: R;
}

/**
 * Object passed as parameter in the column [[GridColDef]] value formatter callback.
 */
export interface GridValueFormatterParams<V = any> {
  /**
   * The grid row id.
   * It is not available when the value formatter is called by the filter panel.
   */
  id?: GridRowId;
  /**
   * The column field of the cell that triggered the event.
   */
  field: string;
  /**
   * The cell value, if the column has valueGetter it is the value returned by it.
   */
  value: V;
  /**
   * GridApi that let you manipulate the grid.
   * @deprecated Use the `apiRef` returned by `useGridApiContext` or `useGridApiRef` (only available in `@mui/x-data-grid-pro`)
   */
  api: any;
}

/**
 * Object passed as parameter in the column [[GridColDef]] edit cell props change callback.
 */
export interface GridPreProcessEditCellProps<V = any, R extends GridValidRowModel = any> {
  /**
   * The grid row id.
   */
  id: GridRowId;
  /**
   * The row that is being edited.
   */
  row: GridRowModel<R>;
  /**
   * The edit cell props.
   */
  props: GridEditCellProps<V>;
  /**
   * Whether the new value is different from the stored value or not.
   */
  hasChanged?: boolean;
  /**
   * Object containing the props of the other fields.
   * Only available for row editing and when using the new editing API.
   */
  otherFieldsProps?: Record<string, GridEditCellProps<V>>;
}
