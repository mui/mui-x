import type { RefObject } from '@mui/x-internals/types';
import { warnOnce } from '@mui/x-internals/warning';
import { gridRowIdSelector } from '@mui/x-data-grid-pro';
import type {
  GridCellCoordinates,
  GridColDef,
  GridRowId,
  GridValidRowModel,
} from '@mui/x-data-grid-pro';
import { getRowValue as getRowValueUtil } from '@mui/x-data-grid-pro/internals';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  bindFormulaDependencies,
  collectAffectedCells,
  createFormulaCellKey,
  createFormulaError,
  evaluateFormula,
  extractFormulaDependencies,
  getFormulaExpression,
  isEscapedFormulaSource,
  isFormulaSource,
  orderForRecompute,
  parseFormulaCellKey,
  unescapeLiteralSource,
} from './engine';
import type {
  FormulaAstNode,
  FormulaBoundDependencies,
  FormulaCellRef,
  FormulaErrorValue,
  FormulaPositionContext,
  FormulaScalar,
  FormulaStaticDependencies,
} from './engine';
import type {
  GridFormulaCellKey,
  GridFormulaCellRecord,
  GridFormulaInternalCache,
  GridFormulaLookup,
  GridFormulaRangeDependency,
  GridFormulaResult,
} from './gridFormulaInterfaces';
import { areFormulaFieldsEqual, resetFormulaEvaluationCache } from './gridFormulaUtils';
import { arePositionArraysEqual, createFormulaPositionContext } from './gridFormulaPositionContext';
import type { GridFormulaPositionSnapshot } from './gridFormulaPositionContext';

/**
 * Context for formulas without position-dependent syntax — their binding and
 * evaluation never consult positions, so building a real snapshot for them
 * would be wasted work.
 */
const EMPTY_POSITION_CONTEXT: FormulaPositionContext = {
  version: 0,
  rowCount: 0,
  columnCount: 0,
  getRowIdAtPosition: () => undefined,
  getPositionOfRowId: () => undefined,
  getFieldAtPosition: () => undefined,
  getPositionOfField: () => undefined,
};

/**
 * Above this many materialized range cells per formula, a dev-mode warning
 * suggests restructuring (D6).
 */
const RANGE_CELLS_WARNING_THRESHOLD = 100_000;

/**
 * Placeholder until the pass evaluates the record — topological order
 * guarantees no dependent reads it.
 */
const PENDING_RESULT: GridFormulaResult = { type: 'value', value: null };

export interface FormulaPassContext {
  apiRef: RefObject<GridPrivateApiPremium>;
  cache: GridFormulaInternalCache;
  rowsLookup: Record<GridRowId, GridValidRowModel>;
  columnsLookup: Record<string, GridColDef>;
  formulaFields: string[];
  previousLookup: GridFormulaLookup;
  /**
   * Produces the current position-context inputs. Called lazily — only when
   * a position-dependent formula needs binding or evaluation.
   * @returns {GridFormulaPositionSnapshot} The current position inputs.
   */
  getPositionSnapshot: () => GridFormulaPositionSnapshot;
}

/**
 * Returns the position context records are bound against, building it from
 * the snapshot on first need. Rebind passes are the only place the cached
 * context is replaced — within a pass every consumer sees one snapshot.
 */
function getPassPositionContext(ctx: FormulaPassContext): FormulaPositionContext {
  const { cache } = ctx;
  if (cache.positionContext === null) {
    const snapshot = ctx.getPositionSnapshot();
    cache.positionContextVersion += 1;
    cache.positionContext = createFormulaPositionContext(snapshot, cache.positionContextVersion);
    cache.positionContextRowIds = snapshot.rowIds;
    cache.positionContextFields = snapshot.fields;
  }
  return cache.positionContext;
}

export interface FormulaPassResult {
  lookup: GridFormulaLookup;
  changedCells: GridCellCoordinates[];
}

function readRawCellValue(
  apiRef: RefObject<GridPrivateApiPremium>,
  row: GridValidRowModel,
  colDef: GridColDef | undefined,
) {
  if (colDef === undefined) {
    return undefined;
  }
  return getRowValueUtil(row, colDef, apiRef);
}

