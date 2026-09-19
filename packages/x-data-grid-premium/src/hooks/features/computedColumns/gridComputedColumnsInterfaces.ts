import type { GridRowId } from '@mui/x-data-grid-pro';

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
}

export type GridComputedColumnsModel = GridComputedColumnDefinition[];

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

export interface GridComputedColumnsInternalCache {
  editorRequest: GridComputedColumnEditorRequest | null;
  /**
   * The index requested through `addComputedColumn()` for columns that are not
   * part of the columns state yet. Consumed by the formula feature when it
   * inserts the column — with a controlled model, that only happens once the
   * parent has echoed the new model back through the `computedColumns` prop.
   */
  pendingColumnIndexes: Map<string, number>;
}

/**
 * The computed columns API interface that is available in the grid `apiRef`.
 */
export interface GridComputedColumnsApi {
  /**
   * Sets the computed columns model.
   * @param {GridComputedColumnsModel | ((prev: GridComputedColumnsModel) => GridComputedColumnsModel)} model The new model, or a function returning it from the current one.
   */
  setComputedColumns: (
    model:
      GridComputedColumnsModel | ((prev: GridComputedColumnsModel) => GridComputedColumnsModel),
  ) => void;
  /**
   * Adds a computed column.
   * @param {GridComputedColumnDefinition} definition The definition of the computed column.
   * @param {object} options The options of the insertion.
   * @param {number} options.columnIndex The index to insert the column at. The column is appended by default.
   */
  addComputedColumn: (
    definition: GridComputedColumnDefinition,
    options?: { columnIndex?: number },
  ) => void;
  /**
   * Updates the definition of a computed column.
   * @param {string} field The field of the computed column to update.
   * @param {Partial<Omit<GridComputedColumnDefinition, 'field'>>} changes The properties to update.
   */
  updateComputedColumn: (
    field: string,
    changes: Partial<Omit<GridComputedColumnDefinition, 'field'>>,
  ) => void;
  /**
   * Removes a computed column.
   * @param {string} field The field of the computed column to remove.
   */
  removeComputedColumn: (field: string) => void;
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
