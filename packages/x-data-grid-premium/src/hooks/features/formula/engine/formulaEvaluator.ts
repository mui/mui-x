import type {
  FormulaAstNode,
  FormulaBinaryExpressionNode,
  FormulaCellRefNode,
  FormulaColumnValuesNode,
  FormulaFunctionCallNode,
  FormulaRangeNode,
} from './formulaAst';
import { resolveFormulaRangeRectangle } from './formulaDependencies';
import { createFormulaError, isFormulaErrorValue } from './formulaErrors';
import type { FormulaErrorValue } from './formulaErrors';
import { isFormulaRangeValue } from './formulaTypes';
import type {
  FormulaCellRef,
  FormulaPositionContext,
  FormulaRangeValue,
  FormulaResult,
  FormulaRowId,
  FormulaScalar,
} from './formulaTypes';
import {
  compareFormulaScalars,
  isEmptyFormulaValue,
  toFormulaBoolean,
  toFormulaNumber,
  toFormulaText,
} from './formulaValues';
import { getFormulaFunctionArityError } from './formulaFunctions';
import type {
  FormulaFunctionArg,
  FormulaFunctionCoercionHelpers,
  FormulaFunctionRegistry,
} from './formulaFunctions';

/**
 * The resolver and context the grid adapter supplies for one evaluation.
 *
 * Contract: `getCellValue` is side-effect free and never re-enters the engine.
 * The adapter evaluates dirty cells in topological order, so a dependency's
 * value is already final when its dependents read it — formula dependencies
 * resolve from the in-pass results cache, raw dependencies from row data
 * (with `valueGetter` applied).
 */
export interface FormulaEvaluationContext {
  currentCell: FormulaCellRef;
  getCellValue: (ref: FormulaCellRef) => FormulaScalar | FormulaErrorValue | undefined;
  hasRow: (id: FormulaRowId) => boolean;
  hasField: (field: string) => boolean;
  position: FormulaPositionContext;
  functions: FormulaFunctionRegistry;
}

type EvaluatedValue = FormulaScalar | FormulaErrorValue | FormulaRangeValue;

const COERCION_HELPERS: FormulaFunctionCoercionHelpers = {
  toNumber: toFormulaNumber,
  toText: toFormulaText,
  toBoolean: toFormulaBoolean,
  isEmpty: isEmptyFormulaValue,
  compare: compareFormulaScalars,
};

function normalizeResolvedValue(
  value: FormulaScalar | FormulaErrorValue | undefined,
): FormulaScalar | FormulaErrorValue {
  return value === undefined ? null : value;
}

function evaluateCellRef(
  node: FormulaCellRefNode,
  context: FormulaEvaluationContext,
): FormulaScalar | FormulaErrorValue {
  let field: string;
  if (node.column.kind === 'field') {
    field = node.column.field;
  } else {
    // The same message dependency binding produces for the same failure —
    // which of the two surfaces depends only on evaluation order.
    const resolvedField = context.position.getFieldAtPosition(node.column.index);
    if (resolvedField === undefined) {
      return createFormulaError('#REF!', `There is no column at position ${node.column.index}.`);
    }
    field = resolvedField;
  }
  let id: FormulaRowId;
  if (node.row.kind === 'id') {
    id = node.row.id;
  } else {
    const resolvedId = context.position.getRowIdAtPosition(node.row.index);
    if (resolvedId === undefined) {
      return createFormulaError('#REF!', `There is no row at position ${node.row.index}.`);
    }
    id = resolvedId;
  }
  if (!context.hasField(field)) {
    return createFormulaError('#REF!', `The field "${field}" does not exist.`);
  }
  if (!context.hasRow(id)) {
    return createFormulaError('#REF!', `The row with id "${id}" does not exist.`);
  }
  return normalizeResolvedValue(context.getCellValue({ id, field }));
}

/**
 * Materializes a `RANGE(...)` rectangle into a flat value list, row-major
 * (left to right, then top to bottom). The first error value inside the
 * rectangle propagates, consistent with the strict propagation rule.
 */
