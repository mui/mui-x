import { GridCellValue } from '../gridCell';
import { GridRowId, GridRowModel } from '../gridRows';
import type { GridColumns } from '../colDef';

/**
 * Object passed as parameter in the row callbacks.
 */
export interface GridRowParams<R extends GridRowModel = GridRowModel> {
  /**
   * The grid row id.
   */
  id: GridRowId;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: R;
  /**
   * All grid columns.
   */
  columns: GridColumns;
  /**
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {GridCellValue} The cell value.
   */
  getValue: (id: GridRowId, field: string) => GridCellValue;
}

/**
 * Object passed as parameter in the row getRowHeight callback.
 */
export interface GridRowHeightParams extends GridRowModel {
  /**
   * The grid current density factor.
   */
  densityFactor: number;
}

/**
 * The getRowHeight return value.
 */
export type GridRowHeightReturnValue = number | null | undefined;
