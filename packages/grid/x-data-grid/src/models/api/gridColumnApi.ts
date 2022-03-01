import { GridColDef, GridColumnsMeta, GridStateColDef } from '../colDef/gridColDef';
import type { GridColumnVisibilityModel } from '../../hooks/features/columns/gridColumnsInterfaces';
import type { GridApiCommon } from './gridApiCommon';

/**
 * The column API interface that is available in the grid [[apiRef]].
 * TODO: Differentiate interfaces based on the plan
 */
export interface GridColumnApi {
  /**
   * Returns the [[GridColDef]] for the given `field`.
   * @param {string} field The column field.
   * @returns {{GridStateColDef}} The [[GridStateColDef]].
   */
  getColumn: <Api extends GridApiCommon = GridApiCommon>(field: string) => GridStateColDef<Api>;
  /**
   * Returns an array of [[GridColDef]] containing all the column definitions.
   * @returns {GridStateColDef[]} An array of [[GridStateColDef]].
   */
  getAllColumns: <Api extends GridApiCommon = GridApiCommon>() => GridStateColDef<Api>[];
  /**
   * Returns the currently visible columns.
   * @returns {GridStateColDef[]} An array of [[GridStateColDef]].
   */
  getVisibleColumns: <Api extends GridApiCommon = GridApiCommon>() => GridStateColDef<Api>[];
  /**
   * Returns the [[GridColumnsMeta]] for each column.
   * @returns {GridColumnsMeta[]} All [[GridColumnsMeta]] objects.
   * @deprecatedUse Use `gridColumnsTotalWidthSelector` or `gridColumnPositionsSelector` selectors instead.
   */
  getColumnsMeta: () => GridColumnsMeta;
  /**
   * Returns the index position of a column. By default, only the visible columns are considered.
   * Pass `false` to `useVisibleColumns` to consider all columns.
   * @param {string} field The column field.
   * @param {boolean} useVisibleColumns Determines if all columns or the visible ones should be considered. Default is `true`.
   * @returns {number} The index position.
   */
  getColumnIndex: (field: string, useVisibleColumns?: boolean) => number;
  /**
   * Returns the left-position of a column relative to the inner border of the grid.
   * @param {string} field The column field.
   * @returns {number} The position in pixels.
   */
  getColumnPosition: (field: string) => number;
  /**
   * Updates the definition of a column.
   * @param {GridColDef} col The new [[GridColDef]] object.
   * @deprecated Use `apiRef.current.updateColumns` instead.
   */
  updateColumn: <Api extends GridApiCommon = GridApiCommon>(col: GridColDef<Api>) => void;
  /**
   * Updates the definition of multiple columns at the same time.
   * @param {GridColDef[]} cols The new column [[GridColDef]] objects.
   */
  updateColumns: <Api extends GridApiCommon = GridApiCommon>(cols: GridColDef<Api>[]) => void;
  /**
   * Sets the column visibility model to the one given by `model`.
   * @param {GridColumnVisibilityModel} model The new visible columns model.
   */
  setColumnVisibilityModel: (model: GridColumnVisibilityModel) => void;
  /**
   * Changes the visibility of the column referred by `field`.
   * @param {string} field The column to change visibility.
   * @param {boolean} isVisible Pass `true` to show the column, or `false` to hide it. Default is `false`
   */
  setColumnVisibility: (field: string, isVisible: boolean) => void;
  /**
   * Moves a column from its original position to the position given by `targetIndexPosition`.
   * @param {string} field The field name
   * @param {number} targetIndexPosition The new position (0-based).
   */
  setColumnIndex: (field: string, targetIndexPosition: number) => void;
  /**
   * Updates the width of a column.
   * @param {string} field The column field.
   * @param {number} width The new width.
   */
  setColumnWidth: (field: string, width: number) => void;
}
