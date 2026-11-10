import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  bindFormulaDependencies,
  createFormulaCellKey,
  orderForRecompute,
  parseFormulaCellKey,
} from './engine';
import type { FormulaBoundDependencies, FormulaCellKey, FormulaCellRef } from './engine';
import { getStaticDependencies } from './createFormulaEvaluation';
import {
  EMPTY_POSITION_CONTEXT,
  gridFormulaA1PositionContextSelector,
} from './gridFormulaPositionContext';
import { findCyclePath } from './gridComputedColumnsValidation';
import type { GridFormulaCellRecord, GridFormulaInternalCache } from './gridFormulaInterfaces';

/**
 * A draft formula, as it would read the grid once applied.
 */
export type GridFormulaDraftOwner =
  | {
      /**
       * The computed column the draft replaces the formula of, in every row.
       */
      field: string;
      fieldRefs: ReadonlySet<string>;
    }
  | {
      /**
       * The cell the draft replaces the formula of.
       */
      cell: FormulaCellRef;
      dependencies: FormulaBoundDependencies;
    };

const RANGE_KEY_SEPARATOR = '\u0001';

/**
 * The fields read through the computed columns from `fields`, without going through `skip`.
 * Like the closure of the formula pass, it follows the columns with a static result too.
 */
function collectComputedClosure(
  cache: GridFormulaInternalCache,
  fields: Iterable<string>,
  skip: string | null,
): Set<string> {
  const closure = new Set<string>();
  const stack = Array.from(fields);
  for (let field = stack.pop(); field !== undefined; field = stack.pop()) {
    if (field !== skip && !closure.has(field)) {
      closure.add(field);
      const record = cache.computedColumns.records.get(field);
      if (record !== undefined) {
        stack.push(...record.dependencies);
      }
    }
  }
  return closure;
}

/**
 * The fields among `fields` that hold formula cells, `extraField` included.
 */
function filterFormulaFields(
  cache: GridFormulaInternalCache,
  fields: Iterable<string>,
  extraField: string | null = null,
): string[] {
  return Array.from(fields).filter(
    (field) => field === extraField || (cache.recordsByField.get(field)?.size ?? 0) > 0,
  );
}

/**
 * The computed column and the stored computed columns that read it.
 */
function collectColumnReaders(cache: GridFormulaInternalCache, field: string): Set<string> {
  const readers = new Set([field]);
  for (const [computedField, closure] of cache.computedColumns.dependencyClosure) {
    if (closure.has(field)) {
      readers.add(computedField);
    }
  }
  return readers;
}

function readsAnyField(
  dependencies: FormulaBoundDependencies,
  fields: ReadonlySet<string>,
): boolean {
  for (const key of dependencies.cells) {
    if (fields.has(parseFormulaCellKey(key).field)) {
      return true;
    }
  }
  return (
    dependencies.columnIntervals.some((interval) => fields.has(interval.field)) ||
    dependencies.wholeColumns.some((wholeColumn) => fields.has(wholeColumn.field))
  );
}

interface GridFormulaDraftGraph {
  graph: Map<FormulaCellKey, Set<FormulaCellKey>>;
  /**
   * The nodes on a cycle, or downstream of one.
   */
  cyclic: Set<FormulaCellKey>;
  /**
   * The nodes of the cells and ranges of the computed column draft.
   */
  ownerNodes: Set<FormulaCellKey>;
  /**
   * The field of each range node.
   */
  rangeFields: Map<FormulaCellKey, string>;
}

/**
 * The formula cell graph of a pass, reachable from `starts`, once the draft is applied.
 * A computed column draft adds a node for each of its cells and ranges that a formula reads,
 * so that the cycles going through it can be told apart.
 */
