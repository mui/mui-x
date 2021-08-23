import { GridState } from '../../hooks/features/core/gridState';
import { GridApiRef } from '../api/gridApiRef';
import { GridColumns } from '../colDef/gridColDef';
import { GridRootContainerRef } from '../gridRootContainerRef';
import { GridRowModel } from '../gridRows';
import { GridComponentProps } from '../../GridComponentProps';

/**
 * Object passed as React prop in the component override.
 */
export interface GridSlotComponentProps {
  /**
   * The GridState object containing the current grid state.
   */
  state: GridState;
  /**
   * The full set of rows.
   */
  rows: GridRowModel[];
  /**
   * The full set of columns.
   */
  columns: GridColumns;
  /**
   * The processed props passed to the grid component
   * It includes all the default values
   */
  rootProps: GridComponentProps;
  /**
   * GridApiRef that let you manipulate the grid.
   */
  apiRef: GridApiRef;
  /**
   * The ref of the inner div Element of the grid.
   */
  rootElement: GridRootContainerRef;
}
