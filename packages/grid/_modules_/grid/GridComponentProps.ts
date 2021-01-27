import { GridState } from './hooks/features/core/gridState';
import { ApiRef } from './models/api/apiRef';
import { Columns } from './models/colDef/colDef';
import { GridSlotsComponent } from './models/gridSlotsComponent';
import { GridOptions } from './models/gridOptions';
import { GridSlotsComponentsProps } from './models/gridSlotsComponentsProps';
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
   * The ref object that allows grid manipulation. Can be instantiated with [[useApiRef()]].
   */
  apiRef?: ApiRef;
  /**
   * Set of columns of type [[Columns]].
   */
  columns: Columns;
  /**
   * Overrideable components.
   */
  components?: GridSlotsComponent;
  /**
   * Overrideable components props dynamic passed to the component at rendering.
   */
  componentsProps?: GridSlotsComponentsProps;
  /**
   * @ignore
   */
  className?: string;
  /**
   * An error that will turn the grid into its error state and display the error component.
   */
  error?: any;
  /**
   * Nonce of the inline styles for [Content Security Policy](https://www.w3.org/TR/2016/REC-CSP2-20161215/#script-src-the-nonce-attribute).
   */
  nonce?: string;
  /**
   * @internal enum
   */
  licenseStatus: string;
  /**
   * If `true`, a  loading overlay is displayed.
   */
  loading?: boolean;
  /**
   * Set a callback fired when the state of the grid is updated.
   */
  onStateChange?: (params: StateChangeParams) => void; // We are overriding the handler in GridOptions to fix the params type and avoid the cycle dependency
  /**
   * Set of rows of type [[RowsProp]].
   */
  rows: RowsProp;
  /**
   * Set the whole state of the grid.
   */
  state?: Partial<GridState>;
}