function buildDraftGraph(
  apiRef: RefObject<GridPrivateApiPremium>,
  cache: GridFormulaInternalCache,
  owner: GridFormulaDraftOwner,
  starts: Iterable<FormulaCellKey>,
): GridFormulaDraftGraph {
  const positionContext = gridFormulaA1PositionContextSelector(apiRef);
  const computedRecords = cache.computedColumns.records;
  const ownerColumn = 'fieldRefs' in owner ? owner : null;
  const ownerCell = 'cell' in owner ? owner : null;
  const ownerField = ownerColumn?.field ?? null;
  const ownerCellKey =
    ownerCell === null ? null : createFormulaCellKey(ownerCell.cell.id, ownerCell.cell.field);

  const ownerFormulaFields =
    ownerColumn === null
      ? []
      : filterFormulaFields(
          cache,
          collectComputedClosure(cache, ownerColumn.fieldRefs, ownerField),
        );
  const ownerReaders = ownerField === null ? null : collectColumnReaders(cache, ownerField);

  // The formula fields read through a computed column, except through the draft column.
  // The field of a cell draft holds a formula cell once it is applied.
  const ownerCellField = ownerCell?.cell.field ?? null;
  const readThroughCache = new Map<string, string[]>();
  const getReadThrough = (field: string): string[] => {
    let fields = readThroughCache.get(field);
    if (fields === undefined) {
      const record = computedRecords.get(field);
      fields =
        field === ownerField || record === undefined
          ? []
          : filterFormulaFields(
              cache,
              collectComputedClosure(cache, record.dependencies, ownerField),
              ownerCellField,
            );
      readThroughCache.set(field, fields);
    }
    return fields;
  };

  const graph = new Map<FormulaCellKey, Set<FormulaCellKey>>();
  const ownerNodes = new Set<FormulaCellKey>();
  const rangeFields = new Map<FormulaCellKey, string>();
  const ranges = new Map<FormulaCellKey, { fromIndex: number; toIndex: number }>();
  const queue: FormulaCellKey[] = [];
  const addNode = (successors: Set<FormulaCellKey> | null, key: FormulaCellKey) => {
    successors?.add(key);
    if (!graph.has(key)) {
      graph.set(key, new Set());
      queue.push(key);
    }
  };
  const addCell = (successors: Set<FormulaCellKey>, key: FormulaCellKey) => {
    if (key === ownerCellKey || cache.records.has(key)) {
      addNode(successors, key);
    }
  };
  const addOwnerCell = (successors: Set<FormulaCellKey>, id: FormulaCellRef['id']) => {
    const key = createFormulaCellKey(id, ownerField ?? '');
    ownerNodes.add(key);
    addNode(successors, key);
  };
  // One node per range, shared by its readers: a range edge doesn't fan out per reader.
  const addRange = (
    successors: Set<FormulaCellKey>,
    field: string,
    fromIndex: number,
    toIndex: number,
  ) => {
    const key = [field, fromIndex, toIndex].join(RANGE_KEY_SEPARATOR) as FormulaCellKey;
    if (!ranges.has(key)) {
      ranges.set(key, { fromIndex, toIndex });
      rangeFields.set(key, field);
      if (field === ownerField) {
        ownerNodes.add(key);
      }
    }
    addNode(successors, key);
  };

  const addRangeRecords = (
    successors: Set<FormulaCellKey>,
    field: string,
    fromIndex: number,
    toIndex: number,
  ) => {
    const isInRange = (id: FormulaCellRef['id']) => {
      const position = positionContext.getPositionOfRowId(id);
      return position !== undefined && position >= fromIndex && position <= toIndex;
    };
    for (const key of cache.recordsByField.get(field) ?? []) {
      const record = cache.records.get(key);
      if (record !== undefined && isInRange(record.id)) {
        addNode(successors, key);
      }
    }
    if (
      ownerCell !== null &&
      ownerCellKey !== null &&
      ownerCell.cell.field === field &&
      !cache.records.has(ownerCellKey) &&
      isInRange(ownerCell.cell.id)
    ) {
      addNode(successors, ownerCellKey);
    }
  };

  const forEachRange = (
    dependencies: FormulaBoundDependencies,
    callback: (field: string, fromIndex: number, toIndex: number) => void,
  ) => {
    for (const interval of dependencies.columnIntervals) {
      callback(interval.field, interval.fromIndex, interval.toIndex);
    }
    for (const wholeColumn of dependencies.wholeColumns) {
      callback(wholeColumn.field, positionContext.dataFromIndex, positionContext.dataToIndex);
    }
  };

  // Dependencies bound without the computed closures, extended with the closures the draft
  // leads to, like `expandComputedDependencies` does in a pass.
  const addExpandedEdges = (
    successors: Set<FormulaCellKey>,
    dependencies: FormulaBoundDependencies,
  ) => {
    for (const key of dependencies.cells) {
      addCell(successors, key);
      const { id, field } = parseFormulaCellKey(key);
      for (const readField of getReadThrough(field)) {
        addCell(successors, createFormulaCellKey(id, readField));
      }
      if (ownerReaders?.has(field)) {
        addOwnerCell(successors, id);
      }
    }
    forEachRange(dependencies, (field, fromIndex, toIndex) => {
      if (field !== ownerField) {
        addRange(successors, field, fromIndex, toIndex);
      }
      for (const readField of getReadThrough(field)) {
        addRange(successors, readField, fromIndex, toIndex);
      }
      if (ownerField !== null && ownerReaders?.has(field)) {
        addRange(successors, ownerField, fromIndex, toIndex);
      }
    });
  };

  // Dependencies bound by a pass, closures included.
  const addStoredEdges = (
    successors: Set<FormulaCellKey>,
    dependencies: FormulaBoundDependencies,
  ) => {
    for (const key of dependencies.cells) {
      addCell(successors, key);
    }
    forEachRange(dependencies, (field, fromIndex, toIndex) =>
      addRange(successors, field, fromIndex, toIndex),
    );
  };

  for (const start of starts) {
    if (ownerField !== null && parseFormulaCellKey(start).field === ownerField) {
      ownerNodes.add(start);
    }
    addNode(null, start);
  }

  for (let key = queue.pop(); key !== undefined; key = queue.pop()) {
    const successors = graph.get(key);
    if (successors === undefined) {
      continue;
    }
    const range = ranges.get(key);
    if (range !== undefined) {
      const field = rangeFields.get(key);
      for (const rangeField of field === ownerField ? ownerFormulaFields : [field ?? '']) {
        addRangeRecords(successors, rangeField, range.fromIndex, range.toIndex);
      }
      continue;
    }
    if (ownerNodes.has(key)) {
      const { id } = parseFormulaCellKey(key);
      for (const field of ownerFormulaFields) {
        addCell(successors, createFormulaCellKey(id, field));
      }
      continue;
    }
    if (key === ownerCellKey && ownerCell !== null) {
      addExpandedEdges(successors, ownerCell.dependencies);
      continue;
    }
    const record: GridFormulaCellRecord | undefined = cache.records.get(key);
    const ast = record?.parse?.ast;
    if (record === undefined || record.dependencies === null || ast == null) {
      continue;
    }
    if (ownerReaders !== null && readsAnyField(record.dependencies, ownerReaders)) {
      // Its closures change with the draft: bound again, without the stored ones.
      addExpandedEdges(
        successors,
        bindFormulaDependencies(
          { id: record.id, field: record.field },
          getStaticDependencies(ast),
          record.usesPositionContext ? positionContext : EMPTY_POSITION_CONTEXT,
        ),
      );
    } else {
      addStoredEdges(successors, record.dependencies);
    }
  }

  const { cyclic } = orderForRecompute(new Set(graph.keys()), (key) => graph.get(key));
  return { graph, cyclic, ownerNodes, rangeFields };
}

