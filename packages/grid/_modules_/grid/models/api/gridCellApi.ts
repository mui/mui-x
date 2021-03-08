import { GridCellValue } from '../gridCell';
import { GridRowId } from '../gridRows';
import { GridCellParams } from '../params/gridCellParams';
import { GridRowParams } from '../params/gridRowParams';

export interface GridCellApi {
  /**
   * Get the cell value of a row and field.
   * @param id
   * @param field
   */
  getCellValue: (id: GridRowId, field: string) => GridCellValue;
  getCellElement: (id: GridRowId, field: string) => HTMLDivElement | null;
  getCellParams: (id: GridRowId, field: string) => GridCellParams;
  getRowParams: (id: GridRowId) => GridRowParams;
  getRowElement: (id: GridRowId) => HTMLDivElement | null;
}
