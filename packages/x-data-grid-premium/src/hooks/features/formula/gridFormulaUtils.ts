import type { RefObject } from '@mui/x-internals/types';
import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid-pro';
import { isGroupingColumn } from '@mui/x-data-grid-pro/internals';
import {
  FORMULA_BUILT_IN_FUNCTIONS,
  createFormulaFunctionRegistry,
  createFormulaParser,
} from './engine';
import type { FormulaCellRef, FormulaScalar } from './engine';
import type {
  GridComputedColumnsRuntimeCache,
  GridFormulaFormattedReads,
  GridFormulaFunctionDefinition,
  GridFormulaInternalCache,
} from './gridFormulaInterfaces';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';

/**
 * The built-in formula functions.
 * The `formulaFunctions` prop has replacement semantics: spread this object to extend it.
 */
export const GRID_FORMULA_FUNCTIONS: Record<string, GridFormulaFunctionDefinition> =
  Object.fromEntries(FORMULA_BUILT_IN_FUNCTIONS.map((definition) => [definition.name, definition]));

const EMPTY_FORMULA_FUNCTIONS: Record<string, GridFormulaFunctionDefinition> = {};

/**
 * Resolves the `formulaFunctions` prop default. The default lives here — not in
 * `useDataGridPremiumProps` — so the grid does not bundle the built-in function
 * set (and, through it, the engine) when the formula feature is not injected.
 * Stable identities: the return value is compared by identity against the
 * registry source cache.
 */
export function getEffectiveFormulaFunctions(
  props: Pick<DataGridPremiumProcessedProps, 'formulaFunctions' | 'dataSource'>,
): Record<string, GridFormulaFunctionDefinition> {
  if (props.formulaFunctions !== undefined) {
    return props.formulaFunctions;
  }
  return props.dataSource ? EMPTY_FORMULA_FUNCTIONS : GRID_FORMULA_FUNCTIONS;
}

export function createComputedColumnsRuntimeCache(): GridComputedColumnsRuntimeCache {
  return {
    records: new Map(),
    results: new WeakMap(),
    dependencyClosure: new Map(),
    referencedFields: new Set(),
    formattedReads: new Map(),
    model: null,
    computedColDef: undefined,
    hydratedColDefs: new Map(),
    typeChangedFields: new Set(),
  };
}

export function createFormulaInternalCache(
  formulaFunctions: Record<string, GridFormulaFunctionDefinition>,
): GridFormulaInternalCache {
  return {
    parser: createFormulaParser(),
    computedColumns: createComputedColumnsRuntimeCache(),
    registry: createFormulaFunctionRegistry(Object.values(formulaFunctions)),
    registrySource: formulaFunctions,
    records: new Map(),
    dependents: new Map(),
    dependentsByRowId: new Map(),
    recordsByField: new Map(),
    positionDependentKeys: new Set(),
    cyclicKeys: new Set(),
    rangeDependentsByField: new Map(),
    positionContext: null,
    positionContextRowIds: null,
    positionContextFields: null,
    positionContextVersion: 0,
    suppressRegroupTrigger: false,
    pendingFilterItemsReset: null,
    typeChangeReset: null,
    trackedValues: new Map(),
    formattedReads: new Map(),
    lastRowIdToModelLookup: null,
    formulaFields: [],
    lastColumnsSignature: new Map(),
    lastCellEditStart: null,
    lastA1Seed: null,
    pasteOrigin: null,
    pasteStartCell: null,
    plainEditDraft: null,
    editorSession: null,
    focusSafeElements: new Set(),
    referencePick: { editables: new Set(), gesture: null, pending: null, baseline: null },
  };
}

/**
 * Returns the internal cache of the grid instance, creating it on first use.
 * The computed columns are injected while the columns state initializes and are
 * read by the initial row tree build — both run before the formula state
 * initializer, so the cache cannot wait for it.
 */
export function ensureFormulaInternalCache(
  apiRef: RefObject<GridPrivateApiPremium>,
  props: Pick<DataGridPremiumProcessedProps, 'formulaFunctions' | 'dataSource'>,
): GridFormulaInternalCache {
  let cache = apiRef.current.caches.formula;
  if (cache === undefined) {
    cache = createFormulaInternalCache(getEffectiveFormulaFunctions(props));
    apiRef.current.caches.formula = cache;
  }
  return cache;
}

export function resetFormulaEvaluationCache(cache: GridFormulaInternalCache) {
  cache.records = new Map();
  cache.dependents = new Map();
  cache.dependentsByRowId = new Map();
  cache.recordsByField = new Map();
  cache.positionDependentKeys = new Set();
  cache.cyclicKeys = new Set();
  cache.rangeDependentsByField = new Map();
  // The version counter survives: it must keep increasing across resets.
  cache.positionContext = null;
  cache.positionContextRowIds = null;
  cache.positionContextFields = null;
  cache.trackedValues = new Map();
  cache.formattedReads = new Map();
  cache.lastRowIdToModelLookup = null;
}