function areResultsEqual(a: GridFormulaResult, b: GridFormulaResult): boolean {
  if (a.type === 'error' || b.type === 'error') {
    return a.type === 'error' && b.type === 'error' && a.code === b.code && a.message === b.message;
  }
  if (Object.is(a.value, b.value)) {
    return true;
  }
  return (
    a.value instanceof Date && b.value instanceof Date && a.value.getTime() === b.value.getTime()
  );
}

/**
 * Groups a record's interval and whole-column dependencies by field, in the
 * shape `rangeDependentsByField` stores per dependent.
 */
function collectRangeDependenciesByField(
  record: GridFormulaCellRecord,
): Map<string, GridFormulaRangeDependency> | null {
  const dependencies = record.dependencies;
  if (
    dependencies === null ||
    (dependencies.columnIntervals.length === 0 && dependencies.wholeColumns.length === 0)
  ) {
    return null;
  }
  const byField = new Map<string, GridFormulaRangeDependency>();
  const ensureEntry = (field: string) => {
    let entry = byField.get(field);
    if (entry === undefined) {
      entry = { intervals: [], wholeColumn: false };
      byField.set(field, entry);
    }
    return entry;
  };
  for (const interval of dependencies.columnIntervals) {
    ensureEntry(interval.field).intervals.push({
      fromIndex: interval.fromIndex,
      toIndex: interval.toIndex,
    });
  }
  for (const wholeColumn of dependencies.wholeColumns) {
    ensureEntry(wholeColumn.field).wholeColumn = true;
  }
  return byField;
}

function attachRecordEdges(
  cache: GridFormulaInternalCache,
  key: GridFormulaCellKey,
  record: GridFormulaCellRecord,
) {
  let fieldRecords = cache.recordsByField.get(record.field);
  if (fieldRecords === undefined) {
    fieldRecords = new Set();
    cache.recordsByField.set(record.field, fieldRecords);
  }
  fieldRecords.add(key);
  if (record.usesPositionContext) {
    cache.positionDependentKeys.add(key);
  }
  if (record.dependencies === null) {
    return;
  }
  for (const dependency of record.dependencies.cells) {
    let dependents = cache.dependents.get(dependency);
    if (dependents === undefined) {
      dependents = new Set();
      cache.dependents.set(dependency, dependents);
    }
    dependents.add(key);

    const rowKey = parseFormulaCellKey(dependency).id;
    let rowDependents = cache.dependentsByRowId.get(rowKey);
    if (rowDependents === undefined) {
      rowDependents = new Set();
      cache.dependentsByRowId.set(rowKey, rowDependents);
    }
    rowDependents.add(key);
  }
  const rangeDependencies = collectRangeDependenciesByField(record);
  if (rangeDependencies !== null) {
    for (const [field, dependency] of rangeDependencies) {
      let fieldDependents = cache.rangeDependentsByField.get(field);
      if (fieldDependents === undefined) {
        fieldDependents = new Map();
        cache.rangeDependentsByField.set(field, fieldDependents);
      }
      fieldDependents.set(key, dependency);
    }
  }
}

/**
 * Drops every tracked raw value of `field` that no longer has any reader.
 * Range reads have no per-cell edges, so when the last range dependent of a
 * field detaches, its tracked values must be swept explicitly — entries that
 * still serve a cell-edge dependent stay.
 */
function sweepTrackedValuesForField(cache: GridFormulaInternalCache, field: string) {
  for (const [rowKey, tracked] of cache.trackedValues) {
    if (tracked.has(field) && !cache.dependents.has(createFormulaCellKey(rowKey, field))) {
      tracked.delete(field);
      if (tracked.size === 0) {
        cache.trackedValues.delete(rowKey);
      }
    }
  }
}