function evaluateRange(
  node: FormulaRangeNode,
  context: FormulaEvaluationContext,
): FormulaRangeValue | FormulaErrorValue {
  const rectangle = resolveFormulaRangeRectangle(node, context.position);
  if (isFormulaErrorValue(rectangle)) {
    return rectangle;
  }
  const values: FormulaScalar[] = [];
  for (let rowIndex = rectangle.fromIndex; rowIndex <= rectangle.toIndex; rowIndex += 1) {
    // Anchor rows resolved, so every position between them exists.
    const id = context.position.getRowIdAtPosition(rowIndex);
    if (id === undefined) {
      continue;
    }
    for (
      let columnIndex = rectangle.fromColumn;
      columnIndex <= rectangle.toColumn;
      columnIndex += 1
    ) {
      const field = context.position.getFieldAtPosition(columnIndex);
      if (field === undefined) {
        continue;
      }
      const value = context.getCellValue({ id, field });
      if (isFormulaErrorValue(value)) {
        return value;
      }
      values.push(normalizeResolvedValue(value) as FormulaScalar);
    }
  }
  return { kind: 'range', values };
}

/**
 * Materializes `COLUMN_VALUES("field")`: the field's values over every row of
 * the position context (sorted + filtered data rows), in view order. The
 * field does not need a position — hidden columns still hold values.
 */
function evaluateColumnValues(
  node: FormulaColumnValuesNode,
  context: FormulaEvaluationContext,
): FormulaRangeValue | FormulaErrorValue {
  if (!context.hasField(node.field)) {
    return createFormulaError('#REF!', `The field "${node.field}" does not exist.`);
  }
  const values: FormulaScalar[] = [];
  for (let rowIndex = 1; rowIndex <= context.position.rowCount; rowIndex += 1) {
    const id = context.position.getRowIdAtPosition(rowIndex);
    if (id === undefined) {
      continue;
    }
    const value = context.getCellValue({ id, field: node.field });
    if (isFormulaErrorValue(value)) {
      return value;
    }
    values.push(normalizeResolvedValue(value) as FormulaScalar);
  }
  return { kind: 'range', values };
}

function evaluateBinaryExpression(
  node: FormulaBinaryExpressionNode,
  context: FormulaEvaluationContext,
): FormulaScalar | FormulaErrorValue {
  // Strict left-to-right: the first error wins.
  const left = evaluateNode(node.left, context);
  if (isFormulaErrorValue(left)) {
    return left;
  }
  if (isFormulaRangeValue(left)) {
    return createFormulaError('#VALUE!', 'A range cannot be used in an expression.');
  }
  const right = evaluateNode(node.right, context);
  if (isFormulaErrorValue(right)) {
    return right;
  }
  if (isFormulaRangeValue(right)) {
    return createFormulaError('#VALUE!', 'A range cannot be used in an expression.');
  }

  switch (node.operator) {
    case '=':
    case '<>':
    case '<':
    case '<=':
    case '>':
    case '>=':
      return compareFormulaScalars(node.operator, left, right);
    case '&': {
      const leftText = toFormulaText(left);
      if (isFormulaErrorValue(leftText)) {
        return leftText;
      }
      const rightText = toFormulaText(right);
      if (isFormulaErrorValue(rightText)) {
        return rightText;
      }
      return leftText + rightText;
    }
    default: {
      const leftNumber = toFormulaNumber(left);
      if (isFormulaErrorValue(leftNumber)) {
        return leftNumber;
      }
      const rightNumber = toFormulaNumber(right);
      if (isFormulaErrorValue(rightNumber)) {
        return rightNumber;
      }
      let result: number;
      switch (node.operator) {
        case '+':
          result = leftNumber + rightNumber;
          break;
        case '-':
          result = leftNumber - rightNumber;
          break;
        case '*':
          result = leftNumber * rightNumber;
          break;
        case '/':
          if (rightNumber === 0) {
            return createFormulaError('#DIV/0!');
          }
          result = leftNumber / rightNumber;
          break;
        default:
          result = leftNumber ** rightNumber;
          break;
      }
      if (!Number.isFinite(result)) {
        return createFormulaError('#VALUE!', 'The operation produced a non-finite number.');
      }
      return result;
    }
  }
}

