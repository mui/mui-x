import { GridCellValue } from '../gridCell';
import { GridRowEntry, GridRowId, GridRowModel } from '../gridRows';
import type { GridColumns } from '../colDef/gridColDef';

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
   * @deprecated Use `params.row` to directly access the fields you want instead.
   */
  getValue: (id: GridRowId, field: string) => GridCellValue;
}

/**
 * Object passed as parameter in the row getRowHeight callback.
 */
export interface GridRowHeightParams extends GridRowEntry {
  /**
   * The grid current density factor.
   */
  densityFactor: number;
}

/**
 * The getRowHeight return value.
 */
export type GridRowHeightReturnValue = number | null | undefined;
