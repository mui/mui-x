import type { GridColDef, GridColumnDimensions, GridRowId } from '@mui/x-data-grid-pro';

/**
 * The result type of a computed column. Drives the column `type` of the generated column.
 */
export type GridComputedColumnType = 'number' | 'string' | 'boolean' | 'date' | 'dateTime';

/**
 * The serializable definition of a computed column.
 */
export interface GridComputedColumnDefinition {
  /**
   * The field of the generated column. Must be unique among all the columns of the grid.
   */
  field: string;
  /**
   * The header name of the generated column.
   */
  headerName: string;
  /**
   * The formula evaluated for every row, including its leading `=`.
   * For example `'=price * quantity'`.
   */
  formula: string;
  /**
   * The result type of the column.
   */
  type: GridComputedColumnType;
  /**
   * The format applied to the results of a `'number'` column.
   */
  numberFormat?: Intl.NumberFormatOptions;
  /**
   * The description of the generated column, shown as the header tooltip.
   */
  description?: string;
  /**
   * If `false`, end users cannot edit or remove the column from the formula editor, the column menu, or the panel; the editor opens read-only.
   * The API and the controlled model are not affected.
   * Not related to cell editing: the cells of a computed column are never editable.
   * @default true
   */
  editable?: boolean;
}

export type GridComputedColumnsModel = GridComputedColumnDefinition[];

type GridComputedColumnOwnProperty =
  // Set by the grid on every computed column.
  | 'field'
  | 'type'
  | 'computed'
  | 'editable'
  | 'allowFormulas'
  | 'valueGetter'
  | 'valueSetter'
  | 'groupingValueGetter'
  | 'rowSpanValueGetter'
  // Only called for editable cells (unlike `valueParser`, which also parses the filter values).
  | 'renderEditCell'
  | 'preProcessEditCellProps'
  | 'pastedValueParser';

/**
 * The column definition properties that `computedColDef` can set on a computed column.
 * The properties that make it a computed column are set by the grid, and its cells are
 * never edited or pasted into: both are typed `never`.
 */
export type GridComputedColDefOverrides =
  // A plain `Omit` keeps the keys every column type has: a computed column is never an
  // `actions` or a `singleSelect` one, so `getActions` or `valueOptions` would do nothing.
  Omit<Partial<GridColDef>, GridComputedColumnOwnProperty> & {
    // `never` rather than only omitted: the omitted keys of an object returned by a
    // function or held by a variable are not reported.
    [Property in GridComputedColumnOwnProperty]?: never;
  };

export interface GridComputedColumnsState {
  model: GridComputedColumnsModel;
  /**
   * Bumped by the formula feature whenever the results of the computed cells must be read again.
   */
  revision: number;
}

export interface GridComputedColumnsInitialState {
  model?: GridComputedColumnsModel;
}

export type GridComputedColumnValidationCode =
  | 'nameRequired'
  | 'fieldRequired'
  | 'fieldInvalid'
  | 'fieldExists'
  | 'fieldA1Like'
  | 'formulaRequired'
  | 'parseError'
  | 'unknownFunction'
  | 'unsupportedReference'
  | 'unknownField'
  | 'selfReference'
  | 'cycle'
  | 'featureMissing';

export interface GridComputedColumnValidationIssue {
  code: GridComputedColumnValidationCode;
  /**
   * The localized message, ready to display.
   */
  message: string;
  /**
   * The location of a `parseError`, in formula-source coordinates (including the leading `=`).
   */
  span?: { start: number; end: number };
  /**
   * The field an `unknownField` or `fieldExists` issue is about.
   */
  field?: string;
  /**
   * The fields of a `cycle`, for example `['total', 'tax', 'total']`.
   */
  path?: string[];
}

export interface GridComputedColumnValidationResult {
  valid: boolean;
  issues: GridComputedColumnValidationIssue[];
}

/**
 * The request left by `showComputedColumnEditor()` for the computed columns panel.
 */
export interface GridComputedColumnEditorRequest {
  /**
   * The field of the computed column to edit, `null` to create a new one.
   */
  field: string | null;
  sampleRowId?: GridRowId;
  columnIndex?: number;
}

/**
 * Where a computed column stood right before its definition was dropped, so that the
 * history operation bringing the definition back puts the column where the user had it.
 */
export interface GridComputedColumnSnapshot {
  field: string;
  /**
   * The index of the column among all the columns, hidden ones included.
   */
  index: number;
  /**
   * The width the user gave the column. Left out when the column was never resized:
   * the width of the definition (or of `computedColDef`) applies again.
   */
  width?: number;
  visible: boolean;
}

