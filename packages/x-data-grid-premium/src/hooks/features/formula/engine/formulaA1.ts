import { FORMULA_BINARY_PRECEDENCE } from './formulaAst';
import type {
  FormulaAstNode,
  FormulaCellRefNode,
  FormulaColumnSelector,
  FormulaColumnValuesNode,
  FormulaRangeNode,
  FormulaRowSelector,
} from './formulaAst';
import { parseFormula } from './formulaParser';
import { serializeFormulaAst } from './formulaSerializer';
import type { FormulaPositionContext, FormulaSourceSpan } from './formulaTypes';

/**
 * A1 notation is an editor-facing dialect layered on top of the canonical
 * (`REF`/`RANGE`/`COLUMN_VALUES`) syntax. It is never stored: `toCanonicalFormula`
 * runs at commit/paste and `toDisplayFormula` runs at edit-begin. The canonical
 * dialect is a superset, so any canonical formula round-trips through `toDisplay`
 * losslessly (refs without a current position render in canonical form inline).
 *
 * Reference convention (D5), inverted from Excel's `$` semantics on purpose so
 * that the grid stays loop-free under re-sorting:
 *
 * - A **relative** axis (no `$`) **freezes** to the stable identity currently at
 *   that position — `A` → `COLUMN("fieldAtColumnA")`, `1` → `ROW(idAtRow1)`. The
 *   reference no longer moves when the grid is re-sorted, and it shifts by the
 *   paste offset like an Excel relative reference.
 * - An **absolute** axis (`$`) stays **positional** — `$A` → `COLUMN_POSITION(1)`,
 *   `$1` → `ROW_POSITION(1)`. It follows the grid position (tracks re-sorts) and
 *   does not shift on paste.
 *
 * The transform is purely textual: it rewrites the A1 reference tokens and copies
 * every other token (operators, function calls, string literals, numbers, bare
 * field references, already-canonical forms) verbatim. A token only reads as a
 * cell reference when it is `<letters><digits>` not followed by more identifier
 * characters or `(` — so `LOG10(...)` stays a call and a field literally named
 * `A1` must be written `FIELD("A1")`.
 */

const ZERO_SPAN: FormulaSourceSpan = { start: 0, end: 0 };

