import type { GridRowId, GridValidRowModel, GridColDef } from '@mui/x-data-grid-pro';
import type {
  FormulaBoundDependencies,
  FormulaCellKey,
  FormulaErrorCode,
  FormulaFunctionArg,
  FormulaFunctionContext,
  FormulaFunctionDefinition,
  FormulaFunctionRegistry,
  FormulaParseResult,
  FormulaParser,
  FormulaPositionContext,
  FormulaResult,
  FormulaValidationIssue,
  FormulaValidationResult,
} from './engine';

/**
 * The outcome of evaluating one formula cell.
 */
export type GridFormulaResult = FormulaResult;

/**
 * Error codes produced by formula parsing and evaluation, rendered as the cell content.
 */
export type GridFormulaErrorCode = FormulaErrorCode;

/**
 * Serialized `${id}\u0000${field}` cell key used in formula caches.
 * Always created through the engine helpers — never derive the format manually.
 */
export type GridFormulaCellKey = FormulaCellKey;

export type GridFormulaValidationResult = FormulaValidationResult;

export type GridFormulaValidationIssue = FormulaValidationIssue;

/**
 * Definition of a function callable from formulas.
 * The `apply` implementation only receives engine values — never the grid API.
 */
export type GridFormulaFunctionDefinition = FormulaFunctionDefinition;

export type GridFormulaFunctionContext = FormulaFunctionContext;

export type GridFormulaFunctionArg = FormulaFunctionArg;

/**
 * Evaluated formula results, keyed by row id and field.
 * Membership in this lookup is what masks the raw `=` source from the rest of
 * the grid — a formula evaluating to `null` still has an entry.
 */
export type GridFormulaLookup = {
  [rowId: GridRowId]: {
    [field: string]: GridFormulaResult;
  };
};

/**
 * The cell whose formula our built-in editor is currently editing.
 */
export interface GridFormulaActiveEdit {
  id: GridRowId;
  field: string;
}

export interface GridFormulaState {
  lookup: GridFormulaLookup;
  /**
   * The cell whose formula references are highlighted, or `null`. Set when our
   * formula editor renders and cleared on `cellEditStop`; it outlives the
   * editing cell being virtualized out (so the in-grid reference overlay
   * persists) and is never set for a column with a custom editor.
   */
  activeEdit: GridFormulaActiveEdit | null;
}

/**
 * One scanned formula cell. `parse` is `null` for `'=` escaped literals,
 * which evaluate to their unescaped string without entering the graph.
 */
export interface GridFormulaCellRecord {
  id: GridRowId;
  field: string;
  source: string;
  parse: FormulaParseResult | null;
  dependencies: FormulaBoundDependencies | null;
  /**
   * `true` when the formula contains positional selectors, `RANGE` or
   * `COLUMN_VALUES` — its dependencies were resolved against a position
   * context and must rebind when that context changes.
   */
  usesPositionContext: boolean;
  result: GridFormulaResult;
}

/**
 * The slices of one record's range dependencies that read a given field.
 * Stored per dependent in `rangeDependentsByField` — interval records,
 * never exploded per-cell edges.
 */
export interface GridFormulaRangeDependency {
  /**
   * Bounded `RANGE` slices: rows `fromIndex..toIndex` (1-based, inclusive)
   * of the field in the position context's row order.
   */
  intervals: { fromIndex: number; toIndex: number }[];
  /**
   * `true` when the record reads the whole column (`COLUMN_VALUES`).
   */
  wholeColumn: boolean;
}

export interface GridFormulaCellEditStartInfo {
  id: GridRowId;
  field: string;
  /**
   * `true` when the edit started by typing/deleting/pasting — the edit value
   * was intentionally replaced and must not be re-seeded with the source.
   */
  replaceValue: boolean;
  /**
   * `true` when the edit started by typing `=` — the user is entering a
   * formula, so the formula text editor renders even on a plain cell.
   */
  startedWithEquals: boolean;
}

