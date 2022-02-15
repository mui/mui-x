import { GridCellMode, GridCellValue } from '../gridCell';
import { GridRowId, GridRowModel, GridRowTreeNodeConfig } from '../gridRows';
import type { GridStateColDef } from '../colDef/gridColDef';
import { GridEditCellProps } from '../gridEditRowModel';
import type { GridApiCommon } from '../api/gridApiCommon';
import type { GridApiCommunity } from '../api/gridApiCommunity';

/**
 * Object passed as parameter in the column [[GridColDef]] cell renderer.
 */
export interface GridCellParams<
  V = any,
  R = any,
  F = V,
  Api extends GridApiCommon = GridApiCommunity,
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
   * The cell value, but if the column has valueGetter, use getValue.
   */
  value: V;
  /**
   * The cell value formatted with the column valueFormatter.
   */
  formattedValue: F;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: GridRowModel<R>;
  /**
   * The node of the row that the current cell belongs to.
   */
  rowNode: GridRowTreeNodeConfig;
  /**
   * The column of the row that the current cell belongs to.
   */
  colDef: GridStateColDef<Api>;
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
   * @returns {GridCellValue} The cell value.
   * @deprecated Use `params.row` to directly access the fields you want instead.
   */
  getValue: (id: GridRowId, field: string) => GridCellValue;
}

/**
 * GridCellParams containing api.
 */
export interface GridRenderCellParams<
  V = any,
  R = any,
  F = V,
  Api extends GridApiCommon = GridApiCommunity,
> extends GridCellParams<V, R, F, Api> {
  /**
   * GridApi that let you manipulate the grid.
   */
  api: Api;
}

/**
 * GridEditCellProps containing api.
 */
export interface GridRenderEditCellParams<Api extends GridApiCommon = GridApiCommunity>
  extends GridEditCellProps {
  /**
   * GridApi that let you manipulate the grid.
   */
  api: Api;
}

/**
 * Parameters passed to `colDef.valueGetter`.
 */
export interface GridValueGetterParams<
  V = any,
  R = any,
  Api extends GridApiCommon = GridApiCommunity,
> extends Omit<GridCellParams<V, R, any, Api>, 'formattedValue' | 'isEditable'> {
  /**
   * GridApi that let you manipulate the grid.
   */
  api: Api;
}

/**
 * @deprecated Use `GridValueGetterParams` instead.
 */
export type GridValueGetterFullParams<
  V = any,
  R = any,
  Api extends GridApiCommon = GridApiCommunity,
> = GridValueGetterParams<V, R, Api>;

/**
 * Object passed as parameter in the column [[GridColDef]] value setter callback.
 */
export interface GridValueSetterParams {
  /**
   * The new cell value.
   */
  value: GridCellValue;
  /**
   * The row that is being edited.
   */
  row: GridRowModel;
}

/**
 * Object passed as parameter in the column [[GridColDef]] value formatter callback.
 */
export interface GridValueFormatterParams<Api extends GridApiCommon = GridApiCommunity> {
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
  value: GridCellValue;
  /**
   * GridApi that let you manipulate the grid.
   */
  api: Api;
}

/**
 * Object passed as parameter in the column [[GridColDef]] edit cell props change callback.
 */
export interface GridPreProcessEditCellProps {
  /**
   * The grid row id.
   */
  id: GridRowId;
  /**
   * The row that is being edited.
   */
  row: GridRowModel;
  /**
   * The edit cell props.
   */
  props: GridEditCellProps;
}
