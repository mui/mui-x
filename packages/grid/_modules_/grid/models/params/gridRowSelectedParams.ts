import { GridRowModel } from '../gridRows';

/**
 * Object passed as parameter as the row selected event handler.
 */
export interface GridRowSelectedParams {
  /**
   * The row data of the row that triggers the event.
   */
  data: GridRowModel;
  /**
   * The selected state of the row that triggers the event.
   */
  isSelected: boolean;
  /**
   * GridApiRef that let you manipulate the grid.
   */
  api: any;
}
