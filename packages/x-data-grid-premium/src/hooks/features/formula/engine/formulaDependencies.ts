import type {
  FormulaAstNode,
  FormulaCellRefNode,
  FormulaColumnSelector,
  FormulaRangeNode,
  FormulaRowSelector,
} from './formulaAst';
import { createFormulaCellKey } from './formulaTypes';
import type {
  FormulaCellKey,
  FormulaCellRef,
  FormulaPositionContext,
  FormulaRowId,
} from './formulaTypes';
import { createFormulaError, isFormulaErrorValue } from './formulaErrors';
import type { FormulaErrorValue } from './formulaErrors';

/**
 * Context-free dependency description, extracted with a pure AST walk.
 * Positional selectors are reported structurally — they cannot become
 * concrete cell keys until bound against a position context.
 */
export interface FormulaStaticDependencies {
  /**
   * Same-row field references; they bind to `(ownerRow, field)`.
   */
  fieldRefs: Set<string>;
  /**
   * Explicit `REF(...)` nodes, any selector mix.
   */
  cellRefs: FormulaCellRefNode[];
  ranges: FormulaRangeNode[];
  columnValues: Set<string>;
  /**
   * `true` when any positional selector, `RANGE` or `COLUMN_VALUES` is present —
   * the formula must rebind when the position context changes.
   */
  usesPositionContext: boolean;
  /**
   * Uppercase function names — used for `#NAME?` analysis and
   * registry-change invalidation.
   */
  calls: Set<string>;
}

export function extractFormulaDependencies(ast: FormulaAstNode): FormulaStaticDependencies {
  const dependencies: FormulaStaticDependencies = {
    fieldRefs: new Set(),
    cellRefs: [],
    ranges: [],
    columnValues: new Set(),
    usesPositionContext: false,
    calls: new Set(),
  };

  const stack: FormulaAstNode[] = [ast];
  while (stack.length > 0) {
    const node = stack.pop()!;
    switch (node.type) {
      case 'fieldRef':
        dependencies.fieldRefs.add(node.field);
        break;
      case 'cellRef':
        dependencies.cellRefs.push(node);
        if (node.column.kind === 'position' || node.row.kind === 'position') {
          dependencies.usesPositionContext = true;
        }
        break;
      case 'range':
        dependencies.ranges.push(node);
        dependencies.usesPositionContext = true;
        break;
      case 'columnValues':
        dependencies.columnValues.add(node.field);
        dependencies.usesPositionContext = true;
        break;
      case 'functionCall':
        dependencies.calls.add(node.name);
        for (let i = node.args.length - 1; i >= 0; i -= 1) {
          stack.push(node.args[i]);
        }
        break;
      case 'unaryExpression':
        stack.push(node.operand);
        break;
      case 'binaryExpression':
        stack.push(node.right);
        stack.push(node.left);
        break;
      default:
        break;
    }
  }

  return dependencies;
}

/**
 * A bounded single-column slice of a range: rows `fromIndex..toIndex`
 * (1-based, inclusive) of `field` in the position context's row order.
 */
export interface FormulaColumnIntervalDependency {
  field: string;
  fromIndex: number;
  toIndex: number;
}

/**
 * A `COLUMN_VALUES` dependency on every row of `field` in the position
 * context. The `whole: true` literal is a discriminant: it keeps interval
 * records (otherwise structurally assignable to `{ field }`) out of
 * `wholeColumns`, and lets interval and whole-column records be told apart
 * when mixed in a single per-field list (the adapter's reverse range map).
 */
export interface FormulaWholeColumnDependency {
  field: string;
  whole: true;
}

/**
 * Dependencies resolved against a position-context snapshot.
 * Ranges bind to interval records, never to exploded per-cell edges.
 */
export interface FormulaBoundDependencies {
  cells: Set<FormulaCellKey>;
  columnIntervals: FormulaColumnIntervalDependency[];
  wholeColumns: FormulaWholeColumnDependency[];
  /**
   * Unresolvable references found during binding. Binding never throws;
   * evaluation short-circuits to the first of these errors.
   */
  errors: FormulaErrorValue[];
}

interface ResolvedAnchor {
  columnIndex: number;
  rowIndex: number;
}

/**
 * The normalized rectangle a `RANGE(...)` node spans in a position context.
 * All indexes are 1-based and inclusive.
 */
export interface FormulaRangeRectangle {
  fromColumn: number;
  toColumn: number;
  fromIndex: number;
  toIndex: number;
}

function resolveColumnIndex(
  selector: FormulaColumnSelector,
  context: FormulaPositionContext,
): number | FormulaErrorValue {
  if (selector.kind === 'position') {
    if (context.getFieldAtPosition(selector.index) === undefined) {
      return createFormulaError('#REF!', `There is no column at position ${selector.index}.`);
    }
    return selector.index;
  }
  const index = context.getPositionOfField(selector.field);
  if (index === undefined) {
    return createFormulaError(
      '#REF!',
      `The column "${selector.field}" has no position in the current view.`,
    );
  }
  return index;
}

