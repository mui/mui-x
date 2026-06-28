import {
  FormulaError,
  type BinaryOperator,
  type FormulaDataSource,
  type FormulaEvalContext,
  type FormulaNode,
  type FormulaResult,
  type FormulaRowId,
  type FormulaValue,
} from './types';
import {
  FORMULA_FUNCTIONS,
  isTruthy,
  toNumber,
  type EvalContext as FnContext,
  type FunctionEntry,
} from './functions';
import { parseFormula } from './parser';

type Mode = 'top' | 'perRow';

function applyBinary(op: BinaryOperator, left: FormulaValue, right: FormulaValue): FormulaValue {
  if (op === '+' || op === '-' || op === '*' || op === '/' || op === '%') {
    const a = toNumber(left, op);
    const b = toNumber(right, op);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      return null;
    }
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '*':
        return a * b;
      case '/':
        return b === 0 ? null : a / b;
      case '%':
        return b === 0 ? null : a % b;
      default:
        return null;
    }
  }
  if (op === '=' || op === '!=') {
    const eq = compareEquals(left, right);
    return op === '=' ? eq : !eq;
  }
  if (typeof left === 'number' || typeof right === 'number') {
    const a = toNumber(left, op);
    const b = toNumber(right, op);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      return false;
    }
    switch (op) {
      case '<':
        return a < b;
      case '<=':
        return a <= b;
      case '>':
        return a > b;
      case '>=':
        return a >= b;
      default:
        return false;
    }
  }
  const a = String(left ?? '');
  const b = String(right ?? '');
  switch (op) {
    case '<':
      return a < b;
    case '<=':
      return a <= b;
    case '>':
      return a > b;
    case '>=':
      return a >= b;
    default:
      return false;
  }
}

function compareEquals(left: FormulaValue, right: FormulaValue): boolean {
  if (left === right) {
    return true;
  }
  if (left == null || right == null) {
    return false;
  }
  if (typeof left === 'number' || typeof right === 'number') {
    const a = toNumber(left, '=');
    const b = toNumber(right, '=');
    return Number.isFinite(a) && Number.isFinite(b) && a === b;
  }
  return String(left) === String(right);
}

function detectFormatField(root: FormulaNode): string | undefined {
  if (root.type !== 'call') {
    return undefined;
  }
  const fn: FunctionEntry | undefined = FORMULA_FUNCTIONS[root.name];
  if (!fn?.aggregate || root.args.length === 0) {
    return undefined;
  }
  const inner = root.args[0];
  if (inner.type === 'column') {
    return inner.field;
  }
  return undefined;
}

/**
 * Evaluate a formula string against a host-supplied {@link FormulaDataSource}.
 *
 * The evaluator is host-agnostic — it does not reference any Grid types. The
 * host is responsible for wrapping its own row/column model into the data
 * source contract (see types.ts).
 */
export function evaluateFormula(input: string, ctx: FormulaEvalContext): FormulaResult {
  let root: FormulaNode;
  try {
    root = parseFormula(input);
  } catch (err) {
    return { ok: false, reason: messageOf(err), scope: ctx.scope };
  }

  const { dataSource } = ctx;
  const rowIds = dataSource.getRowIds(ctx.scope);

  let mode: Mode = 'top';
  let currentRowId: FormulaRowId | undefined;

  const withPerRow = <T>(rowId: FormulaRowId, fn: () => T): T => {
    const prevMode = mode;
    const prevRow = currentRowId;
    mode = 'perRow';
    currentRowId = rowId;
    try {
      return fn();
    } finally {
      mode = prevMode;
      currentRowId = prevRow;
    }
  };

  const evalNode = (node: FormulaNode): FormulaValue => {
    switch (node.type) {
      case 'literal':
        return node.value;
      case 'column': {
        if (mode !== 'perRow' || currentRowId === undefined) {
          throw new FormulaError(
            `Column reference [${node.field}] is only valid inside an aggregate ` +
              `like SUM, AVG, COUNT, MIN, MAX, MEDIAN, SUMIF, COUNTIF, or AVERAGEIF`,
          );
        }
        if (!dataSource.hasColumn(node.field)) {
          throw new FormulaError(`Unknown column [${node.field}]`);
        }
        return dataSource.getCellValue(currentRowId, node.field);
      }
      case 'unary': {
        const x = evalNode(node.operand);
        if (node.op === '+') {
          const n = toNumber(x, '+');
          return Number.isFinite(n) ? n : null;
        }
        const n = toNumber(x, '-');
        return Number.isFinite(n) ? -n : null;
      }
      case 'binary': {
        const left = evalNode(node.left);
        const right = evalNode(node.right);
        return applyBinary(node.op, left, right);
      }
      case 'call': {
        const fn = FORMULA_FUNCTIONS[node.name];
        if (!fn) {
          throw new FormulaError(`Unknown function ${node.name}(...)`);
        }
        if (fn.aggregate && mode !== 'top') {
          throw new FormulaError(`${node.name}(...) cannot appear inside another aggregate`);
        }
        const fnCtx: FnContext = {
          mode,
          evalChild: evalNode,
          withPerRow,
          rowIds,
        };
        return fn.call(node.args, fnCtx);
      }
      default:
        return null;
    }
  };

  let value: FormulaValue;
  try {
    value = evalNode(root);
  } catch (err) {
    return { ok: false, reason: messageOf(err), scope: ctx.scope };
  }

  return {
    ok: true,
    value,
    rowCount: rowIds.length,
    scope: ctx.scope,
    formatField: detectFormatField(root),
  };
}

function messageOf(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}

export { isTruthy, toNumber };
