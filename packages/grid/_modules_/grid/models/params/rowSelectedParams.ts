import { RowModel } from '../rows';

/**
 * Object passed as parameter as the row selected event handler.
 */
export interface RowSelectedParams {
  /**
   * The row data of the row that triggers the event.
   */
  data: RowModel;
  /**
   * The selected state of the row that triggers the event.
   */
  isSelected: boolean;
}