function detachRecordEdges(
  cache: GridFormulaInternalCache,
  key: GridFormulaCellKey,
  record: GridFormulaCellRecord,
) {
  const fieldRecords = cache.recordsByField.get(record.field);
  if (fieldRecords !== undefined) {
    fieldRecords.delete(key);
    if (fieldRecords.size === 0) {
      cache.recordsByField.delete(record.field);
    }
  }
  cache.positionDependentKeys.delete(key);
  if (record.dependencies === null) {
    return;
  }
  for (const dependency of record.dependencies.cells) {
    const { id: rowKey, field } = parseFormulaCellKey(dependency);
    const dependents = cache.dependents.get(dependency);
    if (dependents !== undefined) {
      dependents.delete(key);
      if (dependents.size === 0) {
        cache.dependents.delete(dependency);
        // No formula reads this cell anymore — stop tracking its raw value,
        // unless a range dependent of the field still does.
        if (!cache.rangeDependentsByField.has(field)) {
          const tracked = cache.trackedValues.get(rowKey);
          if (tracked !== undefined) {
            tracked.delete(field);
            if (tracked.size === 0) {
              cache.trackedValues.delete(rowKey);
            }
          }
        }
      }
    }
    const rowDependents = cache.dependentsByRowId.get(rowKey);
    if (rowDependents !== undefined) {
      rowDependents.delete(key);
      if (rowDependents.size === 0) {
        cache.dependentsByRowId.delete(rowKey);
      }
    }
  }
  const rangeDependencies = collectRangeDependenciesByField(record);
  if (rangeDependencies !== null) {
    for (const field of rangeDependencies.keys()) {
      const fieldDependents = cache.rangeDependentsByField.get(field);
      if (fieldDependents !== undefined) {
        fieldDependents.delete(key);
        if (fieldDependents.size === 0) {
          cache.rangeDependentsByField.delete(field);
          sweepTrackedValuesForField(cache, field);
        }
      }
    }
  }
}

function setRecord(
  ctx: FormulaPassContext,
  key: GridFormulaCellKey,
  record: GridFormulaCellRecord,
) {
  const existing = ctx.cache.records.get(key);
  if (existing !== undefined) {
    detachRecordEdges(ctx.cache, key, existing);
  }
  ctx.cache.records.set(key, record);
  attachRecordEdges(ctx.cache, key, record);
}

function deleteRecord(ctx: FormulaPassContext, key: GridFormulaCellKey) {
  const existing = ctx.cache.records.get(key);
  if (existing === undefined) {
    return;
  }
  detachRecordEdges(ctx.cache, key, existing);
  ctx.cache.records.delete(key);
}

function addDependentsToDirty(
  cache: GridFormulaInternalCache,
  key: GridFormulaCellKey,
  dirty: Set<GridFormulaCellKey>,
) {
  const dependents = cache.dependents.get(key);
  if (dependents === undefined) {
    return;
  }
  for (const dependent of dependents) {
    if (cache.records.has(dependent)) {
      dirty.add(dependent);
    }
  }
}

function addRowDependentsToDirty(
  cache: GridFormulaInternalCache,
  rowKey: string,
  dirty: Set<GridFormulaCellKey>,
) {
  const rowDependents = cache.dependentsByRowId.get(rowKey);
  if (rowDependents === undefined) {
    return;
  }
  for (const dependent of rowDependents) {
    if (cache.records.has(dependent)) {
      dirty.add(dependent);
    }
  }
}

/**
 * Dirties the range dependents whose interval contains the changed cell.
 * A cell without a position cannot be inside any materialized range — and
 * when its membership changes (row added/removed, filter change), the
 * rebind pass dirties every position-dependent formula anyway.
 */
function addRangeDependentsToDirty(
  ctx: FormulaPassContext,
  field: string,
  id: GridRowId,
  dirty: Set<GridFormulaCellKey>,
) {
  const { cache } = ctx;
  const fieldDependents = cache.rangeDependentsByField.get(field);
  if (fieldDependents === undefined || fieldDependents.size === 0) {
    return;
  }
  const position = getPassPositionContext(ctx).getPositionOfRowId(id);
  if (position === undefined) {
    return;
  }
  for (const [dependent, dependency] of fieldDependents) {
    if (!cache.records.has(dependent)) {
      continue;
    }
    if (
      dependency.wholeColumn ||
      dependency.intervals.some(
        (interval) => position >= interval.fromIndex && position <= interval.toIndex,
      )
    ) {
      dirty.add(dependent);
    }
  }
}

