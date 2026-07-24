import type { FormulaRowId, FormulaSourceSpan } from './formulaTypes';

/**
 * Names that are part of the formula grammar and cannot be used as function names.
 */
export const FORMULA_RESERVED_NAMES: readonly string[] = [
  'REF',
  'COLUMN',
  'ROW',
  'COLUMN_POSITION',
  'ROW_POSITION',
  'FIELD',
  'RANGE',
  'COLUMN_VALUES',
  'TRUE',
  'FALSE',
];

interface FormulaAstBase {
  span: FormulaSourceSpan;
}

export interface FormulaNumberLiteralNode extends FormulaAstBase {
  type: 'numberLiteral';
  value: number;
}

export interface FormulaStringLiteralNode extends FormulaAstBase {
  type: 'stringLiteral';
  value: string;
}

export interface FormulaBooleanLiteralNode extends FormulaAstBase {
  type: 'booleanLiteral';
  value: boolean;
}

/**
 * Same-row reference: a bare identifier (`price`) or `FIELD("unit price")`.
 */
export interface FormulaFieldRefNode extends FormulaAstBase {
  type: 'fieldRef';
  field: string;
}

/**
 * Per-axis selectors. Positional-ness is per-axis, not per-node, so mixed refs
 * like the editor's `A$1` (stable column + positional row) stay encodable.
 * Positions are 1-based: columns in visible column order, rows in
 * sorted + filtered data-row order.
 */
export type FormulaColumnSelector =
  | { kind: 'field'; field: string } // COLUMN("total")
  | { kind: 'position'; index: number }; // COLUMN_POSITION(2)

export type FormulaRowSelector =
  | { kind: 'id'; id: FormulaRowId } // ROW("order-1001") | ROW(42)
  | { kind: 'position'; index: number }; // ROW_POSITION(1)

/**
 * `REF(<column selector>, <row selector>)`.
 */
export interface FormulaCellRefNode extends FormulaAstBase {
  type: 'cellRef';
  column: FormulaColumnSelector;
  row: FormulaRowSelector;
}

/**
 * `RANGE(REF(...), REF(...))` — the inclusive rectangle between the two anchors,
 * resolved against the position context at bind time.
 */
export interface FormulaRangeNode extends FormulaAstBase {
  type: 'range';
  start: FormulaCellRefNode;
  end: FormulaCellRefNode;
}

/**
 * `COLUMN_VALUES("total")` — every value of the field over the current
 * sorted + filtered row set.
 */
export interface FormulaColumnValuesNode extends FormulaAstBase {
  type: 'columnValues';
  field: string;
}

export interface FormulaUnaryExpressionNode extends FormulaAstBase {
  type: 'unaryExpression';
  operator: '-' | '+';
  operand: FormulaAstNode;
}

export type FormulaBinaryOperator =
  | '+'
  | '-'
  | '*'
  | '/'
  | '^'
  | '&'
  | '='
  | '<>'
  | '<'
  | '<='
  | '>'
  | '>=';

/**
 * Binary operator precedence, lowest first. All binary operators are
 * left-associative, including `^` (Excel-compatible: `2^3^2 = 64`).
 * Unary `-`/`+` bind tighter than `^` (Excel-compatible: `-2^2 = 4`).
 * Single source of truth for the parser and the serializer's minimal
 * parenthesization — they must never diverge or round-trips corrupt.
 */
export const FORMULA_BINARY_PRECEDENCE: Record<FormulaBinaryOperator, number> = {
  '=': 1,
  '<>': 1,
  '<': 1,
  '<=': 1,
  '>': 1,
  '>=': 1,
  '&': 2,
  '+': 3,
  '-': 3,
  '*': 4,
  '/': 4,
  '^': 5,
};

export interface FormulaBinaryExpressionNode extends FormulaAstBase {
  type: 'binaryExpression';
  operator: FormulaBinaryOperator;
  left: FormulaAstNode;
  right: FormulaAstNode;
}

export interface FormulaFunctionCallNode extends FormulaAstBase {
  type: 'functionCall';
  /**
   * Normalized to uppercase at parse time.
   */
  name: string;
  args: FormulaAstNode[];
}

export type FormulaAstNode =
  | FormulaNumberLiteralNode
  | FormulaStringLiteralNode
  | FormulaBooleanLiteralNode
  | FormulaFieldRefNode
  | FormulaCellRefNode
  | FormulaRangeNode
  | FormulaColumnValuesNode
  | FormulaUnaryExpressionNode
  | FormulaBinaryExpressionNode
  | FormulaFunctionCallNode;
