import { RowData } from '../rows';

/**
 * Object passed as parameter as the row selected event handler.
 */
export interface RowSelectedParams {
  /**
   * The row data of the row that triggers the event.
   */
  data: RowData;
  /**
   * The row index of the row that triggers the event.
   */
  rowIndex: number;
  /**
   * The selected state of the row that triggers the event.
   */
  isSelected: boolean;
}