function warnOnLargeRangeDependencies(
  dependencies: FormulaBoundDependencies,
  context: FormulaPositionContext,
) {
  let materializedCells = 0;
  for (const interval of dependencies.columnIntervals) {
    materializedCells += interval.toIndex - interval.fromIndex + 1;
  }
  materializedCells += dependencies.wholeColumns.length * context.rowCount;
  if (materializedCells > RANGE_CELLS_WARNING_THRESHOLD) {
    warnOnce([
      `MUI X Data Grid: A formula materializes over ${RANGE_CELLS_WARNING_THRESHOLD.toLocaleString('en-US')} range cells per evaluation.`,
      'Formulas of this size can make editing and scrolling noticeably slow.',
      'Consider aggregating over fewer rows or using the aggregation feature instead.',
    ]);
  }
}

/**
 * Static dependencies per AST. The parser interns ASTs by source string, so
 * one extraction serves every cell sharing a formula and every rebind.
 */
const staticDependenciesCache = new WeakMap<FormulaAstNode, FormulaStaticDependencies>();

function getStaticDependencies(ast: FormulaAstNode): FormulaStaticDependencies {
  let dependencies = staticDependenciesCache.get(ast);
  if (dependencies === undefined) {
    dependencies = extractFormulaDependencies(ast);
    staticDependenciesCache.set(ast, dependencies);
  }
  return dependencies;
}

/**
 * Re-resolves a record's dependencies. Stable refs bind context-free;
 * positional selectors, `RANGE` and `COLUMN_VALUES` resolve against the
 * pass's position context.
 */
function bindRecordDependencies(
  ctx: FormulaPassContext,
  record: Pick<GridFormulaCellRecord, 'id' | 'field' | 'parse' | 'usesPositionContext'>,
): FormulaBoundDependencies | null {
  if (record.parse === null || record.parse.ast === null) {
    return null;
  }
  const dependencies = bindFormulaDependencies(
    { id: record.id, field: record.field },
    getStaticDependencies(record.parse.ast),
    record.usesPositionContext ? getPassPositionContext(ctx) : EMPTY_POSITION_CONTEXT,
  );
  if (process.env.NODE_ENV !== 'production' && record.usesPositionContext) {
    warnOnLargeRangeDependencies(dependencies, getPassPositionContext(ctx));
  }
  return dependencies;
}

function buildRecord(
  ctx: FormulaPassContext,
  id: GridRowId,
  field: string,
  source: string,
): GridFormulaCellRecord {
  if (isEscapedFormulaSource(source)) {
    return {
      id,
      field,
      source,
      parse: null,
      dependencies: null,
      usesPositionContext: false,
      result: { type: 'value', value: unescapeLiteralSource(source) },
    };
  }
  const parse = ctx.cache.parser.parse(getFormulaExpression(source));
  const record: GridFormulaCellRecord = {
    id,
    field,
    source,
    parse,
    dependencies: null,
    usesPositionContext: parse.ast !== null && getStaticDependencies(parse.ast).usesPositionContext,
    result: PENDING_RESULT,
  };
  record.dependencies = bindRecordDependencies(ctx, record);
  return record;
}

function scanRow(
  ctx: FormulaPassContext,
  id: GridRowId,
  row: GridValidRowModel,
  dirty: Set<GridFormulaCellKey>,
  removedCells: GridCellCoordinates[] | null,
) {
  const { cache, formulaFields, columnsLookup } = ctx;
  for (const field of formulaFields) {
    const raw = row[field];
    const key = createFormulaCellKey(id, field);
    const existing = cache.records.get(key);
    if (isFormulaSource(raw) || isEscapedFormulaSource(raw)) {
      if (existing !== undefined && existing.source === raw) {
        continue;
      }
      if (process.env.NODE_ENV !== 'production' && columnsLookup[field]?.valueGetter) {
        warnOnce([
          `MUI X Data Grid: The column "${field}" defines both \`allowFormulas\` and \`valueGetter\`.`,
          'The `valueGetter` is ignored for cells holding a formula and only applies to plain cells.',
        ]);
      }
      setRecord(ctx, key, buildRecord(ctx, id, field, raw));
      dirty.add(key);
    } else if (existing !== undefined) {
      deleteRecord(ctx, key);
      removedCells?.push({ id, field });
      addDependentsToDirty(cache, key, dirty);
      // The cell holds a raw value now — ranges over the field see the change.
      addRangeDependentsToDirty(ctx, field, id, dirty);
    }
  }
}

