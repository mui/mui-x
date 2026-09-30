/**
 * Error codes produced by formula parsing and evaluation.
 * They follow the spreadsheet convention and are rendered as the cell content.
 */
export type FormulaErrorCode = '#REF!' | '#DIV/0!' | '#CYCLE!' | '#NAME?' | '#VALUE!' | '#ERROR!';

export const FORMULA_ERROR_CODES: readonly FormulaErrorCode[] = [
  '#REF!',
  '#DIV/0!',
  '#CYCLE!',
  '#NAME?',
  '#VALUE!',
  '#ERROR!',
];

/**
 * An error produced while evaluating a formula.
 * Evaluation failures are values, never thrown exceptions.
 */
export interface FormulaErrorValue {
  kind: 'error';
  code: FormulaErrorCode;
  message?: string;
}

export function createFormulaError(code: FormulaErrorCode, message?: string): FormulaErrorValue {
  if (message === undefined) {
    return { kind: 'error', code };
  }
  return { kind: 'error', code, message };
}

export function isFormulaErrorValue(value: unknown): value is FormulaErrorValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { kind?: unknown }).kind === 'error' &&
    typeof (value as { code?: unknown }).code === 'string'
  );
}
