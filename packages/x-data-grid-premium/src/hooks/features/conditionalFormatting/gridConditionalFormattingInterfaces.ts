import type { GridRowId, GridValidRowModel } from '@mui/x-data-grid-pro';

export type GridConditionalFormattingCellOperator =
  | 'equal'
  | 'notEqual'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'between'
  | 'notBetween';

export type GridConditionalFormattingTextOperator =
  'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'isEmpty' | 'isNotEmpty';

export type GridConditionalFormattingValue = number | string | Date;

/**
 * Compares the value of the cell with one value, or with two for `between` and `notBetween`.
 * A number or date only matches a number or date cell, a string only matches a text cell.
 * Strings are compared case-insensitively, as in Excel.
 */
export interface GridConditionalFormattingCellCondition {
  type: 'cell';
  operator: GridConditionalFormattingCellOperator;
  value: GridConditionalFormattingValue;
  /**
   * The upper bound of `between` and `notBetween`, inclusive.
   */
  valueTo?: GridConditionalFormattingValue;
}

/**
 * Matches the text of the cell, case-insensitively.
 */
export interface GridConditionalFormattingTextCondition {
  type: 'text';
  operator: GridConditionalFormattingTextOperator;
  /**
   * The text to look for. Ignored by `isEmpty` and `isNotEmpty`.
   */
  value?: string;
}

/**
 * Matches when the formula evaluates to `TRUE` for the row, for example `=price > cost * 2`.
 * The formula can only reference columns of the same row.
 * Needs the formula feature, provided through `featureDependencies`.
 */
export interface GridConditionalFormattingFormulaCondition {
  type: 'formula';
  formula: string;
}

export type GridConditionalFormattingCondition =
  | GridConditionalFormattingCellCondition
  | GridConditionalFormattingTextCondition
  | GridConditionalFormattingFormulaCondition;

/**
 * The style applied to the matching cells.
 * Colors are hex strings (`#rgb` or `#rrggbb`), so they also export to Excel.
 */
export interface GridConditionalFormattingStyle {
  color?: string;
  backgroundColor?: string;
  fontWeight?: 'bold';
  fontStyle?: 'italic';
  textDecoration?: 'underline' | 'line-through';
}

export interface GridConditionalFormattingRule {
  /**
   * The fields of the columns the rule applies to.
   */
  fields: string[];
  condition: GridConditionalFormattingCondition;
  style: GridConditionalFormattingStyle;
}

/**
 * The conditional formatting rules, in priority order: when several rules
 * match a cell and set the same style property, the first one wins.
 */
export type GridConditionalFormattingModel = GridConditionalFormattingRule[];

export interface GridConditionalFormattingState {
  model: GridConditionalFormattingModel;
}

export interface GridConditionalFormattingInitialState {
  model?: GridConditionalFormattingModel;
}

export interface GridConditionalFormattingApi {
  /**
   * Sets the conditional formatting rules.
   * @param {GridConditionalFormattingModel} model The new rules.
   */
  setConditionalFormatting: (model: GridConditionalFormattingModel) => void;
}

/**
 * Registered by the formula feature: formula conditions need the engine.
 */
export interface GridConditionalFormattingPrivateApi {
  /**
   * @param {string} formula The formula of the condition.
   * @param {GridValidRowModel} row The row to evaluate it for.
   * @param {GridRowId} id The id of the row.
   * @returns {boolean} `true` when the formula evaluates to `TRUE`.
   */
  evaluateConditionalFormattingFormula: (
    formula: string,
    row: GridValidRowModel,
    id: GridRowId,
  ) => boolean;
  /**
   * @param {string} formula The formula of the condition.
   * @param {Map<string, string>} fieldToColumnLetter The column letter of each exported field.
   * @param {number} rowNumber The Excel row the formula is written for.
   * @returns {string | null} The Excel formula, without the leading `=`, or `null` when it cannot be exported.
   */
  getConditionalFormattingExcelFormula: (
    formula: string,
    fieldToColumnLetter: Map<string, string>,
    rowNumber: number,
  ) => string | null;
}

export interface GridConditionalFormattingInternalCache {
  /**
   * The class names of each cell, by row object then field. Dropped when the
   * rules, the formula results or the computed columns change.
   */
  classNames: WeakMap<GridValidRowModel, Map<string, string[]>>;
  /**
   * What `classNames` was computed from.
   */
  inputs: unknown[];
}