interface FormulaPassResolver {
  getCellValue: (ref: FormulaCellRef) => FormulaScalar | FormulaErrorValue | undefined;
  hasRow: (id: GridRowId) => boolean;
  hasField: (field: string) => boolean;
}

function createPassResolver(ctx: FormulaPassContext): FormulaPassResolver {
  const { cache, rowsLookup, columnsLookup, apiRef } = ctx;
  return {
    getCellValue: (ref) => {
      const key = createFormulaCellKey(ref.id, ref.field);
      const record = cache.records.get(key);
      if (record !== undefined) {
        const { result } = record;
        return result.type === 'error'
          ? createFormulaError(result.code, result.message)
          : result.value;
      }
      const row = rowsLookup[ref.id];
      if (row === undefined) {
        return null;
      }
      const value = readRawCellValue(apiRef, row, columnsLookup[ref.field]);
      const rowKey = String(ref.id);
      let tracked = cache.trackedValues.get(rowKey);
      if (tracked === undefined) {
        tracked = new Map();
        cache.trackedValues.set(rowKey, tracked);
      }
      tracked.set(ref.field, value);
      return value as FormulaScalar;
    },
    hasRow: (id) => rowsLookup[id] !== undefined,
    hasField: (field) => columnsLookup[field] !== undefined,
  };
}

function evaluateRecordResult(
  ctx: FormulaPassContext,
  record: GridFormulaCellRecord,
  resolver: FormulaPassResolver,
): GridFormulaResult {
  if (record.parse === null) {
    // Escaped literal — the result was final at build time.
    return record.result;
  }
  if (record.parse.ast === null) {
    return {
      type: 'error',
      code: '#ERROR!',
      message: record.parse.error?.message ?? 'The formula could not be parsed.',
    };
  }
  // Binding errors are not short-circuited: the evaluator re-resolves
  // positions against the same context snapshot, so it reaches the same
  // errors itself, with strict left-to-right propagation order.
  return evaluateFormula(record.parse.ast, {
    currentCell: { id: record.id, field: record.field },
    getCellValue: resolver.getCellValue,
    hasRow: resolver.hasRow,
    hasField: resolver.hasField,
    position: record.usesPositionContext ? getPassPositionContext(ctx) : EMPTY_POSITION_CONTEXT,
    functions: ctx.cache.registry,
  });
}

function finalizeRecordResult(
  ctx: FormulaPassContext,
  key: GridFormulaCellKey,
  record: GridFormulaCellRecord,
  next: GridFormulaResult,
  changedKeys: Set<GridFormulaCellKey>,
) {
  const previous = ctx.previousLookup[String(record.id)]?.[record.field];
  if (previous !== undefined && areResultsEqual(previous, next)) {
    // Reuse the previous result object so unchanged cells keep their
    // reference and never re-render.
    record.result = previous;
    return;
  }
  record.result = next;
  changedKeys.add(key);
}

/**
 * Resolves the graph edges of `key` in the dependents direction, expanding
 * the interval tier: a formula cell is read by a range dependent when its
 * row position falls inside the dependent's interval (or the dependent reads
 * the whole column). Raw cells never appear here — they cannot be `key`.
 */
function getGraphDependents(
  ctx: FormulaPassContext,
  key: GridFormulaCellKey,
): Iterable<GridFormulaCellKey> | undefined {
  const { cache } = ctx;
  const direct = cache.dependents.get(key);
  const { id, field } = parseFormulaCellKey(key);
  const fieldDependents = cache.rangeDependentsByField.get(field);
  if (fieldDependents === undefined || fieldDependents.size === 0) {
    return direct;
  }
  const position = getPassPositionContext(ctx).getPositionOfRowId(id);
  if (position === undefined) {
    return direct;
  }
  let expanded: Set<GridFormulaCellKey> | null = null;
  for (const [dependent, dependency] of fieldDependents) {
    if (
      dependency.wholeColumn ||
      dependency.intervals.some(
        (interval) => position >= interval.fromIndex && position <= interval.toIndex,
      )
    ) {
      if (expanded === null) {
        expanded = direct === undefined ? new Set() : new Set(direct);
      }
      expanded.add(dependent);
    }
  }
  return expanded ?? direct;
}

