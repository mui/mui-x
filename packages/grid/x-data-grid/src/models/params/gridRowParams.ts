import { GridValidRowModel, GridRowEntry, GridRowId } from '../gridRows';
import type { GridColumns } from '../colDef/gridColDef';

/**
 * Object passed as parameter in the row callbacks.
 */
export interface GridRowParams<R extends GridValidRowModel = any> {
  /**
   * The grid row id.
   */
  id: GridRowId;
  /**
   * The row model of the row that the current cell belongs to.
   */
  row: R;
  /**
   * All grid columns.
   */
  columns: GridColumns;
  /**
   * Get the cell value of a row and field.
   * @param {GridRowId} id The row id.
   * @param {string} field The field.
   * @returns {any} The cell value.
   * @deprecated Use `params.row` to directly access the fields you want instead.
   */
  getValue: (id: GridRowId, field: string) => any;
}

interface GridRowVisibilityParams {
  /**
   * Whether this row is the first visible or not.
   */
  isFirstVisible: boolean;
  /**
   * Whether this row is the last visible or not.
   */
  isLastVisible: boolean;
  /**
   * Index of the row in the current page.
   * If the pagination is disabled, it will be the index relative to all filtered rows.
   */
  indexRelativeToCurrentPage: number;
}

/**
 * Object passed as parameter in the row `getRowClassName` callback prop.
 */
export interface GridRowClassNameParams<R extends GridValidRowModel = any>
  extends GridRowParams<R>,
    GridRowVisibilityParams {}

/**
 * Object passed as parameter in the row `getRowHeight` callback prop.
 */
export interface GridRowHeightParams extends GridRowEntry {
  /**
   * The grid current density factor.
   */
  densityFactor: number;
}

/**
 * The getRowHeight return value.
 */
export type GridRowHeightReturnValue = number | null | undefined;

enum GridRowEditStartReasons {
  enterKeyDown = 'enterKeyDown',
  cellDoubleClick = 'cellDoubleClick',
  printableKeyDown = 'printableKeyDown',
  deleteKeyDown = 'deleteKeyDown',
}

/**
 * Params passed to the `rowEditStart` event.
 */
export interface GridRowEditStartParams<R extends GridValidRowModel = any>
  extends GridRowParams<R> {
  /**
   * Which field triggered this event.
   * Only applied if `props.experimentalFeatures.newEditingApi: true`.
   */
  field?: string;
  /**
   * The reason for this event to be triggered.
   * Only applied if `props.experimentalFeatures.newEditingApi: true`.
   */
  reason?: GridRowEditStartReasons;
}

enum GridRowEditStopReasons {
  rowFocusOut = 'rowFocusOut',
  escapeKeyDown = 'escapeKeyDown',
  enterKeyDown = 'enterKeyDown',
  tabKeyDown = 'tabKeyDown',
  shiftTabKeyDown = 'shiftTabKeyDown',
}

export interface GridRowEditStopParams<R extends GridValidRowModel = any> extends GridRowParams<R> {
  /**
   * Which field triggered this event.
   * Only applied if `props.experimentalFeatures.newEditingApi: true`.
   */
  field?: string;
  /**
   * The reason for this event to be triggered.
   * Only applied if `props.experimentalFeatures.newEditingApi: true`.
   */
  reason?: GridRowEditStopReasons;
}

/**
 * Object passed as parameter in the row `getRowSpacing` callback prop.
 */
export interface GridRowSpacingParams extends GridRowEntry, GridRowVisibilityParams {}

/**
 * The getRowSpacing return value.
 */
export interface GridRowSpacing {
  top?: number;
  bottom?: number;
}

// https://github.com/mui/mui-x/pull/3738#discussion_r798504277
export { GridRowEditStartReasons, GridRowEditStopReasons };