// `$?` column letters, `$?` row digits, with a boundary that rejects a longer
// identifier (`LOG10X`) or a call (`LOG10(`).
const CELL_REF_REGEX = /^(\$?)([A-Za-z]+)(\$?)([0-9]+)(?![A-Za-z0-9_(])/;
// Column letters with the same boundary, for `A:A` whole-column ranges.
const COLUMN_LETTERS_REGEX = /^(\$?)([A-Za-z]+)(?![A-Za-z0-9_(])/;
const IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*/;
const WHITESPACE_REGEX = /^\s+/;

/**
 * 1-based column index to bijective base-26 letters: `1` → `"A"`, `26` → `"Z"`,
 * `27` → `"AA"`. Returns `""` for non-positive or non-integer input.
 */
export function columnIndexToLetters(index: number): string {
  if (!Number.isInteger(index) || index < 1) {
    return '';
  }
  let letters = '';
  let remaining = index;
  while (remaining > 0) {
    const remainder = (remaining - 1) % 26;
    letters = String.fromCharCode(65 + remainder) + letters;
    remaining = Math.floor((remaining - 1) / 26);
  }
  return letters;
}

/**
 * Inverse of `columnIndexToLetters` (case-insensitive). `"A"` → `1`, `"AA"` → `27`.
 * Returns `0` when any character is not a Latin letter.
 */
export function columnLettersToIndex(letters: string): number {
  if (letters.length === 0) {
    return 0;
  }
  let index = 0;
  for (let i = 0; i < letters.length; i += 1) {
    const code = letters.charCodeAt(i);
    let value: number;
    if (code >= 65 && code <= 90) {
      value = code - 64; // A=1
    } else if (code >= 97 && code <= 122) {
      value = code - 96; // a=1
    } else {
      return 0;
    }
    index = index * 26 + value;
  }
  return index;
}

export interface A1TransformContext {
  positionContext: FormulaPositionContext;
}

export interface ToCanonicalOptions {
  /**
   * Added to relative (no-`$`) column positions before freezing — the Excel-style
   * fill adjustment applied when an A1 formula is pasted away from its origin.
   * @default 0
   */
  columnOffset?: number;
  /**
   * Added to relative (no-`$`) row positions before freezing.
   * @default 0
   */
  rowOffset?: number;
}

export interface A1TransformResult {
  /**
   * The expression in canonical syntax (without the leading `=`). Unrecognized
   * text is copied through unchanged, so a malformed A1 expression yields a
   * malformed canonical expression that fails as `#ERROR!` at evaluation —
   * consistent with the permissive-commit rule.
   */
  source: string;
  /**
   * `true` when at least one A1 reference token was rewritten — lets the adapter
   * skip the canonical store when nothing changed.
   */
  changed: boolean;
}

interface ParsedRef {
  columnAbsolute: boolean;
  letters: string;
  rowAbsolute: boolean;
  rowNumber: number;
}

function buildColumnSelector(
  ref: ParsedRef,
  context: FormulaPositionContext,
  columnOffset: number,
): FormulaColumnSelector {
  const baseIndex = columnLettersToIndex(ref.letters);
  if (ref.columnAbsolute) {
    // Absolute (`$`) axis is positional and never shifts on paste.
    return { kind: 'position', index: baseIndex };
  }
  // Relative axis freezes to the field currently at the (offset) position.
  const position = baseIndex + columnOffset;
  if (position >= 1) {
    const field = context.getFieldAtPosition(position);
    if (field !== undefined) {
      return { kind: 'field', field };
    }
  }
  // Out of bounds: a positional selector resolves to `#REF!` at bind time.
  return { kind: 'position', index: position >= 1 ? position : baseIndex };
}

function buildRowSelector(
  ref: ParsedRef,
  context: FormulaPositionContext,
  rowOffset: number,
): FormulaRowSelector {
  if (ref.rowAbsolute) {
    return { kind: 'position', index: ref.rowNumber };
  }
  const position = ref.rowNumber + rowOffset;
  if (position >= 1) {
    const id = context.getRowIdAtPosition(position);
    if (id !== undefined) {
      return { kind: 'id', id };
    }
  }
  return { kind: 'position', index: position >= 1 ? position : ref.rowNumber };
}

function buildCellRefNode(
  ref: ParsedRef,
  context: FormulaPositionContext,
  columnOffset: number,
  rowOffset: number,
): FormulaCellRefNode {
  return {
    type: 'cellRef',
    column: buildColumnSelector(ref, context, columnOffset),
    row: buildRowSelector(ref, context, rowOffset),
    span: ZERO_SPAN,
  };
}

function readParsedRef(match: RegExpExecArray): ParsedRef {
  return {
    columnAbsolute: match[1] === '$',
    letters: match[2],
    rowAbsolute: match[3] === '$',
    rowNumber: parseInt(match[4], 10),
  };
}

function skipInlineWhitespace(expression: string, from: number): number {
  let index = from;
  while (index < expression.length && /\s/.test(expression[index])) {
    index += 1;
  }
  return index;
}

/**
 * Advances past a `"`-delimited string literal (with `""` escapes), returning the
 * index just after the closing quote (or the end of the input when unterminated).
 */
function scanStringLiteral(expression: string, start: number): number {
  let index = start + 1;
  while (index < expression.length) {
    if (expression[index] === '"') {
      if (expression[index + 1] === '"') {
        index += 2;
        continue;
      }
      return index + 1;
    }
    index += 1;
  }
  return expression.length;
}

/**
 * After a cell reference at `afterFirst`, matches an optional `: <cellRef>` tail
 * that turns it into a `RANGE`.
 */
function matchRangeTail(
  expression: string,
  afterFirst: number,
): { endRef: ParsedRef; end: number } | null {
  let index = skipInlineWhitespace(expression, afterFirst);
  if (expression[index] !== ':') {
    return null;
  }
  index = skipInlineWhitespace(expression, index + 1);
  const match = CELL_REF_REGEX.exec(expression.slice(index));
  if (match === null) {
    return null;
  }
  return { endRef: readParsedRef(match), end: index + match[0].length };
}

/**
 * Matches a whole-column range `A:A`. Only same-column ranges map to a single
 * `COLUMN_VALUES`; mixed columns return `null` and are copied verbatim.
 */
function matchColumnRange(
  expression: string,
  start: number,
): { letters: string; absolute: boolean; end: number } | null {
  const first = COLUMN_LETTERS_REGEX.exec(expression.slice(start));
  if (first === null) {
    return null;
  }
  let index = skipInlineWhitespace(expression, start + first[0].length);
  if (expression[index] !== ':') {
    return null;
  }
  index = skipInlineWhitespace(expression, index + 1);
  const second = COLUMN_LETTERS_REGEX.exec(expression.slice(index));
  if (second === null || first[2].toUpperCase() !== second[2].toUpperCase()) {
    return null;
  }
  return { letters: first[2], absolute: first[1] === '$', end: index + second[0].length };
}

function buildColumnValuesNode(
  range: { letters: string; absolute: boolean },
  context: FormulaPositionContext,
  columnOffset: number,
): FormulaColumnValuesNode | null {
  const baseIndex = columnLettersToIndex(range.letters);
  // No positional `COLUMN_VALUES` form exists, so a whole-column range always
  // freezes to a field name regardless of `$`.
  const position = range.absolute ? baseIndex : baseIndex + columnOffset;
  if (position < 1) {
    return null;
  }
  const field = context.getFieldAtPosition(position);
  if (field === undefined) {
    return null;
  }
  return { type: 'columnValues', field, span: ZERO_SPAN };
}

/**
 * Rewrites an A1-dialect expression (without the leading `=`) into the canonical
 * dialect. Never throws.
 */
export function toCanonicalFormula(
  expression: string,
  context: A1TransformContext,
  options: ToCanonicalOptions = {},
): A1TransformResult {
  const { positionContext } = context;
  const columnOffset = options.columnOffset ?? 0;
  const rowOffset = options.rowOffset ?? 0;

  let result = '';
  let changed = false;
  let index = 0;

  while (index < expression.length) {
    const rest = expression.slice(index);
    const char = expression[index];

    if (char === '"') {
      const end = scanStringLiteral(expression, index);
      result += expression.slice(index, end);
      index = end;
      continue;
    }

    const whitespace = WHITESPACE_REGEX.exec(rest);
    if (whitespace !== null) {
      result += whitespace[0];
      index += whitespace[0].length;
      continue;
    }

    const cellMatch = CELL_REF_REGEX.exec(rest);
    if (cellMatch !== null) {
      const startRef = readParsedRef(cellMatch);
      const rangeTail = matchRangeTail(expression, index + cellMatch[0].length);
      if (rangeTail !== null) {
        const rangeNode: FormulaRangeNode = {
          type: 'range',
          start: buildCellRefNode(startRef, positionContext, columnOffset, rowOffset),
          end: buildCellRefNode(rangeTail.endRef, positionContext, columnOffset, rowOffset),
          span: ZERO_SPAN,
        };
        result += serializeFormulaAst(rangeNode);
        index = rangeTail.end;
      } else {
        result += serializeFormulaAst(
          buildCellRefNode(startRef, positionContext, columnOffset, rowOffset),
        );
        index += cellMatch[0].length;
      }
      changed = true;
      continue;
    }

    const columnRange = matchColumnRange(expression, index);
    if (columnRange !== null) {
      const node = buildColumnValuesNode(columnRange, positionContext, columnOffset);
      if (node !== null) {
        result += serializeFormulaAst(node);
        index = columnRange.end;
        changed = true;
        continue;
      }
    }

    const identifier = IDENTIFIER_REGEX.exec(rest);
    if (identifier !== null) {
      result += identifier[0];
      index += identifier[0].length;
      continue;
    }

    result += char;
    index += 1;
  }

  return { source: result, changed };
}

function cellRefToA1(node: FormulaCellRefNode, context: FormulaPositionContext): string | null {
  let columnPart: string;
  if (node.column.kind === 'position') {
    // Positional column is rendered as the absolute (`$`) A1 axis.
    columnPart = `$${columnIndexToLetters(node.column.index)}`;
  } else {
    const position = context.getPositionOfField(node.column.field);
    if (position === undefined) {
      return null;
    }
    columnPart = columnIndexToLetters(position);
  }

  let rowPart: string;
  if (node.row.kind === 'position') {
    rowPart = `$${node.row.index}`;
  } else {
    const position = context.getPositionOfRowId(node.row.id);
    if (position === undefined) {
      return null;
    }
    rowPart = String(position);
  }

  return `${columnPart}${rowPart}`;
}

function serializeA1Operand(
  node: FormulaAstNode,
  minPrecedence: number,
  context: FormulaPositionContext,
): string {
  const text = serializeA1Node(node, context);
  if (
    node.type === 'binaryExpression' &&
    FORMULA_BINARY_PRECEDENCE[node.operator] < minPrecedence
  ) {
    return `(${text})`;
  }
  return text;
}

function serializeA1Node(node: FormulaAstNode, context: FormulaPositionContext): string {
  switch (node.type) {
    case 'cellRef': {
      const a1 = cellRefToA1(node, context);
      return a1 ?? serializeFormulaAst(node);
    }
    case 'range': {
      const start = cellRefToA1(node.start, context);
      const end = cellRefToA1(node.end, context);
      if (start !== null && end !== null) {
        return `${start}:${end}`;
      }
      return serializeFormulaAst(node);
    }
    case 'columnValues': {
      const position = context.getPositionOfField(node.field);
      if (position !== undefined) {
        const letters = columnIndexToLetters(position);
        return `${letters}:${letters}`;
      }
      return serializeFormulaAst(node);
    }
    case 'unaryExpression': {
      const operand = serializeA1Node(node.operand, context);
      if (node.operand.type === 'binaryExpression' || node.operand.type === 'unaryExpression') {
        return `${node.operator}(${operand})`;
      }
      return `${node.operator}${operand}`;
    }
    case 'binaryExpression': {
      const precedence = FORMULA_BINARY_PRECEDENCE[node.operator];
      const left = serializeA1Operand(node.left, precedence, context);
      const right = serializeA1Operand(node.right, precedence + 1, context);
      return `${left} ${node.operator} ${right}`;
    }
    case 'functionCall':
      return `${node.name}(${node.args.map((arg) => serializeA1Node(arg, context)).join(', ')})`;
    default:
      // Literals and bare field references render identically in both dialects.
      return serializeFormulaAst(node);
  }
}

/**
 * Renders a canonical expression (without the leading `=`) into A1 notation for
 * editing. References whose identity has no current position (hidden column,
 * filtered-out row) fall back to canonical form inline. Never throws; returns the
 * input unchanged when it is not parseable as canonical.
 */
export function toDisplayFormula(expression: string, context: A1TransformContext): string {
  const { ast } = parseFormula(expression);
  if (ast === null) {
    return expression;
  }
  return serializeA1Node(ast, context.positionContext);
}