/**
 * Resolves the graph edges of `key` in the dependencies direction, expanding
 * interval and whole-column dependencies into the formula cells they cover.
 * This is what makes a range read order correctly against — and cycle with —
 * the formula cells inside its bounds (a `SUM(COLUMN_VALUES("total"))`
 * placed in column `total` is a self-edge, hence `#CYCLE!`).
 */
function getGraphDependencies(
  ctx: FormulaPassContext,
  key: GridFormulaCellKey,
): Iterable<GridFormulaCellKey> | undefined {
  const { cache } = ctx;
  const dependencies = cache.records.get(key)?.dependencies;
  if (dependencies === undefined || dependencies === null) {
    return undefined;
  }
  if (dependencies.columnIntervals.length === 0 && dependencies.wholeColumns.length === 0) {
    return dependencies.cells;
  }
  const positionContext = getPassPositionContext(ctx);
  const expanded = new Set(dependencies.cells);
  for (const wholeColumn of dependencies.wholeColumns) {
    const fieldRecords = cache.recordsByField.get(wholeColumn.field);
    if (fieldRecords === undefined) {
      continue;
    }
    for (const dependency of fieldRecords) {
      if (positionContext.getPositionOfRowId(parseFormulaCellKey(dependency).id) !== undefined) {
        expanded.add(dependency);
      }
    }
  }
  for (const interval of dependencies.columnIntervals) {
    const fieldRecords = cache.recordsByField.get(interval.field);
    if (fieldRecords === undefined) {
      continue;
    }
    for (const dependency of fieldRecords) {
      const position = positionContext.getPositionOfRowId(parseFormulaCellKey(dependency).id);
      if (
        position !== undefined &&
        position >= interval.fromIndex &&
        position <= interval.toIndex
      ) {
        expanded.add(dependency);
      }
    }
  }
  return expanded;
}

/**
 * Recomputes the transitive closure of `dirty` in topological order.
 * Cells locked on a cycle become `#CYCLE!`. Returns the keys whose result
 * object changed.
 */
function runEvaluation(
  ctx: FormulaPassContext,
  dirty: Set<GridFormulaCellKey>,
): Set<GridFormulaCellKey> {
  const { cache } = ctx;
  const changedKeys = new Set<GridFormulaCellKey>();
  if (dirty.size === 0) {
    return changedKeys;
  }
  const affected = collectAffectedCells(dirty, (key) => getGraphDependents(ctx, key));
  const { order, cyclic } = orderForRecompute(affected, (key) => getGraphDependencies(ctx, key));
  const resolver = createPassResolver(ctx);
  for (const key of order) {
    const record = cache.records.get(key);
    if (record === undefined) {
      continue;
    }
    finalizeRecordResult(
      ctx,
      key,
      record,
      evaluateRecordResult(ctx, record, resolver),
      changedKeys,
    );
  }
  for (const key of cyclic) {
    const record = cache.records.get(key);
    if (record === undefined) {
      continue;
    }
    finalizeRecordResult(
      ctx,
      key,
      record,
      {
        type: 'error',
        code: '#CYCLE!',
        message: 'The formula is part of a circular reference.',
      },
      changedKeys,
    );
  }
  return changedKeys;
}

/**
 * Rescans every row and recomputes every formula from scratch.
 * Used for the initial evaluation, `reevaluateFormulas()`, column-set changes
 * and function-registry changes.
 */
export function computeFullFormulaPass(ctx: FormulaPassContext): FormulaPassResult {
  const { cache, rowsLookup, formulaFields, apiRef } = ctx;
  resetFormulaEvaluationCache(cache);

  const dirty = new Set<GridFormulaCellKey>();
  if (formulaFields.length > 0) {
    for (const rowKey of Object.keys(rowsLookup)) {
      const row = rowsLookup[rowKey];
      scanRow(ctx, gridRowIdSelector(apiRef, row), row, dirty, null);
    }
  }
  runEvaluation(ctx, dirty);

  const lookup: GridFormulaLookup = {};
  const changedCells: GridCellCoordinates[] = [];
  for (const record of cache.records.values()) {
    const rowKey = String(record.id);
    let rowEntry = lookup[rowKey];
    if (rowEntry === undefined) {
      rowEntry = {};
      lookup[rowKey] = rowEntry;
    }
    rowEntry[record.field] = record.result;
    if (ctx.previousLookup[rowKey]?.[record.field] !== record.result) {
      changedCells.push({ id: record.id, field: record.field });
    }
  }
  for (const rowKey of Object.keys(ctx.previousLookup)) {
    const row = rowsLookup[rowKey];
    // The stringified key is the best available id once the row is gone.
    const id = row === undefined ? rowKey : gridRowIdSelector(apiRef, row);
    for (const field of Object.keys(ctx.previousLookup[rowKey])) {
      if (lookup[rowKey]?.[field] === undefined) {
        changedCells.push({ id, field });
      }
    }
  }

  cache.lastRowIdToModelLookup = rowsLookup;
  cache.formulaFields = formulaFields;
  return { lookup, changedCells };
}