/**
 * Whether `cell` is on a cycle, or downstream of one, once the draft is applied.
 * For a computed column draft, `cell` is a cell of the column.
 * @param {RefObject<GridPrivateApiPremium>} apiRef The private grid api.
 * @param {GridFormulaDraftOwner} owner The draft.
 * @param {FormulaCellRef} cell The cell to check.
 * @returns {boolean} `true` when the cell would be `#CYCLE!`.
 */
export function isDraftCellCyclic(
  apiRef: RefObject<GridPrivateApiPremium>,
  owner: GridFormulaDraftOwner,
  cell: FormulaCellRef,
): boolean {
  const cache = apiRef.current.caches.formula;
  if (cache === undefined) {
    return false;
  }
  const key = createFormulaCellKey(cell.id, cell.field);
  return buildDraftGraph(apiRef, cache, owner, [key]).cyclic.has(key);
}

/**
 * Whether a formula cell reads one of `fields`, directly or through a range.
 */
function hasFormulaReader(cache: GridFormulaInternalCache, fields: ReadonlySet<string>): boolean {
  for (const field of fields) {
    if ((cache.rangeDependentsByField.get(field)?.size ?? 0) > 0) {
      return true;
    }
  }
  for (const key of cache.dependents.keys()) {
    if (fields.has(parseFormulaCellKey(key).field)) {
      return true;
    }
  }
  return false;
}

/**
 * The fields of a cycle that a computed column draft closes through formula cells, or `null`.
 * @param {RefObject<GridPrivateApiPremium>} apiRef The private grid api.
 * @param {string} field The field of the computed column.
 * @param {ReadonlySet<string>} fieldRefs The fields the draft reads.
 * @returns {string[] | null} The fields of the cycle, starting and ending with `field`.
 */
export function findComputedColumnCellCycle(
  apiRef: RefObject<GridPrivateApiPremium>,
  field: string,
  fieldRefs: ReadonlySet<string>,
): string[] | null {
  const cache = apiRef.current.caches.formula;
  if (cache === undefined || cache.records.size === 0) {
    return null;
  }
  // A cycle goes from the column to a formula cell it reads, and back to the column.
  const formulaFields = filterFormulaFields(cache, collectComputedClosure(cache, fieldRefs, field));
  if (formulaFields.length === 0 || !hasFormulaReader(cache, collectColumnReaders(cache, field))) {
    return null;
  }

  const starts = formulaFields.flatMap((formulaField) =>
    Array.from(cache.recordsByField.get(formulaField) ?? []),
  );
  const { graph, cyclic, ownerNodes, rangeFields } = buildDraftGraph(
    apiRef,
    cache,
    { field, fieldRefs },
    starts,
  );
  for (const key of ownerNodes) {
    const path = cyclic.has(key) ? findCyclePath(key, cyclic, graph) : null;
    if (path !== null) {
      return path
        .map((pathKey) => rangeFields.get(pathKey) ?? parseFormulaCellKey(pathKey).field)
        .filter((pathField, index, fields) => index === 0 || pathField !== fields[index - 1]);
    }
  }
  return null;
}
