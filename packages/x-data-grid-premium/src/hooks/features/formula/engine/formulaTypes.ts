import type { FormulaErrorCode } from './formulaErrors';

/**
 * Structural twin of `GridRowId`.
 * The engine defines it locally so it has zero grid imports and stays extractable.
 */
export type FormulaRowId = string | number;

/**
 * Structural twin of `GridCellCoordinates`.
 */
export interface FormulaCellRef {
  id: FormulaRowId;
  field: string;
}

/**
 * Serialized cell key used in maps and sets.
 * Runtime value is a string; the brand prevents arbitrary strings in TS.
 */
export type FormulaCellKey = string & { __formulaCellKey: true };

/**
 * `\u0000` (NUL) cannot appear in field names coming from column definitions,
 * so it is a collision-free separator. Note that row ids are stringified:
 * the numeric id `1` and the string id `"1"` produce the same key. Grid row
 * ids are documented as unique under string coercion.
 */
const CELL_KEY_SEPARATOR = '\u0000';

export function createFormulaCellKey(id: FormulaRowId, field: string): FormulaCellKey {
  return `${id}${CELL_KEY_SEPARATOR}${field}` as FormulaCellKey;
}

export function getFormulaCellKey(ref: FormulaCellRef): FormulaCellKey {
  return createFormulaCellKey(ref.id, ref.field);
}

/**
 * Inverse of `createFormulaCellKey`. The id is returned as a string
 * (numeric ids are stringified by the key format).
 */
export function parseFormulaCellKey(key: FormulaCellKey): { id: string; field: string } {
  const separatorIndex = key.indexOf(CELL_KEY_SEPARATOR);
  return {
    id: key.slice(0, separatorIndex),
    field: key.slice(separatorIndex + 1),
  };
}

/**
 * The scalar value domain of formula evaluation. `null` represents an empty cell.
 */
export type FormulaScalar = number | string | boolean | Date | null;

/**
 * A materialized range of already-evaluated cell values.
 * Only valid as a direct argument to functions declaring `acceptsRanges`.
 */
export interface FormulaRangeValue {
  kind: 'range';
  values: FormulaScalar[];
}

export function isFormulaRangeValue(value: unknown): value is FormulaRangeValue {
  return (
    typeof value === 'object' && value !== null && (value as { kind?: unknown }).kind === 'range'
  );
}

/**
 * The outcome of evaluating one formula cell.
 */
export type FormulaResult =
  | { type: 'value'; value: FormulaScalar }
  | { type: 'error'; code: FormulaErrorCode; message?: string };

/**
 * Snapshot of the grid's position semantics supplied by the adapter:
 * sorted + filtered data-row order and visible column order.
 * All indexes are 1-based to match the editor-facing A1 semantics.
 */
export interface FormulaPositionContext {
  version: number;
  rowCount: number;
  columnCount: number;
  getRowIdAtPosition: (index: number) => FormulaRowId | undefined;
  getPositionOfRowId: (id: FormulaRowId) => number | undefined;
  getFieldAtPosition: (index: number) => string | undefined;
  getPositionOfField: (field: string) => number | undefined;
}

export interface FormulaSourceSpan {
  start: number;
  end: number;
}

export interface FormulaValidationIssue {
  code: FormulaErrorCode;
  message: string;
  span?: FormulaSourceSpan;
}

export interface FormulaValidationResult {
  valid: boolean;
  issues: FormulaValidationIssue[];
}

/**
 * A raw cell value is formula source when it is a string starting with `=`.
 */
export function isFormulaSource(raw: unknown): raw is string {
  return typeof raw === 'string' && raw.charCodeAt(0) === 61; // '='
}

/**
 * A raw cell value starting with `'=` is an escaped literal (spreadsheet convention):
 * the cell displays everything after the apostrophe and is never evaluated.
 */
export function isEscapedFormulaSource(raw: unknown): raw is string {
  return typeof raw === 'string' && raw.startsWith("'=");
}

/**
 * `"'=foo"` -> `"=foo"`.
 */
export function unescapeLiteralSource(raw: string): string {
  return raw.slice(1);
}

/**
 * Strips the leading `=` from formula source, yielding the parseable expression.
 */
export function getFormulaExpression(source: string): string {
  return source.charCodeAt(0) === 61 ? source.slice(1) : source;
}
