import type {
  FormulaAstNode,
  FormulaCellRefNode,
  FormulaRangeAxis,
  FormulaRangeRefNode,
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
  ranges: FormulaRangeRefNode[];
  columnValues: Set<string>;
  /**
   * `true` when any positional selector, `RANGE_REF` or `COLUMN_VALUES` is
   * present — the formula must rebind when the position context changes.
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
      case 'rangeRef':
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

/**
 * The normalized rectangle a `RANGE_REF(...)` node spans in a position context.
 * All indexes are 1-based and inclusive. An empty window is expressed as
 * `fromColumn > toColumn` or `fromIndex > toIndex` — never as an error.
 */
export interface FormulaRangeRectangle {
  fromColumn: number;
  toColumn: number;
  fromIndex: number;
  toIndex: number;
}

/**
 * The owner cell's current view positions — the reference point `anchor` range
 * axes resolve against. Either index is `undefined` when the owner has no
 * position on that axis (its row is filtered out, or its column is hidden).
 */
export interface FormulaRangeAnchor {
  rowIndex: number | undefined;
  columnIndex: number | undefined;
}

/**
 * Looks up the owner cell's view positions once, for the axis resolution of
 * every range in the formula.
 */
export function getFormulaRangeAnchor(
  ownerCell: FormulaCellRef,
  context: FormulaPositionContext,
): FormulaRangeAnchor {
  return {
    rowIndex: context.getPositionOfRowId(ownerCell.id),
    columnIndex: context.getPositionOfField(ownerCell.field),
  };
}

/**
 * Resolves one range axis to a view position, or to the `#REF!` that dooms the
 * whole range. `position` axes resolve to their stored index (clipping happens
 * later). `anchor` axes are strict: without an owner position there is no
 * reference point, and a resolved endpoint outside the addressable span means
 * the window's geometry does not fit the current view — clipping either case
 * would silently aggregate a different set of cells than the one the user
 * anchored to themselves.
 */
function resolveRangeAxisIndex(
  axis: FormulaRangeAxis,
  anchorIndex: number | undefined,
  bounds: { from: number; to: number },
  axisName: 'row' | 'column',
): number | FormulaErrorValue {
  if (axis.kind === 'position') {
    return axis.index;
  }
  if (anchorIndex === undefined) {
    return createFormulaError(
      '#REF!',
      `The formula's ${axisName} has no position in the current view, so its relative range cannot resolve.`,
    );
  }
  const resolved = anchorIndex + axis.delta;
  if (resolved < bounds.from || resolved > bounds.to) {
    return createFormulaError(
      '#REF!',
      axisName === 'row'
        ? 'The relative range extends outside the data rows in the current view.'
        : 'The relative range extends outside the visible columns in the current view.',
    );
  }
  return resolved;
}

/**
 * Resolves a `RANGE_REF` window against a position context and the owner cell's
 * anchor: `anchor` axes resolve to `ownerPosition + delta` (strict — see
 * `resolveRangeAxisIndex`), then the endpoints are normalized
 * (`RANGE_REF(B5..A1)` spans the same rectangle as `A1..B5`) and `position`
 * endpoints auto-clip to the current view — a window larger than the view
 * covers whatever is available instead of erroring. Shared by dependency
 * binding, range materialization, reference highlighting and the Excel export
 * so the four can never disagree about the rectangle a range covers.
 */
export function resolveFormulaRangeRectangle(
  range: FormulaRangeRefNode,
  context: FormulaPositionContext,
  anchor: FormulaRangeAnchor,
): FormulaRangeRectangle | FormulaErrorValue {
  const rowBounds = { from: context.dataFromIndex, to: context.dataToIndex };
  const columnBounds = { from: 1, to: context.columnCount };
  const rowFrom = resolveRangeAxisIndex(range.rowFrom, anchor.rowIndex, rowBounds, 'row');
  if (isFormulaErrorValue(rowFrom)) {
    return rowFrom;
  }
  const rowTo = resolveRangeAxisIndex(range.rowTo, anchor.rowIndex, rowBounds, 'row');
  if (isFormulaErrorValue(rowTo)) {
    return rowTo;
  }
  const columnFrom = resolveRangeAxisIndex(
    range.columnFrom,
    anchor.columnIndex,
    columnBounds,
    'column',
  );
  if (isFormulaErrorValue(columnFrom)) {
    return columnFrom;
  }
  const columnTo = resolveRangeAxisIndex(
    range.columnTo,
    anchor.columnIndex,
    columnBounds,
    'column',
  );
  if (isFormulaErrorValue(columnTo)) {
    return columnTo;
  }
  // Clamp the row span to the data band: pinned rows are addressable but never
  // aggregated, so a pinned summary row can hold `SUM(E1:E8)` without covering
  // itself however the body is sorted, filtered or paginated.
  return {
    fromColumn: Math.max(Math.min(columnFrom, columnTo), 1),
    toColumn: Math.min(Math.max(columnFrom, columnTo), context.columnCount),
    fromIndex: Math.max(Math.min(rowFrom, rowTo), context.dataFromIndex),
    toIndex: Math.min(Math.max(rowFrom, rowTo), context.dataToIndex),
  };
}

/**
 * Resolves static dependencies into concrete cell keys and column records
 * against a position-context snapshot. Stable cell refs (`ROW(id)` +
 * `COLUMN(field)`) bind without consulting positions — a stable ref to a row
 * that is currently filtered out still binds (its existence is checked at
 * evaluation time). Only positional selectors and range windows need the
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

  const anchor = getFormulaRangeAnchor(ownerCell, context);
  for (const range of dependencies.ranges) {
    const rectangle = resolveFormulaRangeRectangle(range, context, anchor);
    if (isFormulaErrorValue(rectangle)) {
      bound.errors.push(rectangle);
      continue;
    }
    if (rectangle.fromIndex > rectangle.toIndex) {
      // The window clipped away entirely — an empty range has no precedents.
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
