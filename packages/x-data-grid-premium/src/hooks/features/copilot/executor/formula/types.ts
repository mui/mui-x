import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPremium } from '../../../../../models/gridApiPremium';

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

export interface FormulaEvalContext {
  apiRef: RefObject<GridPrivateApiPremium>;
  scope: FormulaScope;
}
