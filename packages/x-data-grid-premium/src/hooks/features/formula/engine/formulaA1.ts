import { FORMULA_BINARY_PRECEDENCE } from './formulaAst';
import type {
  FormulaAstNode,
  FormulaCellRefNode,
  FormulaColumnSelector,
  FormulaColumnValuesNode,
  FormulaRangeAxis,
  FormulaRangeRefNode,
  FormulaRowSelector,
} from './formulaAst';
import {
  CELL_REF_REGEX,
  IDENTIFIER_REGEX,
  WHITESPACE_REGEX,
  matchColumnRange,
  matchRangeTail,
  readParsedRef,
  scanStringLiteral,
} from './formulaA1Tokens';
import type { ParsedRef } from './formulaA1Tokens';
import { parseFormula } from './formulaParser';
import { serializeFormulaAst } from './formulaSerializer';
import type { FormulaCellRef, FormulaPositionContext, FormulaSourceSpan } from './formulaTypes';

/**
 * A1 notation is an editor-facing dialect layered on top of the canonical
 * (`REF`/`RANGE_REF`/`COLUMN_VALUES`) syntax. It is never stored: `toCanonicalFormula`
 * runs at commit/paste and `toDisplayFormula` runs at edit-begin. The canonical
 * dialect is a superset, so any canonical formula round-trips through `toDisplay`
 * losslessly (refs without a current position render in canonical form inline).
 *
 * Reference convention (D5) for single cells, inverted from Excel's `$`
 * semantics on purpose so that the grid stays loop-free under re-sorting:
 *
 * - A **relative** axis (no `$`) **freezes** to the stable identity currently at
 *   that position — `A` → `COLUMN("fieldAtColumnA")`, `1` → `ROW(idAtRow1)`. The
 *   reference no longer moves when the grid is re-sorted, and it shifts by the
 *   paste offset like an Excel relative reference.
 * - An **absolute** axis (`$`) stays **positional** — `$A` → `COLUMN_POSITION(1)`,
 *   `$1` → `ROW_POSITION(1)`. It follows the grid position (tracks re-sorts) and
 *   does not shift on paste.
 *
 * Ranges follow the Sheets model instead: a plain (no-`$`) endpoint axis
 * freezes to an `ANCHOR(delta)` offset from the cell committing the formula, so
 * the window keeps its geometry relative to the formula under re-sorting and
 * copies verbatim on fill/paste; a `$` axis freezes to the absolute view
 * position (`FIXED`) and never adjusts — on fill or on movement. So `$` means
 * the same thing on single refs and range endpoints: positional, tracking the
 * view. When the committing cell is a pinned row (or no anchor is supplied),
 * plain axes freeze to absolute non-fixed positions — a pinned summary is
 * outside the data band, so "relative to me" has no meaning and a fixed window
 * that shifts on fill is what Sheets' outside-the-range totals do too.
 *
 * The transform is purely textual: it rewrites the A1 reference tokens and copies
 * every other token (operators, function calls, string literals, numbers, bare
 * field references, already-canonical forms) verbatim. A token only reads as a
 * cell reference when it is `<letters><digits>` not followed by more identifier
 * characters or `(` — so `LOG10(...)` stays a call and a field literally named
 * `A1` must be written `FIELD("A1")`.
 */

const ZERO_SPAN: FormulaSourceSpan = { start: 0, end: 0 };

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
  /**
   * The cell the formula is being committed to / displayed for. Plain range
   * endpoints freeze to `ANCHOR(delta)` offsets from this cell when it sits in
   * the data band, and anchor axes render as `anchorPosition + delta` at
   * display time. Without it (or with a pinned/positionless cell), plain range
   * endpoints freeze to absolute positions and anchor axes display in
   * canonical form inline.
   */
  anchorCell?: FormulaCellRef;
}

export interface ToCanonicalOptions {
  /**
   * Added to relative (no-`$`) column positions — the Excel-style fill
   * adjustment applied when an A1 formula is pasted away from its origin.
   * Single-cell refs freeze the offset position to an identity; range window
   * axes freeze the offset position (as an anchor delta for in-band anchors).
   * @default 0
   */
  columnOffset?: number;
  /**
   * Added to relative (no-`$`) row positions.
   * @default 0
   */
  rowOffset?: number;
}