export interface GridFormulaInternalCache {
  /**
   * Interning parser: identical sources share one parse result.
   */
  parser: FormulaParser;
  registry: FormulaFunctionRegistry;
  /**
   * The `formulaFunctions` prop value `registry` was built from,
   * compared by reference to detect prop changes.
   */
  registrySource: Record<string, GridFormulaFunctionDefinition>;
  records: Map<GridFormulaCellKey, GridFormulaCellRecord>;
  /**
   * Reverse dependency edges: for a cell key, the formula cells that read it.
   */
  dependents: Map<GridFormulaCellKey, Set<GridFormulaCellKey>>;
  /**
   * Formula cells depending on any cell of a row, keyed by stringified row id.
   * Lets row additions/removals dirty their dependents in O(dependents).
   */
  dependentsByRowId: Map<string, Set<GridFormulaCellKey>>;
  /**
   * Formula records grouped by the field they live in. This is what expands
   * an interval dependency into graph edges: only the formula cells of the
   * field can participate in cycles or require ordered recomputation —
   * raw cells never do.
   */
  recordsByField: Map<string, Set<GridFormulaCellKey>>;
  /**
   * Keys of the records with `usesPositionContext` — the set a rebind pass
   * re-binds when the position context changes.
   */
  positionDependentKeys: Set<GridFormulaCellKey>;
  /**
   * Reverse range-dependency tier: for each field, the formula cells whose
   * `RANGE`/`COLUMN_VALUES` dependencies read it, as interval records.
   * A change to cell `(id, field)` dirties the dependents whose interval
   * contains the row's position (or any whole-column dependent).
   */
  rangeDependentsByField: Map<string, Map<GridFormulaCellKey, GridFormulaRangeDependency>>;
  /**
   * The position-context snapshot records are currently bound against.
   * Built lazily (only when a position-dependent formula exists) and
   * replaced by rebind passes; `null` means "build on first need".
   */
  positionContext: FormulaPositionContext | null;
  /**
   * The exact row order behind `positionContext` — compared on rebind events
   * to skip rebinding when positions did not actually change.
   */
  positionContextRowIds: GridRowId[] | null;
  /**
   * The exact visible-field order behind `positionContext`.
   */
  positionContextFields: string[] | null;
  /**
   * Monotonic counter stamped into each built position context.
   */
  positionContextVersion: number;
  /**
   * Guards the post-pass re-grouping trigger: the row-tree rebuild it fires
   * cascades into another formula pass, which must not fire it again.
   */
  suppressRegroupTrigger: boolean;
  /**
   * Last value resolved for each raw (non-formula) dependency cell,
   * keyed by stringified row id then field. Compared on row change to decide
   * whether dependents must recompute.
   */
  trackedValues: Map<string, Map<GridColDef['field'], unknown>>;
  /**
   * Rows lookup snapshot from the last pass — rows are replaced immutably,
   * so a reference diff finds the changed/added/removed ids.
   */
  lastRowIdToModelLookup: Record<GridRowId, GridValidRowModel> | null;
  /**
   * Fields with `allowFormulas` at the last pass.
   */
  formulaFields: string[];
  /**
   * `field → valueGetter` of every column at the last pass. Evaluation reads
   * raw dependencies through column definitions, so adding/removing a column
   * or changing a `valueGetter` must trigger a re-evaluation even when the
   * `allowFormulas` field set is unchanged.
   */
  lastColumnsSignature: Map<GridColDef['field'], unknown>;
  lastCellEditStart: GridFormulaCellEditStartInfo | null;
  /**
   * The A1 value last seeded into the editor and the canonical source it came
   * from (A1 notation only). Lets the commit parser detect an unchanged edit
   * and restore the stored canonical instead of re-freezing relative references
   * against a possibly re-sorted view. Cleared on `cellEditStop`.
   */
  lastA1Seed: { id: GridRowId; field: string; display: string; canonical: string } | null;
  /**
   * Position of the first cell of the current clipboard paste (A1 notation
   * only). Subsequent pasted cells offset their relative references by their
   * distance from this origin — the Excel fill adjustment. Armed on
   * `clipboardPasteStart`, consumed lazily by the first pasted cell.
   */
  pasteOrigin: { rowPosition: number | undefined; columnPosition: number | undefined } | null;
}

export interface GridFormulaPrivateApi {
  /**
   * Stores a formula as the cell's row-data value and re-evaluates.
   * @param {GridRowId} id The row id.
   * @param {string} field The column field. Must have `allowFormulas` enabled.
   * @param {string} formula The formula source, starting with `=`.
   */
  setCellFormula: (id: GridRowId, field: string, formula: string) => void;
  /**
   * Returns the formula source stored in the cell's row data,
   * or `null` when the cell does not hold a formula.
   * @param {GridRowId} id The row id.
   * @param {string} field The column field.
   * @returns {string | null} The formula source, including the leading `=`.
   */
  getCellFormula: (id: GridRowId, field: string) => string | null;
  /**
   * Returns the evaluated result of a formula cell,
   * or `null` when the cell does not hold a formula.
   * @param {GridRowId} id The row id.
   * @param {string} field The column field.
   * @returns {GridFormulaResult | null} The evaluation result.
   */
  getCellFormulaResult: (id: GridRowId, field: string) => GridFormulaResult | null;
  /**
   * Statically validates a formula source against the current function registry.
   * Validation is informative — invalid formulas can still be committed.
   * @param {string} formula The formula source, with or without the leading `=`.
   * @returns {GridFormulaValidationResult} The validation result.
   */
  validateCellFormula: (formula: string) => GridFormulaValidationResult;
  /**
   * Discards every formula cache and re-evaluates all formulas.
   * Escape hatch for in-place row mutations the grid cannot observe.
   */
  reevaluateFormulas: () => void;
  /**
   * Runs a full formula evaluation pass and refreshes dependent features.
   */
  applyFormulaEvaluation: () => void;
  /**
   * Sets (or clears with `null`) the cell whose formula references are
   * highlighted in the editor and outlined in the grid.
   * @param {GridFormulaActiveEdit | null} cell The cell being edited, or `null` to clear.
   */
  setFormulaActiveEdit: (cell: GridFormulaActiveEdit | null) => void;
}
