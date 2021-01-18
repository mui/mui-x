import { GridState } from '../../hooks/features/core/gridState';
import { ApiRef } from '../api/apiRef';
import { Columns } from '../colDef/colDef';
import { GridOptions } from '../gridOptions';
import { RootContainerRef } from '../rootContainerRef';
import { RowModel } from '../rows';

/**
 * Object passed as React prop in the component override.
 */
export interface BaseComponentProps {
  /**
   * The GridState object containing the current grid state.
   */
  state: GridState;
  /**
   * The full set of rows.
   */
  rows: RowModel[];
  /**
   * The full set of columns.
   */
  columns: Columns;
  /**
   * The full set of options.
   */
  options: GridOptions;
  /**
   * ApiRef that let you manipulate the grid.
   */
  api: ApiRef;
  /**
   * The ref of the inner div Element of the grid.
   */
  rootElement: RootContainerRef;
}