/**
 * The freeze target for plain range axes: the committing cell's view position,
 * or `null` when plain axes must freeze to absolute positions instead — no
 * anchor cell supplied, its row filtered out or pinned (outside the data
 * band), or its column hidden. The band test is on the ROW: a pinned summary's
 * window must not follow anything, its column axes included, so band
 * membership decides the whole endpoint at once.
 */
export function getRangeFreezeAnchor(
  context: FormulaPositionContext,
  anchorCell: FormulaCellRef | undefined,
): { rowIndex: number; columnIndex: number } | null {
  if (anchorCell === undefined) {
    return null;
  }
  const rowIndex = context.getPositionOfRowId(anchorCell.id);
  if (
    rowIndex === undefined ||
    rowIndex < context.dataFromIndex ||
    rowIndex > context.dataToIndex
  ) {
    return null;
  }
  const columnIndex = context.getPositionOfField(anchorCell.field);
  if (columnIndex === undefined) {
    return null;
  }
  return { rowIndex, columnIndex };
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

export function buildCellRefNode(
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

function buildRangeAxis(
  baseIndex: number,
  absolute: boolean,
  offset: number,
  anchorIndex: number | null,
): FormulaRangeAxis {
  if (absolute) {
    // `$` on a range endpoint is absolute: it never adjusts, on fill or on movement.
    return { kind: 'position', index: baseIndex, fixed: true };
  }
  // The paste/fill offset applies to the literal position first (Excel fill
  // arithmetic), then the result freezes — against the anchor when there is
  // one, absolutely otherwise. Underflow clamps at 1 exactly like the
  // positional arm, so both freeze modes agree on what a shifted axis means.
  const position = Math.max(1, baseIndex + offset);
  if (anchorIndex !== null) {
    return { kind: 'anchor', delta: position - anchorIndex };
  }
  return { kind: 'position', index: position, fixed: false };
}

/**
 * Builds the window for an A1 range (`A1:B5`). A `$` axis stores its absolute
 * view position; a plain axis stores an `ANCHOR` offset from `anchor` (the
 * committing in-band cell) or, without an anchor, the absolute position in
 * today's non-fixed form. Out-of-view positions are stored as written and clip
 * (positional) or error (anchor) at resolve time.
 */
export function buildRangeRefNode(
  startRef: ParsedRef,
  endRef: ParsedRef,
  columnOffset: number,
  rowOffset: number,
  anchor: { rowIndex: number; columnIndex: number } | null = null,
): FormulaRangeRefNode {
  const anchorRow = anchor === null ? null : anchor.rowIndex;
  const anchorColumn = anchor === null ? null : anchor.columnIndex;
  return {
    type: 'rangeRef',
    columnFrom: buildRangeAxis(
      columnLettersToIndex(startRef.letters),
      startRef.columnAbsolute,
      columnOffset,
      anchorColumn,
    ),
    rowFrom: buildRangeAxis(startRef.rowNumber, startRef.rowAbsolute, rowOffset, anchorRow),
    columnTo: buildRangeAxis(
      columnLettersToIndex(endRef.letters),
      endRef.columnAbsolute,
      columnOffset,
      anchorColumn,
    ),
    rowTo: buildRangeAxis(endRef.rowNumber, endRef.rowAbsolute, rowOffset, anchorRow),
    span: ZERO_SPAN,
  };
}

export function buildColumnValuesNode(
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
  const rangeAnchor = getRangeFreezeAnchor(positionContext, context.anchorCell);

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
        const rangeNode = buildRangeRefNode(
          startRef,
          rangeTail.endRef,
          columnOffset,
          rowOffset,
          rangeAnchor,
        );
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

/**
 * The owner positions anchor axes render against at display time. Band
 * membership is irrelevant here — rendering only needs a position to add the
 * delta to.
 */
interface A1DisplayAnchor {
  rowIndex: number | undefined;
  columnIndex: number | undefined;
}

/**
 * Resolves one range axis to the 1-based view position its A1 token shows.
 * `null` when an anchor axis has no owner position, or resolves below 1 — A1
 * has no token for either, and rendering a clamped position would silently
 * re-freeze to different offsets on the next edited commit.
 */
function rangeAxisDisplayIndex(
  axis: FormulaRangeAxis,
  anchorIndex: number | undefined,
): number | null {
  if (axis.kind === 'position') {
    return axis.index;
  }
  if (anchorIndex === undefined) {
    return null;
  }
  const resolved = anchorIndex + axis.delta;
  return resolved >= 1 ? resolved : null;
}

/**
 * Renders a range window in A1, or `null` for the whole-range canonical
 * fallback (an anchor axis without a renderable position — see
 * `rangeAxisDisplayIndex`). Positional windows always render, including ones
 * that currently clip against the view edge.
 */
function rangeRefToA1(node: FormulaRangeRefNode, anchor: A1DisplayAnchor): string | null {
  const columnFrom = rangeAxisDisplayIndex(node.columnFrom, anchor.columnIndex);
  const rowFrom = rangeAxisDisplayIndex(node.rowFrom, anchor.rowIndex);
  const columnTo = rangeAxisDisplayIndex(node.columnTo, anchor.columnIndex);
  const rowTo = rangeAxisDisplayIndex(node.rowTo, anchor.rowIndex);
  if (columnFrom === null || rowFrom === null || columnTo === null || rowTo === null) {
    return null;
  }
  const columnPart = (axis: FormulaRangeAxis, index: number) =>
    `${axis.kind === 'position' && axis.fixed ? '$' : ''}${columnIndexToLetters(index)}`;
  const rowPart = (axis: FormulaRangeAxis, index: number) =>
    `${axis.kind === 'position' && axis.fixed ? '$' : ''}${index}`;
  return `${columnPart(node.columnFrom, columnFrom)}${rowPart(node.rowFrom, rowFrom)}:${columnPart(node.columnTo, columnTo)}${rowPart(node.rowTo, rowTo)}`;
}

function serializeA1Operand(
  node: FormulaAstNode,
  minPrecedence: number,
  context: FormulaPositionContext,
  anchor: A1DisplayAnchor,
): string {
  const text = serializeA1Node(node, context, anchor);
  if (
    node.type === 'binaryExpression' &&
    FORMULA_BINARY_PRECEDENCE[node.operator] < minPrecedence
  ) {
    return `(${text})`;
  }
  return text;
}

function serializeA1Node(
  node: FormulaAstNode,
  context: FormulaPositionContext,
  anchor: A1DisplayAnchor,
): string {
  switch (node.type) {
    case 'cellRef': {
      const a1 = cellRefToA1(node, context);
      return a1 ?? serializeFormulaAst(node);
    }
    case 'rangeRef': {
      const a1 = rangeRefToA1(node, anchor);
      return a1 ?? serializeFormulaAst(node);
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
      const operand = serializeA1Node(node.operand, context, anchor);
      if (node.operand.type === 'binaryExpression' || node.operand.type === 'unaryExpression') {
        return `${node.operator}(${operand})`;
      }
      return `${node.operator}${operand}`;
    }
    case 'binaryExpression': {
      const precedence = FORMULA_BINARY_PRECEDENCE[node.operator];
      const left = serializeA1Operand(node.left, precedence, context, anchor);
      const right = serializeA1Operand(node.right, precedence + 1, context, anchor);
      return `${left} ${node.operator} ${right}`;
    }
    case 'functionCall':
      return `${node.name}(${node.args.map((arg) => serializeA1Node(arg, context, anchor)).join(', ')})`;
    default:
      // Literals and bare field references render identically in both dialects.
      return serializeFormulaAst(node);
  }
}

const NO_DISPLAY_ANCHOR: A1DisplayAnchor = { rowIndex: undefined, columnIndex: undefined };

/**
 * Renders a canonical expression (without the leading `=`) into A1 notation for
 * editing. References whose identity has no current position (hidden column,
 * filtered-out row) and anchor-relative range axes without a renderable
 * position fall back to canonical form inline. Never throws; returns the input
 * unchanged when it is not parseable as canonical.
 */
export function toDisplayFormula(expression: string, context: A1TransformContext): string {
  const { ast } = parseFormula(expression);
  if (ast === null) {
    return expression;
  }
  const { positionContext, anchorCell } = context;
  const anchor: A1DisplayAnchor =
    anchorCell === undefined
      ? NO_DISPLAY_ANCHOR
      : {
          rowIndex: positionContext.getPositionOfRowId(anchorCell.id),
          columnIndex: positionContext.getPositionOfField(anchorCell.field),
        };
  return serializeA1Node(ast, positionContext, anchor);
}
