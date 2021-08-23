import { GridCellValue } from '../gridCell';
import { GridRowId, GridRowModel } from '../gridRows';
import type { GridColumns } from '../colDef';

/**
 * Object passed as parameter in the row callbacks.
 */
export interface GridRowParams<RowDataType = any> {
  /**
   * The grid row id.
   */
  id: GridRowId;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: GridRowModel<RowDataType>;
  /**
   * All grid columns.
   */
  columns: GridColumns;
  /**
   * Get the cell value of a row and field.
   * @param id
   * @param field
   */
  getValue: (id: GridRowId, field: string) => GridCellValue;
}
