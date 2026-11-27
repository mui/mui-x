import type { GridValidRowModel } from '@mui/x-data-grid-pro';

export type GridCellValueOperator =
  | 'equal'
  | 'notEqual'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'between'
  | 'notBetween';

export type GridCellTextOperator =
  'contains' | 'notContains' | 'startsWith' | 'endsWith' | 'isEmpty' | 'isNotEmpty';

export type GridCellConditionValue = number | string | Date;

/**
 * Compares the value of the cell with one value, or with two for `between` and `notBetween`.
 * A number only matches a number cell, a date a date cell, and a string a text cell.
 * Strings are compared case-insensitively, as in Excel.
 */
export interface GridCellValueCondition {
  type: 'cell';
  operator: GridCellValueOperator;
  value: GridCellConditionValue;
  /**
   * The upper bound of `between` and `notBetween`, inclusive.
   */
  valueTo?: GridCellConditionValue;
}

/**
 * Matches the text of the cell, case-insensitively.
 */
export interface GridCellTextCondition {
  type: 'text';
  operator: GridCellTextOperator;
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
export interface GridCellFormulaCondition {
  type: 'formula';
  formula: string;
}

/**
 * A serializable condition on a cell, shared by the features that test cells.
 */
export type GridCellCondition =
  GridCellValueCondition | GridCellTextCondition | GridCellFormulaCondition;

/**
 * Registered by the formula feature: formula conditions need the engine.
 */
export interface GridCellConditionPrivateApi {
  /**
   * @param {string} formula The formula of the condition.
   * @param {GridValidRowModel} row The row to evaluate it for.
   * @returns {boolean} `true` when the formula evaluates to `TRUE`.
   */
  evaluateCellFormulaCondition: (formula: string, row: GridValidRowModel) => boolean;
  /**
   * @param {string} formula The formula of the condition.
   * @param {Map<string, string>} fieldToColumnLetter The column letter of each exported field.
   * @param {number} rowNumber The Excel row the formula is written for.
   * @returns {string | null} The Excel formula, without the leading `=`, or `null` when it cannot be exported.
   */
  getCellFormulaConditionExcelFormula: (
    formula: string,
    fieldToColumnLetter: Map<string, string>,
    rowNumber: number,
  ) => string | null;
}
