import { GridCellValue } from '../gridCell';
import { GridRowId } from '../gridRows';
import { GridCellParams } from '../params/gridCellParams';
import { GridColParams } from '../params/gridColParams';
import { GridRowParams } from '../params/gridRowParams';

export interface GridParamsApi {
  /**
   * Get the cell value of a row and field.
   * @param id
   * @param field
   */
  getCellValue: (id: GridRowId, field: string) => GridCellValue;
  /**
   * Get the cell DOM element.
   * @param id
   * @param field
   */
  getCellElement: (id: GridRowId, field: string) => HTMLDivElement | null;
  /**
   * Get the cell params that are passed in events.
   * @param id
   * @param field
   */
  getCellParams: (id: GridRowId, field: string) => GridCellParams;
  /**
   * Get the row params that are passed in events.
   * @param id
   * @param field
   */
  getRowParams: (id: GridRowId) => GridRowParams;
  /**
   * Get the row DOM element.
   * @param id
   * @param field
   */
  getRowElement: (id: GridRowId) => HTMLDivElement | null;
  /**
   * Get the column header DOM element.
   * @param field
   */
  getColumnHeaderElement: (field: string) => HTMLDivElement | null;
  /**
   * Get the header params that are passed in events.
   * @param field
   */
  getColumnHeaderParams: (field: string) => GridColParams;
}
