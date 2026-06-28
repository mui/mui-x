export type FormulaValue = number | string | boolean | null;

export type FormulaScope = 'filtered' | 'all';

export type BinaryOperator = '+' | '-' | '*' | '/' | '%' | '=' | '!=' | '<' | '<=' | '>' | '>=';

export type UnaryOperator = '+' | '-';

export type FormulaNode =
  | { type: 'literal'; value: FormulaValue }
  | { type: 'column'; field: string }
  | { type: 'binary'; op: BinaryOperator; left: FormulaNode; right: FormulaNode }
  | { type: 'unary'; op: UnaryOperator; operand: FormulaNode }
  | { type: 'call'; name: string; args: FormulaNode[] };

export interface FormulaSuccess {
  ok: true;
  value: FormulaValue;
  rowCount: number;
  scope: FormulaScope;
  /** Field whose `valueFormatter` should be used to render `value`, if any. */
  formatField?: string;
}

export interface FormulaFailure {
  ok: false;
  reason: string;
  scope: FormulaScope;
}

export type FormulaResult = FormulaSuccess | FormulaFailure;

export class FormulaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormulaError';
  }
}

/**
 * Host-supplied row identifier. The formula engine treats this as opaque —
 * it only ever passes it back to `getCellValue`.
 */
export type FormulaRowId = string | number;

/**
 * Host-agnostic data source for the formula evaluator. The host (Grid, future
 * Studio, etc.) wraps its own row/column model in this contract.
 */
export interface FormulaDataSource {
  /** Row IDs in scope. `'filtered'` is the user's current view; `'all'` is the unfiltered dataset. */
  getRowIds(scope: FormulaScope): readonly FormulaRowId[];
  /** Whether a given column field exists in the dataset. */
  hasColumn(field: string): boolean;
  /** Read a single cell value. */
  getCellValue(rowId: FormulaRowId, field: string): FormulaValue;
}

export interface FormulaEvalContext {
  dataSource: FormulaDataSource;
  scope: FormulaScope;
}
