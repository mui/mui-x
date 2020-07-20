import { Rows } from '../rows';
import { Columns } from '../colDef/colDef';
import { GridOptions } from '../gridOptions';
import { GridApiRef, GridRootRef } from '../api/gridApiRef';
import { PaginationProps } from '../../hooks/features/usePagination';

/**
 * Object passed as React prop in the component override.
 */
export interface ComponentParams {
  /**
   * The object containing all pagination details in [[PaginationProps]]
   */
  paginationProps: PaginationProps;
  /**
   * The full set of rows
   */
  rows: Rows;
  /**
   * The full set of columns
   */
  columns: Columns;
  /**
   * The full set of options
   */
  options: GridOptions;
  /**
   * ApiRef that let you manipulate the grid
   */
  api: GridApiRef;
  /**
   * The ref of the inner div Element of the grid
   */
  rootElement: GridRootRef;
}
