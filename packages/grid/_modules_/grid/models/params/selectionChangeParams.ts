import { RowModel } from '../rows';

/**
 * Object passed as parameter as the selection change event handler.
 */
export interface SelectionChangeParams {
  /**
   * The set of rows that had their selection state change.
   */
  selectedRows: RowModel[];
  /**
   * ApiRef that let you manipulate the grid.
   */
  api: any;
}