export interface GridComputedColumnsInternalCache {
  editorRequest: GridComputedColumnEditorRequest | null;
  /**
   * The id the computed columns panel gets when it opens without one, so that the
   * `aria-controls` of the toolbar trigger resolves however the panel was opened (the
   * trigger, a column menu, a cell gesture, `showComputedColumnEditor()`). Unique per grid:
   * built from the instance id of the grid.
   */
  panelId: string;
  /**
   * The index requested through `addComputedColumn()` for columns that are not
   * part of the columns state yet. Consumed by the formula feature when it
   * inserts the column — with a controlled model, that only happens once the
   * parent has echoed the new model back through the `computedColumns` prop.
   */
  pendingColumnIndexes: Map<string, number>;
  /**
   * The dimensions `restoreState()` holds for computed columns that are not part of the
   * columns state yet: with a controlled model, the columns restore runs before the parent
   * has echoed the restored model, so the dimensions of its new columns wait here (as
   * exported, `-1` standing for `Infinity`) and are applied when the columns are inserted.
   */
  pendingColumnDimensions: Map<string, GridColumnDimensions>;
  /**
   * The model `setComputedColumns()` found in the state right before its last update,
   * whether that update was applied or is waiting for the parent to echo it. The history
   * handler reads it when the `computedColumnsChange` event arrives, after the state
   * already holds the new model: it is the previous model of the step, whatever handler
   * instance records it and whether or not the history was recording at the time.
   */
  previousModel: GridComputedColumnsModel | null;
  /**
   * The model an undo or redo asked a controlled parent to echo, with the columns to
   * restore once the echo is hydrated. The echoed `computedColumnsChange` is the
   * operation itself, not a new step. At most one echo is pending: replacing or clearing
   * it removes its listener.
   */
  historyEcho: {
    model: GridComputedColumnsModel;
    columns: GridComputedColumnSnapshot[];
    /**
     * Restores the columns once the state holds the echoed model. Subscribed to
     * `columnsChange` while the effects of the grid are mounted.
     */
    listener: () => void;
    unsubscribe: () => void;
  } | null;
  /**
   * The model of the last undoable change (made from the grid UI, or passed with `undoable`)
   * until `setComputedColumns()` applies it: the history handler records a change as a step
   * only when it is this one. With a controlled model, it waits for the parent to echo it;
   * any other model (the parent rejected or rewrote the change, or a change that is not
   * undoable) drops it.
   */
  userModel: GridComputedColumnsModel | null;
}

/**
 * The computed columns API interface that is available in the grid `apiRef`.
 */
export interface GridComputedColumnsApi {
  /**
   * Sets the computed columns model.
   * @param {GridComputedColumnsModel | ((prev: GridComputedColumnsModel) => GridComputedColumnsModel)} model The new model, or a function returning it from the current one.
   * @param {object} options The options of the change.
   * @param {boolean} options.undoable Whether the change is an undo step, as a change made from the grid UI. Defaults to `false`. An explicit `false` is never recorded, even when the new model equals a change made from the grid UI that a controlled parent has not applied yet.
   */
  setComputedColumns: (
    model:
      GridComputedColumnsModel | ((prev: GridComputedColumnsModel) => GridComputedColumnsModel),
    options?: { undoable?: boolean },
  ) => void;
  /**
   * Adds a computed column.
   * @param {GridComputedColumnDefinition} definition The definition of the computed column.
   * @param {object} options The options of the insertion.
   * @param {number} options.columnIndex The index to insert the column at. The column is appended by default.
   * @param {boolean} options.undoable Whether the change is an undo step, as a change made from the grid UI. Defaults to `false`. An explicit `false` is never recorded, even when the new model equals a change made from the grid UI that a controlled parent has not applied yet.
   */
  addComputedColumn: (
    definition: GridComputedColumnDefinition,
    options?: { columnIndex?: number; undoable?: boolean },
  ) => void;
  /**
   * Updates the definition of a computed column.
   * @param {string} field The field of the computed column to update.
   * @param {Partial<Omit<GridComputedColumnDefinition, 'field'>>} changes The properties to update.
   * @param {object} options The options of the change.
   * @param {boolean} options.undoable Whether the change is an undo step, as a change made from the grid UI. Defaults to `false`. An explicit `false` is never recorded, even when the new model equals a change made from the grid UI that a controlled parent has not applied yet.
   */
  updateComputedColumn: (
    field: string,
    changes: Partial<Omit<GridComputedColumnDefinition, 'field'>>,
    options?: { undoable?: boolean },
  ) => void;
  /**
   * Removes a computed column.
   * @param {string} field The field of the computed column to remove.
   * @param {object} options The options of the change.
   * @param {boolean} options.undoable Whether the change is an undo step, as a change made from the grid UI. Defaults to `false`. An explicit `false` is never recorded, even when the new model equals a change made from the grid UI that a controlled parent has not applied yet.
   */
  removeComputedColumn: (field: string, options?: { undoable?: boolean }) => void;
  /**
   * Opens the computed column editor in the sidebar.
   * @param {string | null} field The field of the computed column to edit. Omit it, or pass `null`, to create a new computed column.
   * @param {object} options The options of the editor.
   * @param {GridRowId} options.sampleRowId The id of the row used for the preview.
   * @param {number} options.columnIndex The index a new column is inserted at.
   */
  showComputedColumnEditor: (
    field?: string | null,
    options?: { sampleRowId?: GridRowId; columnIndex?: number },
  ) => void;
  /**
   * Closes the computed columns panel.
   */
  hideComputedColumnEditor: () => void;
  /**
   * Validates the definition of a computed column against the current columns.
   * @param {GridComputedColumnDefinition} definition The definition to validate.
   * @returns {GridComputedColumnValidationResult} The validation result.
   */
  validateComputedColumn: (
    definition: GridComputedColumnDefinition,
  ) => GridComputedColumnValidationResult;
}

/**
 * Registered by the formula feature — absent when the feature is not provided
 * through `featureDependencies`.
 */
export interface GridComputedColumnsPrivateApi {
  /**
   * Validates a definition against the current columns and the other computed columns.
   * @param {GridComputedColumnDefinition} definition The definition to validate.
   * @param {object} options The validation options.
   * @param {string} options.ignoreField The field of the stored definition being edited, excluded from the uniqueness check.
   * @returns {GridComputedColumnValidationResult} The validation result.
   */
  validateComputedColumnDefinition: (
    definition: GridComputedColumnDefinition,
    options?: { ignoreField?: string },
  ) => GridComputedColumnValidationResult;
  /**
   * Returns the validation issues of a stored definition.
   * @param {string} field The field of the computed column.
   * @returns {GridComputedColumnValidationIssue[]} The issues of the stored definition.
   */
  getComputedColumnIssues: (field: string) => GridComputedColumnValidationIssue[];
}
