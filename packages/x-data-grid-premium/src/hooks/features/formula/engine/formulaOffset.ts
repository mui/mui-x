import type {
  FormulaAstNode,
  FormulaCellRefNode,
  FormulaColumnSelector,
  FormulaColumnValuesNode,
  FormulaFieldRefNode,
  FormulaRangeNode,
  FormulaRowSelector,
} from './formulaAst';
import type { FormulaPositionContext } from './formulaTypes';

/**
 * Shifts every relative reference in a parsed formula by a positional delta —
 * the Excel fill-handle rule: a reference moves by the same `(rowDelta,
 * columnDelta)` as the cell it lives in, so `=A1*B1` dragged down one row
 * becomes `=A2*B2`. The delta is measured in the position context's units
 * (sorted + filtered visible order, 1-based), the same space the A1 display,
 * paste adjustment and `ROW_POSITION` use, so offsets can never disagree with
 * what the user sees.
 *
 * Selector semantics mirror `buildColumnSelector`/`buildRowSelector` in
 * `formulaA1.ts`:
 * - **Positional** selectors (`COLUMN_POSITION`/`ROW_POSITION`, the canonical
 *   form of `$`-absolute refs) never shift — they are absolute.
 * - **Stable** selectors (`COLUMN("field")`/`ROW(id)`, the canonical form of
 *   relative refs) re-anchor to the field/row now at `position + delta`.
 * - **Overshoot** past the last row/column freezes to a positional selector
 *   that resolves to `#REF!` (and recovers if the grid later grows — consistent
 *   with the engine's positional-out-of-range semantics).
 * - **Underflow** past the first row/column keeps the original reference: the
 *   1-based canonical store has no representable out-of-bounds-low position
 *   (the parser rejects `ROW_POSITION(0)`), so the reference stays put rather
 *   than corrupting the whole formula into `#ERROR!`.
 *
 * Pure: engine types only, no grid imports. The walk is recursive, bounded by
 * the parser's AST-height limit exactly like the serializer and evaluator.
 */
export function offsetFormulaReferences(
  ast: FormulaAstNode,
  rowDelta: number,
  columnDelta: number,
  context: FormulaPositionContext,
): FormulaAstNode {
  if (rowDelta === 0 && columnDelta === 0) {
    return ast;
  }
  return offsetNode(ast, rowDelta, columnDelta, context);
}

function offsetColumnSelector(
  selector: FormulaColumnSelector,
  columnDelta: number,
  context: FormulaPositionContext,
): FormulaColumnSelector {
  if (selector.kind === 'position' || columnDelta === 0) {
    return selector;
  }
  const position = context.getPositionOfField(selector.field);
  if (position === undefined) {
    return selector;
  }
  const newPosition = position + columnDelta;
  if (newPosition < 1) {
    return selector;
  }
  const field = context.getFieldAtPosition(newPosition);
  if (field !== undefined) {
    return { kind: 'field', field };
  }
  // Overshoot: a positional selector resolves to `#REF!` at evaluation time.
  return { kind: 'position', index: newPosition };
}

function offsetRowSelector(
  selector: FormulaRowSelector,
  rowDelta: number,
  context: FormulaPositionContext,
): FormulaRowSelector {
  if (selector.kind === 'position' || rowDelta === 0) {
    return selector;
  }
  const position = context.getPositionOfRowId(selector.id);
  if (position === undefined) {
    return selector;
  }
  const newPosition = position + rowDelta;
  if (newPosition < 1) {
    return selector;
  }
  const id = context.getRowIdAtPosition(newPosition);
  if (id !== undefined) {
    return { kind: 'id', id };
  }
  // Overshoot: a positional selector resolves to `#REF!` at evaluation time.
  return { kind: 'position', index: newPosition };
}

function offsetCellRef(
  node: FormulaCellRefNode,
  rowDelta: number,
  columnDelta: number,
  context: FormulaPositionContext,
): FormulaCellRefNode {
  return {
    ...node,
    column: offsetColumnSelector(node.column, columnDelta, context),
    row: offsetRowSelector(node.row, rowDelta, context),
  };
}

function offsetRange(
  node: FormulaRangeNode,
  rowDelta: number,
  columnDelta: number,
  context: FormulaPositionContext,
): FormulaRangeNode {
  return {
    ...node,
    start: offsetCellRef(node.start, rowDelta, columnDelta, context),
    end: offsetCellRef(node.end, rowDelta, columnDelta, context),
  };
}

/**
 * A same-row field reference (`price`) or whole-column reference
 * (`COLUMN_VALUES("price")`) has no row axis: it only shifts on horizontal
 * fill, to the field now at `position + columnDelta`. It has no positional
 * form, so an out-of-bounds shift keeps the original field.
 */
function offsetFieldOnly<T extends FormulaFieldRefNode | FormulaColumnValuesNode>(
  node: T,
  columnDelta: number,
  context: FormulaPositionContext,
): T {
  if (columnDelta === 0) {
    return node;
  }
  const position = context.getPositionOfField(node.field);
  if (position === undefined) {
    return node;
  }
  const newPosition = position + columnDelta;
  if (newPosition < 1) {
    return node;
  }
  const field = context.getFieldAtPosition(newPosition);
  if (field === undefined || field === node.field) {
    return node;
  }
  return { ...node, field };
}

function offsetNode(
  node: FormulaAstNode,
  rowDelta: number,
  columnDelta: number,
  context: FormulaPositionContext,
): FormulaAstNode {
  switch (node.type) {
    case 'cellRef':
      return offsetCellRef(node, rowDelta, columnDelta, context);
    case 'range':
      return offsetRange(node, rowDelta, columnDelta, context);
    case 'fieldRef':
    case 'columnValues':
      return offsetFieldOnly(node, columnDelta, context);
    case 'unaryExpression':
      return { ...node, operand: offsetNode(node.operand, rowDelta, columnDelta, context) };
    case 'binaryExpression':
      return {
        ...node,
        left: offsetNode(node.left, rowDelta, columnDelta, context),
        right: offsetNode(node.right, rowDelta, columnDelta, context),
      };
    case 'functionCall':
      return {
        ...node,
        args: node.args.map((arg) => offsetNode(arg, rowDelta, columnDelta, context)),
      };
    default:
      // Literals carry no references.
      return node;
  }
}
