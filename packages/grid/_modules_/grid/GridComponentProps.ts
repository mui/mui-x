import { GridState } from './hooks/features/core/gridState';
import { ApiRef } from './models/api/apiRef';
import { Columns } from './models/colDef/colDef';
import { GridComponentOverridesProp } from './models/gridComponentOverridesProp';
import { GridOptions } from './models/gridOptions';
import { StateChangeParams } from './models/params/stateChangeParams';
import { RowsProp } from './models/rows';

/**
 * Partial set of [[GridOptions]].
 */
export type GridOptionsProp = Partial<GridOptions>;

/**
 * The grid component react props interface.
 */
export interface GridComponentProps extends GridOptionsProp {
  /**
   * Set of rows of type [[RowsProp]].
   */
  rows: RowsProp;
  /**
   * Set of columns of type [[Columns]].
   */
  columns: Columns;
  /**
   * Overrideable components.
   */
  components?: GridComponentOverridesProp;
  /**
   * The ref object that allows grid manipulation. Can be instantiated with [[useApiRef()]].
   */
  apiRef?: ApiRef;
  /**
   * If `true`, a  loading overlay is displayed.
   */
  loading?: boolean;
  /**
   * @ignore
   */
  className?: string;
  /**
   * @internal enum
   */
  licenseStatus: string;
  /**
   * An error that will turn the grid into its error state and display the error component.
   */
  error?: any;
  /**
   * Set the whole state of the grid.
   */
  state?: Partial<GridState>;
  /**
   * Set a callback fired when the state of the grid is updated.
   */
  onStateChange?: (params: StateChangeParams) => void; // We are overriding the handler in GridOptions to fix the params type and avoid the cycle dependency
}
