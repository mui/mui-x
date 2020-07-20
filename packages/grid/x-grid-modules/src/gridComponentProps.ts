import { Columns, GridApiRef, GridComponentOverridesProp, GridOptions, RowsProp } from './models';

/**
 * Partial set of [[GridOptions]]
 */
export type GridOptionsProp = Partial<GridOptions>;

/**
 * The grid component react props interface. 
 */
export interface GridComponentProps {
  /**
   * set of rows of type [[RowsProp]]
   */
  rows: RowsProp;
  /**
   * set of columns of type [[Columns]]
   */
  columns: Columns;
  /**
   * set of options of type [[GridOptionsProp]]
   */
  options?: GridOptionsProp;
  /**
   * Overrideable components
   */
  components?: GridComponentOverridesProp;
  /**
   * the ref object that allows grid manipulation. Can be instantiated with [[gridApiRef()]]
   */
  apiRef?: GridApiRef;
  /**
   * boolean prop that toggle the loading overlay
   */
  loading?: boolean;
  /**
   * string prop that allows to pass extra Css class in the inner grid container.
   */
  className?: string;
  /**
   * @internal enum
   */
  licenseStatus: string;
}