/**
 * Reference-diffs the rows lookup against the snapshot from the last pass and
 * recomputes only the dirty subgraph. Falls back to a full pass when there is
 * no snapshot or the formula column set changed. Returns `null` when nothing
 * needs to change.
 */
export function computeRowsDiffFormulaPass(ctx: FormulaPassContext): FormulaPassResult | null {
  const { cache, rowsLookup, formulaFields, apiRef } = ctx;
  const previousRows = cache.lastRowIdToModelLookup;
  if (previousRows === null || !areFormulaFieldsEqual(cache.formulaFields, formulaFields)) {
    return computeFullFormulaPass(ctx);
  }
  if (previousRows === rowsLookup) {
    return null;
  }

  const dirty = new Set<GridFormulaCellKey>();
  const removedCells: GridCellCoordinates[] = [];
  const removedRowKeys: string[] = [];

  for (const rowKey of Object.keys(rowsLookup)) {
    const row = rowsLookup[rowKey];
    const previousRow = previousRows[rowKey];
    if (previousRow === row) {
      continue;
    }
    const id = gridRowIdSelector(apiRef, row);
    if (previousRow === undefined) {
      // Added row: formulas referencing it (currently `#REF!`) must recompute.
      addRowDependentsToDirty(cache, rowKey, dirty);
      scanRow(ctx, id, row, dirty, removedCells);
      continue;
    }
    scanRow(ctx, id, row, dirty, removedCells);
    const tracked = cache.trackedValues.get(rowKey);
    if (tracked !== undefined) {
      for (const [field, lastValue] of tracked) {
        const current = readRawCellValue(apiRef, row, ctx.columnsLookup[field]);
        if (!Object.is(current, lastValue)) {
          tracked.set(field, current);
          addDependentsToDirty(cache, createFormulaCellKey(id, field), dirty);
          addRangeDependentsToDirty(ctx, field, id, dirty);
        }
      }
    }
  }

  const removedRowCells: GridCellCoordinates[] = [];
  for (const rowKey of Object.keys(previousRows)) {
    if (rowsLookup[rowKey] !== undefined) {
      continue;
    }
    removedRowKeys.push(rowKey);
    addRowDependentsToDirty(cache, rowKey, dirty);
    for (const field of formulaFields) {
      const key = createFormulaCellKey(rowKey, field);
      const record = cache.records.get(key);
      if (record !== undefined) {
        // Removed lookup entries count as changes — otherwise a pass that only
        // removes a row would report nothing and the stale entry would mask
        // the values of a later row with the same id.
        removedRowCells.push({ id: record.id, field });
        deleteRecord(ctx, key);
        dirty.delete(key);
      }
    }
    cache.trackedValues.delete(rowKey);
  }

  if (dirty.size === 0 && removedCells.length === 0 && removedRowKeys.length === 0) {
    cache.lastRowIdToModelLookup = rowsLookup;
    return null;
  }

  const changedKeys = runEvaluation(ctx, dirty);

  const builder = createIncrementalLookup(ctx.previousLookup);
  const { lookup, touchedRows, ensureRowEntry } = builder;

  const changedCells: GridCellCoordinates[] = [...removedRowCells];
  for (const rowKey of removedRowKeys) {
    if (lookup[rowKey] !== undefined) {
      delete lookup[rowKey];
    }
  }
  for (const removedCell of removedCells) {
    const rowKey = String(removedCell.id);
    if (lookup[rowKey]?.[removedCell.field] !== undefined) {
      const rowEntry = ensureRowEntry(rowKey);
      delete rowEntry[removedCell.field];
      if (Object.keys(rowEntry).length === 0) {
        delete lookup[rowKey];
        touchedRows.delete(rowKey);
      }
      changedCells.push(removedCell);
    }
  }
  applyChangedRecords(ctx, changedKeys, builder, changedCells);

  cache.lastRowIdToModelLookup = rowsLookup;
  if (changedCells.length === 0) {
    return null;
  }
  return { lookup, changedCells };
}