export function getFormulaFields(columnsLookup: Record<string, GridColDef>): string[] {
  const fields: string[] = [];
  for (const field of Object.keys(columnsLookup)) {
    if (columnsLookup[field].allowFormulas) {
      fields.push(field);
    }
  }
  return fields;
}

export function areFormulaFieldsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

/**
 * The column inputs evaluation depends on: field existence and `valueGetter`
 * identity (raw dependency reads go through it). The row grouping columns are
 * left out — every hydration rebuilds them with fresh getters that read the
 * grouped columns at call time, so their identity says nothing about the data.
 */
export function computeColumnsSignature(
  columnsLookup: Record<string, GridColDef>,
): Map<string, unknown> {
  const signature = new Map<string, unknown>();
  for (const field of Object.keys(columnsLookup)) {
    if (!isGroupingColumn(field)) {
      signature.set(field, columnsLookup[field].valueGetter);
    }
  }
  return signature;
}

export function areColumnsSignaturesEqual(
  a: Map<string, unknown>,
  b: Map<string, unknown>,
): boolean {
  if (a.size !== b.size) {
    return false;
  }
  for (const [field, valueGetter] of a) {
    if (!b.has(field) || b.get(field) !== valueGetter) {
      return false;
    }
  }
  return true;
}

/**
 * Whether a columns signature change touches the inputs of the computed columns:
 * a referenced field appearing or disappearing (`#REF!` ⇄ value) or getting a
 * new `valueGetter` (its read path), or a computed column's own getter changing
 * with its formula. An unrelated column with an inline getter does not.
 * @param {Map<string, unknown>} next The current columns signature.
 * @param {Map<string, unknown>} previous The signature the results were memoized with.
 * @param {GridComputedColumnsRuntimeCache} runtime The computed columns runtime cache.
 * @returns {boolean} `true` when the memoized computed results may be stale.
 */
export function haveComputedInputsChanged(
  next: Map<string, unknown>,
  previous: Map<string, unknown>,
  runtime: GridComputedColumnsRuntimeCache,
): boolean {
  for (const field of runtime.referencedFields) {
    if (next.has(field) !== previous.has(field) || next.get(field) !== previous.get(field)) {
      return true;
    }
  }
  for (const field of runtime.records.keys()) {
    if (next.get(field) !== previous.get(field)) {
      return true;
    }
  }
  return false;
}

export function areFormulaFunctionRecordsEqual(
  a: Record<string, GridFormulaFunctionDefinition>,
  b: Record<string, GridFormulaFunctionDefinition>,
): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  for (const key of aKeys) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
}

/**
 * The value `FORMATTED(...)` reads: the `valueFormatter` output, as `getRowFormattedValue` does
 * for a resolved value. An option object reads as its label, like in the Excel export.
 */
export function formatFormulaCellValue(
  apiRef: RefObject<GridPrivateApiPremium>,
  row: GridValidRowModel | undefined,
  colDef: GridColDef | undefined,
  value: FormulaScalar,
): FormulaScalar {
  if (row === undefined || colDef?.valueFormatter === undefined) {
    return value;
  }
  let formatted: unknown = colDef.valueFormatter(value as never, row, colDef, apiRef);
  if (typeof formatted === 'object' && formatted !== null && 'label' in formatted) {
    formatted = formatted.label;
  }
  if (formatted === undefined || formatted === null) {
    return null;
  }
  if (typeof formatted === 'object' && !(formatted instanceof Date)) {
    return String(formatted);
  }
  return formatted as FormulaScalar;
}

/**
 * `formatFormulaCellValue`, recording the read so that `isFormattedReadStale` can re-check it.
 */
export function readFormattedCellValue(
  apiRef: RefObject<GridPrivateApiPremium>,
  reads: GridFormulaFormattedReads,
  ref: FormulaCellRef,
  row: GridValidRowModel | undefined,
  colDef: GridColDef | undefined,
  value: FormulaScalar,
): FormulaScalar {
  const rowKey = String(ref.id);
  let rowReads = reads.get(rowKey);
  if (rowReads === undefined) {
    rowReads = new Map();
    reads.set(rowKey, rowReads);
  }
  const read = { value, formatted: undefined as unknown };
  rowReads.set(ref.field, read);
  read.formatted = formatFormulaCellValue(apiRef, row, colDef, value);
  return read.formatted as FormulaScalar;
}

/**
 * Tells whether formatting the recorded value again gives another output.
 */
export function isFormattedReadStale(
  apiRef: RefObject<GridPrivateApiPremium>,
  row: GridValidRowModel | undefined,
  colDef: GridColDef | undefined,
  read: { value: unknown; formatted: unknown },
): boolean {
  let formatted: unknown;
  try {
    formatted = formatFormulaCellValue(apiRef, row, colDef, read.value as FormulaScalar);
  } catch {
    formatted = undefined;
  }
  return !Object.is(formatted, read.formatted);
}
