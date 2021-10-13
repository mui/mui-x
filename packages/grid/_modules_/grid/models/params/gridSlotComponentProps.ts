import { GridState } from '../gridState';
import { GridApiRef } from '../api/gridApiRef';
import { GridColumns } from '../colDef/gridColDef';
import { GridRootContainerRef } from '../gridRootContainerRef';

/**
 * Object passed as React prop in the component override.
 */
export interface GridSlotComponentProps {
  /**
   * The GridState object containing the current grid state.
   */
  state: GridState;
  /**
   * The full set of columns.
   */
  columns: GridColumns;
  /**
   * GridApiRef that let you manipulate the grid.
   */
  apiRef: GridApiRef;
  /**
   * The ref of the inner div Element of the grid.
   */
  rootElement: GridRootContainerRef;
}