interface IncrementalLookupBuilder {
  lookup: GridFormulaLookup;
  touchedRows: Set<string>;
  ensureRowEntry: (rowKey: string) => Record<string, GridFormulaResult>;
}

/**
 * Copy-on-write view over the previous lookup: rows are only cloned when a
 * cell of theirs changes, so unchanged rows keep their object identity and
 * their cells never re-render.
 */
function createIncrementalLookup(previousLookup: GridFormulaLookup): IncrementalLookupBuilder {
  const lookup: GridFormulaLookup = { ...previousLookup };
  const touchedRows = new Set<string>();
  const ensureRowEntry = (rowKey: string) => {
    if (!touchedRows.has(rowKey)) {
      lookup[rowKey] = { ...lookup[rowKey] };
      touchedRows.add(rowKey);
    }
    return lookup[rowKey];
  };
  return { lookup, touchedRows, ensureRowEntry };
}

function applyChangedRecords(
  ctx: FormulaPassContext,
  changedKeys: Set<GridFormulaCellKey>,
  builder: IncrementalLookupBuilder,
  changedCells: GridCellCoordinates[],
) {
  for (const key of changedKeys) {
    const record = ctx.cache.records.get(key);
    if (record === undefined) {
      continue;
    }
    builder.ensureRowEntry(String(record.id))[record.field] = record.result;
    changedCells.push({ id: record.id, field: record.field });
  }
}

/**
 * Rebinds every position-dependent formula against a fresh position-context
 * snapshot and recomputes the affected subgraph. One-shot by design (D4):
 * the pass runs once per position-changing event, and the grid never
 * re-sorts or re-filters in response to the values it produces. Returns
 * `null` when nothing is bound positionally or the view order is unchanged.
 */
export function computePositionRebindFormulaPass(
  ctx: FormulaPassContext,
): FormulaPassResult | null {
  const { cache } = ctx;
  if (cache.positionDependentKeys.size === 0) {
    // Nothing is bound positionally — invalidate the snapshot so the next
    // position-dependent formula binds against fresh positions.
    cache.positionContext = null;
    cache.positionContextRowIds = null;
    cache.positionContextFields = null;
    return null;
  }
  const snapshot = ctx.getPositionSnapshot();
  if (
    cache.positionContextRowIds !== null &&
    cache.positionContextFields !== null &&
    arePositionArraysEqual(cache.positionContextRowIds, snapshot.rowIds) &&
    arePositionArraysEqual(cache.positionContextFields, snapshot.fields)
  ) {
    return null;
  }
  cache.positionContextVersion += 1;
  cache.positionContext = createFormulaPositionContext(snapshot, cache.positionContextVersion);
  cache.positionContextRowIds = snapshot.rowIds;
  cache.positionContextFields = snapshot.fields;

  const dirty = new Set<GridFormulaCellKey>();
  // Copy before iterating: rebinding detaches and re-attaches each key, and
  // mutating a Set during iteration revisits re-added keys.
  for (const key of Array.from(cache.positionDependentKeys)) {
    const record = cache.records.get(key);
    if (record === undefined) {
      continue;
    }
    const rebound: GridFormulaCellRecord = { ...record };
    rebound.dependencies = bindRecordDependencies(ctx, rebound);
    setRecord(ctx, key, rebound);
    dirty.add(key);
  }
  const changedKeys = runEvaluation(ctx, dirty);
  if (changedKeys.size === 0) {
    return null;
  }
  const builder = createIncrementalLookup(ctx.previousLookup);
  const changedCells: GridCellCoordinates[] = [];
  applyChangedRecords(ctx, changedKeys, builder, changedCells);
  return { lookup: builder.lookup, changedCells };
}
