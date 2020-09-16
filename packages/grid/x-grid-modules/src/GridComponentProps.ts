import { Columns, ApiRef, GridComponentOverridesProp, GridOptions, RowsProp } from './models';

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
}
