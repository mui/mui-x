import type { GridColDef } from '@mui/x-data-grid-pro';
import {
  FORMULA_BUILT_IN_FUNCTIONS,
  createFormulaFunctionRegistry,
  createFormulaParser,
} from './engine';
import type {
  GridFormulaFunctionDefinition,
  GridFormulaInternalCache,
} from './gridFormulaInterfaces';

/**
 * The built-in formula functions.
 * The `formulaFunctions` prop has replacement semantics: spread this object to extend it.
 */
export const GRID_FORMULA_FUNCTIONS: Record<string, GridFormulaFunctionDefinition> =
  Object.fromEntries(FORMULA_BUILT_IN_FUNCTIONS.map((definition) => [definition.name, definition]));

export function createFormulaInternalCache(
  formulaFunctions: Record<string, GridFormulaFunctionDefinition>,
): GridFormulaInternalCache {
  return {
    parser: createFormulaParser(),
    registry: createFormulaFunctionRegistry(Object.values(formulaFunctions)),
    registrySource: formulaFunctions,
    records: new Map(),
    dependents: new Map(),
    dependentsByRowId: new Map(),
    trackedValues: new Map(),
    lastRowIdToModelLookup: null,
    formulaFields: [],
    lastColumnsSignature: new Map(),
    lastCellEditStart: null,
  };
}

export function resetFormulaEvaluationCache(cache: GridFormulaInternalCache) {
  cache.records = new Map();
  cache.dependents = new Map();
  cache.dependentsByRowId = new Map();
  cache.trackedValues = new Map();
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
 * identity (raw dependency reads go through it).
 */
export function computeColumnsSignature(
  columnsLookup: Record<string, GridColDef>,
): Map<string, unknown> {
  const signature = new Map<string, unknown>();
  for (const field of Object.keys(columnsLookup)) {
    signature.set(field, columnsLookup[field].valueGetter);
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
