import { GridOptionsProp } from '../../_modules_/grid/GridComponentProps';
import { GridState } from '../../_modules_/grid/hooks/features/core/gridState';
import { GridColumns } from '../../_modules_/grid/models/colDef/gridColDef';
import { GridRowId, GridRowIdGetter, GridRowsProp } from '../../_modules_/grid/models/gridRows';
import { GridSlotsComponent } from '../../_modules_/grid/models/gridSlotsComponent';
import { GridSlotsComponentsProps } from '../../_modules_/grid/models/gridSlotsComponentsProps';
import { GridStateChangeParams } from '../../_modules_/grid/models/params/gridStateChangeParams';

export const MAX_PAGE_SIZE = 100;

/**
 * The grid component react props interface.
 */
export interface DataGridProps extends GridOptionsProp {
  /**
   * The label of the grid.
   */
  'aria-label'?: string;
  /**
   * The id of the element containing a label for the grid.
   */
  'aria-labelledby'?: string;
  /**
   * @ignore
   */
  className?: string;
  /**
   * Set of columns of type [[GridColumns]].
   */
  columns: GridColumns;
  /**
   * Overrideable components.
   */
  components?: GridSlotsComponent;
  /**
   * Overrideable components props dynamically passed to the component at rendering.
   */
  componentsProps?: GridSlotsComponentsProps;
  /**
   * An error that will turn the grid into its error state and display the error component.
   */
  error?: any;
  /**
   * Return the id of a given [[GridRowData]].
   */
  getRowId?: GridRowIdGetter;
  /**
   * @internal enum
   */
  licenseStatus: string;
  /**
   * If `true`, a  loading overlay is displayed.
   */
  loading?: boolean;
  /**
   * Nonce of the inline styles for [Content Security Policy](https://www.w3.org/TR/2016/REC-CSP2-20161215/#script-src-the-nonce-attribute).
   */
  nonce?: string;
  /**
   * Set a callback fired when the state of the grid is updated.
   */
  onStateChange?: (params: GridStateChangeParams) => void; // We are overriding the handler in GridOptions to fix the params type and avoid the cycle dependency
  /**
   * Set of rows of type [[GridRowsProp]].
   */
  rows: GridRowsProp;
  /**
   * Set the whole state of the grid.
   */
  state?: Partial<GridState>;
  /**
   * @ignore
   */
  style?: React.CSSProperties;

  apiRef: undefined;
  disableColumnResize: true;
  disableColumnReorder: true;
  disableMultipleColumnsFiltering: true;
  disableMultipleColumnsSorting: true;
  disableMultipleSelection: true;
  pagination: true;
  onRowsScrollEnd: undefined;
  checkboxSelectionVisibleOnly: false;
  selectionModel?: GridRowId | GridRowId[];

}
