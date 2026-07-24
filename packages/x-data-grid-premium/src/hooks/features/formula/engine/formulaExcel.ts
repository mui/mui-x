import { FORMULA_BINARY_PRECEDENCE } from './formulaAst';
import type { FormulaAstNode, FormulaColumnSelector, FormulaRowSelector } from './formulaAst';
import type { FormulaErrorCode } from './formulaErrors';

/**
 * Excel's built-in error sentinels — the set `@mui/x-internal-exceljs-fork`
 * accepts as a formula `result`. The engine's own `FormulaErrorCode`s are mapped
 * onto these by `mapFormulaErrorCodeToExcel`.
 */
export type ExcelFormulaErrorCode =
  | '#N/A'
  | '#REF!'
  | '#NAME?'
  | '#DIV/0!'
  | '#NULL!'
  | '#VALUE!'
  | '#NUM!';

/**
 * Resolves a canonical reference axis to a coordinate in the *exported* sheet.
 * `null` means the referenced column/row is not part of the export, so the
 * converter bakes Excel's `#REF!` token into the formula at that position.
 */
export interface FormulaExcelSerializeContext {
  resolveColumn: (selector: FormulaColumnSelector) => { letter: string; absolute: boolean } | null;
  resolveRow: (selector: FormulaRowSelector) => { number: number; absolute: boolean } | null;
  /** 1-based Excel row of the cell that owns the formula (for same-row `fieldRef`). */
  ownerRowNumber: number;
  /** 1-based Excel row bounds of the exported data area (for whole-column `columnValues`). */
  firstDataRowNumber: number;
  lastDataRowNumber: number;
}

export interface FormulaExcelSerializeResult {
  /** Excel formula string, without the leading `=`. */
  formula: string;
  /** `true` when a reference fell outside the export and `#REF!` was baked in. */
  hasRefError: boolean;
}

const EXCEL_REF_ERROR = '#REF!';

interface SerializeState {
  hasRefError: boolean;
}

function serializeExcelString(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function resolveCellRef(
  column: FormulaColumnSelector,
  row: FormulaRowSelector,
  context: FormulaExcelSerializeContext,
  state: SerializeState,
): string {
  const resolvedColumn = context.resolveColumn(column);
  const resolvedRow = context.resolveRow(row);
  // Excel collapses a cell reference with a deleted axis to `#REF!` entirely.
  if (resolvedColumn === null || resolvedRow === null) {
    state.hasRefError = true;
    return EXCEL_REF_ERROR;
  }
  const columnPart = `${resolvedColumn.absolute ? '$' : ''}${resolvedColumn.letter}`;
  const rowPart = `${resolvedRow.absolute ? '$' : ''}${resolvedRow.number}`;
  return `${columnPart}${rowPart}`;
}

/**
 * Wraps the operand in parentheses when its precedence is below the minimum the
 * surrounding context requires — the same minimal parenthesization the canonical
 * serializer uses (`serializeFormulaAst`), so operator semantics never drift.
 */
function serializeOperand(
  node: FormulaAstNode,
  minPrecedence: number,
  context: FormulaExcelSerializeContext,
  state: SerializeState,
): string {
  const text = serializeNode(node, context, state);
  if (
    node.type === 'binaryExpression' &&
    FORMULA_BINARY_PRECEDENCE[node.operator] < minPrecedence
  ) {
    return `(${text})`;
  }
  return text;
}

function serializeNode(
  node: FormulaAstNode,
  context: FormulaExcelSerializeContext,
  state: SerializeState,
): string {
  switch (node.type) {
    case 'numberLiteral':
      return String(node.value);
    case 'stringLiteral':
      return serializeExcelString(node.value);
    case 'booleanLiteral':
      return node.value ? 'TRUE' : 'FALSE';
    case 'fieldRef': {
      // Same-row reference: the field's column on the owner cell's row, both relative.
      const resolvedColumn = context.resolveColumn({ kind: 'field', field: node.field });
      if (resolvedColumn === null) {
        state.hasRefError = true;
        return EXCEL_REF_ERROR;
      }
      return `${resolvedColumn.letter}${context.ownerRowNumber}`;
    }
    case 'cellRef':
      return resolveCellRef(node.column, node.row, context, state);
    case 'range': {
      // Each endpoint resolves independently, so a half-broken range reads
      // `B2:#REF!`, exactly as Excel renders a deleted range endpoint.
      const start = resolveCellRef(node.start.column, node.start.row, context, state);
      const end = resolveCellRef(node.end.column, node.end.row, context, state);
      return `${start}:${end}`;
    }
    case 'columnValues': {
      const resolvedColumn = context.resolveColumn({ kind: 'field', field: node.field });
      if (resolvedColumn === null) {
        state.hasRefError = true;
        return EXCEL_REF_ERROR;
      }
      // Whole-column reference, bounded to the exported data rows (no header row).
      return `${resolvedColumn.letter}${context.firstDataRowNumber}:${resolvedColumn.letter}${context.lastDataRowNumber}`;
    }
    case 'unaryExpression': {
      const operand = serializeNode(node.operand, context, state);
      if (node.operand.type === 'binaryExpression' || node.operand.type === 'unaryExpression') {
        return `${node.operator}(${operand})`;
      }
      return `${node.operator}${operand}`;
    }
    case 'binaryExpression': {
      const precedence = FORMULA_BINARY_PRECEDENCE[node.operator];
      const left = serializeOperand(node.left, precedence, context, state);
      // +1 re-derives left-associativity: an equal-precedence right child needs parens.
      const right = serializeOperand(node.right, precedence + 1, context, state);
      return `${left}${node.operator}${right}`;
    }
    case 'functionCall':
      return `${node.name}(${node.args.map((arg) => serializeNode(arg, context, state)).join(',')})`;
    default:
      return '';
  }
}

/**
 * Converts a canonical formula AST to an Excel A1 formula string (without the
 * leading `=`), re-anchoring every reference to its coordinate in the *exported*
 * sheet via `context`. References to cells outside the export bake Excel's
 * `#REF!` token in place and set `hasRefError`. Pure: engine types only.
 *
 * Mirrors the grid's relative/absolute distinction: stable selectors emit
 * relative refs (`B2`), positional selectors emit absolute refs (`$B$2`). The
 * computed value is identical either way; `$` only governs copy/fill inside Excel.
 */
export function serializeFormulaAstToExcel(
  ast: FormulaAstNode,
  context: FormulaExcelSerializeContext,
): FormulaExcelSerializeResult {
  const state: SerializeState = { hasRefError: false };
  const formula = serializeNode(ast, context, state);
  return { formula, hasRefError: state.hasRefError };
}

/**
 * Maps an engine error code to the nearest Excel error sentinel. `#CYCLE!` has
 * no Excel equivalent (a circular reference is a reference problem → `#REF!`);
 * the generic `#ERROR!` maps to `#VALUE!`.
 */
export function mapFormulaErrorCodeToExcel(code: FormulaErrorCode): ExcelFormulaErrorCode {
  switch (code) {
    case '#REF!':
      return '#REF!';
    case '#DIV/0!':
      return '#DIV/0!';
    case '#NAME?':
      return '#NAME?';
    case '#VALUE!':
      return '#VALUE!';
    case '#CYCLE!':
      return '#REF!';
    case '#ERROR!':
      return '#VALUE!';
    default:
      return '#VALUE!';
  }
}