function resolveRowIndex(
  selector: FormulaRowSelector,
  context: FormulaPositionContext,
): number | FormulaErrorValue {
  if (selector.kind === 'position') {
    if (context.getRowIdAtPosition(selector.index) === undefined) {
      return createFormulaError('#REF!', `There is no row at position ${selector.index}.`);
    }
    return selector.index;
  }
  const index = context.getPositionOfRowId(selector.id);
  if (index === undefined) {
    return createFormulaError(
      '#REF!',
      `The row with id "${selector.id}" has no position in the current view.`,
    );
  }
  return index;
}

function isErrorValue(value: number | FormulaErrorValue): value is FormulaErrorValue {
  return typeof value !== 'number';
}

function resolveAnchor(
  anchor: FormulaCellRefNode,
  context: FormulaPositionContext,
): ResolvedAnchor | FormulaErrorValue {
  const columnIndex = resolveColumnIndex(anchor.column, context);
  if (isErrorValue(columnIndex)) {
    return columnIndex;
  }
  const rowIndex = resolveRowIndex(anchor.row, context);
  if (isErrorValue(rowIndex)) {
    return rowIndex;
  }
  return { columnIndex, rowIndex };
}

/**
 * Resolves a `RANGE` node's anchors against a position context and normalizes
 * them (`RANGE(B5, A1)` spans the same rectangle as `RANGE(A1, B5)`). Shared
 * by dependency binding and range materialization so the two can never
 * disagree about the rectangle a range covers.
 */
export function resolveFormulaRangeRectangle(
  range: FormulaRangeNode,
  context: FormulaPositionContext,
): FormulaRangeRectangle | FormulaErrorValue {
  const start = resolveAnchor(range.start, context);
  if (isFormulaErrorValue(start)) {
    return start;
  }
  const end = resolveAnchor(range.end, context);
  if (isFormulaErrorValue(end)) {
    return end;
  }
  return {
    fromColumn: Math.min(start.columnIndex, end.columnIndex),
    toColumn: Math.max(start.columnIndex, end.columnIndex),
    fromIndex: Math.min(start.rowIndex, end.rowIndex),
    toIndex: Math.max(start.rowIndex, end.rowIndex),
  };
}

/**
 * Resolves static dependencies into concrete cell keys and column records
 * against a position-context snapshot. Stable cell refs (`ROW(id)` +
 * `COLUMN(field)`) bind without consulting positions — a stable ref to a row
 * that is currently filtered out still binds (its existence is checked at
 * evaluation time). Only positional selectors and range anchors need the
 * context.
 */
export function bindFormulaDependencies(
  ownerCell: FormulaCellRef,
  dependencies: FormulaStaticDependencies,
  context: FormulaPositionContext,
): FormulaBoundDependencies {
  const bound: FormulaBoundDependencies = {
    cells: new Set(),
    columnIntervals: [],
    wholeColumns: [],
    errors: [],
  };

  for (const field of dependencies.fieldRefs) {
    bound.cells.add(createFormulaCellKey(ownerCell.id, field));
  }

  for (const cellRef of dependencies.cellRefs) {
    let field: string | undefined;
    if (cellRef.column.kind === 'field') {
      field = cellRef.column.field;
    } else {
      field = context.getFieldAtPosition(cellRef.column.index);
      if (field === undefined) {
        bound.errors.push(
          createFormulaError('#REF!', `There is no column at position ${cellRef.column.index}.`),
        );
        continue;
      }
    }

    let id: FormulaRowId | undefined;
    if (cellRef.row.kind === 'id') {
      id = cellRef.row.id;
    } else {
      id = context.getRowIdAtPosition(cellRef.row.index);
      if (id === undefined) {
        bound.errors.push(
          createFormulaError('#REF!', `There is no row at position ${cellRef.row.index}.`),
        );
        continue;
      }
    }

    bound.cells.add(createFormulaCellKey(id, field));
  }

  for (const range of dependencies.ranges) {
    const rectangle = resolveFormulaRangeRectangle(range, context);
    if (isFormulaErrorValue(rectangle)) {
      bound.errors.push(rectangle);
      continue;
    }
    for (
      let columnIndex = rectangle.fromColumn;
      columnIndex <= rectangle.toColumn;
      columnIndex += 1
    ) {
      const field = context.getFieldAtPosition(columnIndex);
      if (field !== undefined) {
        bound.columnIntervals.push({
          field,
          fromIndex: rectangle.fromIndex,
          toIndex: rectangle.toIndex,
        });
      }
    }
  }

  for (const field of dependencies.columnValues) {
    bound.wholeColumns.push({ field, whole: true });
  }

  return bound;
}
