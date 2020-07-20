import { RowData } from '../rows';

/**
 * Object passed as parameter as the selection changed event handler.
 */
export interface SelectionChangedParams {
  /**
   * The set of rows that had their selection state changed.
   */
  rows: RowData[];
}