function evaluateFunctionCall(
  node: FormulaFunctionCallNode,
  context: FormulaEvaluationContext,
): FormulaScalar | FormulaErrorValue {
  const definition = context.functions.get(node.name);
  if (definition === undefined) {
    return createFormulaError('#NAME?', `Unknown function "${node.name}".`);
  }

  const arityError = getFormulaFunctionArityError(definition, node.args.length);
  if (arityError !== null) {
    return arityError;
  }

  let args: FormulaFunctionArg[];
  if (definition.lazy) {
    // The range gate applies at thunk resolution time, so lazy custom
    // functions cannot observe ranges in scalar position either. Errors pass
    // through raw — lazy functions control their own propagation.
    args = node.args.map((argNode) => () => {
      const value = evaluateNode(argNode, context);
      if (isFormulaRangeValue(value) && !definition.acceptsRanges) {
        return createFormulaError(
          '#VALUE!',
          `${definition.name}() does not accept range arguments.`,
        );
      }
      return value;
    });
  } else {
    args = [];
    for (const argNode of node.args) {
      const value = evaluateNode(argNode, context);
      if (isFormulaErrorValue(value) && !definition.acceptsErrors) {
        return value;
      }
      if (isFormulaRangeValue(value) && !definition.acceptsRanges) {
        return createFormulaError(
          '#VALUE!',
          `${definition.name}() does not accept range arguments.`,
        );
      }
      args.push(value);
    }
  }

  let result: ReturnType<typeof definition.apply>;
  try {
    result = definition.apply(args, {
      coerce: COERCION_HELPERS,
      currentCell: context.currentCell,
    });
  } catch (error) {
    return createFormulaError(
      '#ERROR!',
      error instanceof Error ? error.message : 'The function threw an error.',
    );
  }
  // Uniform non-finite gate for every function result (built-in overflow such
  // as SUM(1e308, 1e308) and custom registry functions alike), consistent
  // with the binary operators.
  if (typeof result === 'number' && !Number.isFinite(result)) {
    return createFormulaError('#VALUE!', `${definition.name}() produced a non-finite number.`);
  }
  return result === undefined ? null : result;
}

function evaluateNode(node: FormulaAstNode, context: FormulaEvaluationContext): EvaluatedValue {
  switch (node.type) {
    case 'numberLiteral':
    case 'stringLiteral':
    case 'booleanLiteral':
      return node.value;
    case 'fieldRef': {
      if (!context.hasField(node.field)) {
        return createFormulaError('#REF!', `The field "${node.field}" does not exist.`);
      }
      return normalizeResolvedValue(
        context.getCellValue({ id: context.currentCell.id, field: node.field }),
      );
    }
    case 'cellRef':
      return evaluateCellRef(node, context);
    case 'range':
      return evaluateRange(node, context);
    case 'columnValues':
      return evaluateColumnValues(node, context);
    case 'unaryExpression': {
      const operand = evaluateNode(node.operand, context);
      if (isFormulaErrorValue(operand)) {
        return operand;
      }
      if (isFormulaRangeValue(operand)) {
        return createFormulaError('#VALUE!', 'A range cannot be used in an expression.');
      }
      // Excel-compatible: unary `+` is an identity operation and performs no
      // numeric coercion (`+"abc"` stays "abc"); only unary `-` coerces.
      if (node.operator === '+') {
        return operand;
      }
      const numeric = toFormulaNumber(operand);
      if (isFormulaErrorValue(numeric)) {
        return numeric;
      }
      return -numeric;
    }
    case 'binaryExpression':
      return evaluateBinaryExpression(node, context);
    case 'functionCall':
      return evaluateFunctionCall(node, context);
    default:
      return createFormulaError('#ERROR!', 'Unknown formula expression.');
  }
}

/**
 * Evaluates a parsed formula. Never throws: every failure mode is a
 * `{ type: 'error' }` result carrying one of the spreadsheet error codes.
 * `#CYCLE!` is never produced here — it is assigned by the graph layer.
 */
export function evaluateFormula(
  ast: FormulaAstNode,
  context: FormulaEvaluationContext,
): FormulaResult {
  let value: EvaluatedValue;
  try {
    value = evaluateNode(ast, context);
  } catch (error) {
    // Backstop for the never-throws contract. The parser's depth bound makes
    // a RangeError unreachable for parser-produced ASTs; hand-built ASTs and
    // throwing adapter resolvers land here.
    if (error instanceof RangeError) {
      return { type: 'error', code: '#ERROR!', message: 'The formula is too complex to evaluate.' };
    }
    return {
      type: 'error',
      code: '#ERROR!',
      message: error instanceof Error ? error.message : 'The formula could not be evaluated.',
    };
  }
  if (isFormulaErrorValue(value)) {
    return value.message === undefined
      ? { type: 'error', code: value.code }
      : { type: 'error', code: value.code, message: value.message };
  }
  if (isFormulaRangeValue(value)) {
    return {
      type: 'error',
      code: '#VALUE!',
      message: 'A range cannot be the result of a formula.',
    };
  }
  return { type: 'value', value };
}
