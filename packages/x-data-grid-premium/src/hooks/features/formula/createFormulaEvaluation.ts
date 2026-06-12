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
  FormulaBoundDependencies,
  FormulaCellRef,
  FormulaErrorValue,
  FormulaPositionContext,
  FormulaScalar,
} from './engine';
import type {
  GridFormulaCellKey,
  GridFormulaCellRecord,
  GridFormulaInternalCache,
  GridFormulaLookup,
  GridFormulaResult,
} from './gridFormulaInterfaces';
import { areFormulaFieldsEqual, resetFormulaEvaluationCache } from './gridFormulaUtils';

/**
 * Position-dependent syntax (positional selectors, `RANGE`, `COLUMN_VALUES`)
 * parses but resolves to `#REF!` until the position-context machinery lands.
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

function attachRecordEdges(
  cache: GridFormulaInternalCache,
  key: GridFormulaCellKey,
  record: GridFormulaCellRecord,
) {
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
}

function detachRecordEdges(
  cache: GridFormulaInternalCache,
  key: GridFormulaCellKey,
  record: GridFormulaCellRecord,
) {
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
        // No formula reads this cell anymore — stop tracking its raw value.
        const tracked = cache.trackedValues.get(rowKey);
        if (tracked !== undefined) {
          tracked.delete(field);
          if (tracked.size === 0) {
            cache.trackedValues.delete(rowKey);
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
      result: { type: 'value', value: unescapeLiteralSource(source) },
    };
  }
  const parse = ctx.cache.parser.parse(getFormulaExpression(source));
  let dependencies: FormulaBoundDependencies | null = null;
  if (parse.ast !== null) {
    dependencies = bindFormulaDependencies(
      { id, field },
      extractFormulaDependencies(parse.ast),
      EMPTY_POSITION_CONTEXT,
    );
  }
  return { id, field, source, parse, dependencies, result: PENDING_RESULT };
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
  // Binding errors are not short-circuited: against the empty position context
  // they only flag positional/range syntax, and the evaluator produces the
  // clearer "not supported yet" messages for those nodes.
  return evaluateFormula(record.parse.ast, {
    currentCell: { id: record.id, field: record.field },
    getCellValue: resolver.getCellValue,
    hasRow: resolver.hasRow,
    hasField: resolver.hasField,
    position: EMPTY_POSITION_CONTEXT,
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
  const affected = collectAffectedCells(dirty, (key) => cache.dependents.get(key));
  const { order, cyclic } = orderForRecompute(
    affected,
    (key) => cache.records.get(key)?.dependencies?.cells,
  );
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

  const lookup: GridFormulaLookup = { ...ctx.previousLookup };
  const touchedRows = new Set<string>();
  const ensureRowEntry = (rowKey: string) => {
    if (!touchedRows.has(rowKey)) {
      lookup[rowKey] = { ...lookup[rowKey] };
      touchedRows.add(rowKey);
    }
    return lookup[rowKey];
  };

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
  for (const key of changedKeys) {
    const record = cache.records.get(key);
    if (record === undefined) {
      continue;
    }
    ensureRowEntry(String(record.id))[record.field] = record.result;
    changedCells.push({ id: record.id, field: record.field });
  }

  cache.lastRowIdToModelLookup = rowsLookup;
  if (changedCells.length === 0) {
    return null;
  }
  return { lookup, changedCells };
}
