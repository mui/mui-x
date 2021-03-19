import { GridState } from '../../hooks/features/core/gridState';
import { GridApiRef } from '../api/gridApiRef';
import { GridColumns } from '../colDef/gridColDef';
import { GridOptions } from '../gridOptions';
import { GridRootContainerRef } from '../gridRootContainerRef';
import { GridRowModel } from '../gridRows';

/**
 * Enum listing the grid base component props.
 */
export enum GridBaseComponentPropsEnum {
  state = 'state',
  rows = 'rows',
  columns = 'columns',
  options = 'options',
  api = 'api',
  rootElement = 'rootElement',
}

/**
 * Object passed as React prop in the component override.
 */
export interface GridBaseComponentProps {
  /**
   * The GridState object containing the current grid state.
   */
  [GridBaseComponentPropsEnum.state]: GridState;
  /**
   * The full set of rows.
   */
  [GridBaseComponentPropsEnum.rows]: GridRowModel[];
  /**
   * The full set of columns.
   */
  [GridBaseComponentPropsEnum.columns]: GridColumns;
  /**
   * The full set of options.
   */
  [GridBaseComponentPropsEnum.options]: GridOptions;
  /**
   * GridApiRef that let you manipulate the grid.
   */
  [GridBaseComponentPropsEnum.api]: GridApiRef;
  /**
   * The ref of the inner div Element of the grid.
   */
  [GridBaseComponentPropsEnum.rootElement]: GridRootContainerRef;
}
