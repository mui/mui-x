import { gridColumnLookupSelector, gridRowsLookupSelector } from '@mui/x-data-grid-pro';
import type { GridRowId } from '@mui/x-data-grid-pro';
import { getRowValue as getRowValueUtil } from '@mui/x-data-grid-pro/internals';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  bindFormulaDependencies,
  createFormulaError,
  evaluateFormula,
  extractFormulaDependencies,
  getFormulaExpression,
  isEscapedFormulaSource,
  isFormulaSource,
  parseFormula,
  toCanonicalFormula,
  unescapeLiteralSource,
} from './engine';
import type {
  FormulaAstNode,
  FormulaCellRef,
  FormulaPositionContext,
  FormulaScalar,
} from './engine';
import type { GridFormulaResult } from './gridFormulaInterfaces';
import { gridFormulaLookupSelector } from './gridFormulaSelectors';
import { gridFormulaA1PositionContextSelector } from './gridFormulaPositionContext';
import { CYCLE_RESULT, resolveComputedCellValue } from './gridComputedColumnsRuntime';
import {
  createComputedColumnValidationScope,
  getComputedColumnVerdict,
} from './gridComputedColumnsValidation';
import { isDraftCellCyclic } from './gridFormulaDraftCycles';

/**
 * The owner field of a computed column draft that has no field yet.
 */
export const DRAFT_COMPUTED_FIELD = '__computed_draft__';

/**
 * Evaluates a DRAFT formula source against the current grid data without
 * committing anything — the formula bar's on-the-fly result preview. Reads are
 * strictly side-effect free: formula-cell dependencies resolve from the
 * committed lookup (state), raw dependencies through `valueGetter` from row
 * data, computed cells from their typed result (the memo the cells share),
 * positions from the live view position context. Nothing is written to the
 * evaluation cache or its invalidation bookkeeping.
 *
 * @param {RefObject<GridPrivateApiPremium>} apiRef The private grid api.
 * @param {{ id: GridRowId; field: string }} cell The cell the draft belongs to.
 * @param {string} source The draft text, including the leading `=`.
 * @param {{ a1Notation: boolean }} options Whether the draft is written in the A1 dialect.
 * @returns {GridFormulaResult | null} The would-be result, or `null` for a non-formula draft.
 */
export function previewFormulaResult(
  apiRef: RefObject<GridPrivateApiPremium>,
  cell: { id: GridRowId; field: string },
  source: string,
  options: { a1Notation: boolean },
): GridFormulaResult | null {
  if (isEscapedFormulaSource(source)) {
    return { type: 'value', value: unescapeLiteralSource(source) };
  }
  if (!isFormulaSource(source)) {
    return null;
  }
  const currentCell: FormulaCellRef = { id: cell.id, field: cell.field };
  const parsed = parseDraftFormula(apiRef, currentCell, source, options.a1Notation);
  if ('error' in parsed) {
    return parsed.error;
  }
  // The committed values predate the draft: a cycle it closes, directly or
  // through other formula cells, is only found in the graph.
  const dependencies = bindFormulaDependencies(
    currentCell,
    extractFormulaDependencies(parsed.ast),
    parsed.positionContext,
  );
  if (isDraftCellCyclic(apiRef, { cell: currentCell, dependencies }, currentCell)) {
    return CYCLE_RESULT;
  }
  return evaluateDraftFormula(apiRef, currentCell, parsed.ast, parsed.positionContext);
}

type GridFormulaDraftParse =
  { ast: FormulaAstNode; positionContext: FormulaPositionContext } | { error: GridFormulaResult };

function parseDraftFormula(
  apiRef: RefObject<GridPrivateApiPremium>,
  cell: FormulaCellRef,
  source: string,
  a1Notation: boolean,
): GridFormulaDraftParse {
  const positionContext = gridFormulaA1PositionContextSelector(apiRef);
  let expression = getFormulaExpression(source);
  if (a1Notation) {
    // The commit-time conversion, without a fill offset. Canonical text carries
    // no bare A1 tokens and passes through unchanged (the same idempotency the
    // paste path relies on).
    expression = toCanonicalFormula(expression, {
      positionContext,
      anchorCell: { id: cell.id, field: cell.field },
    }).source;
  }
  // Deliberately NOT the interning parser: drafts are transient one-off strings
  // and would grow the intern map by one entry per keystroke.
  const parse = parseFormula(expression);
  if (parse.ast === null) {
    return {
      error: {
        type: 'error',
        code: '#ERROR!',
        message: parse.error?.message ?? 'The formula could not be parsed.',
      },
    };
  }
  return { ast: parse.ast, positionContext };
}

function evaluateDraftFormula(
  apiRef: RefObject<GridPrivateApiPremium>,
  cell: FormulaCellRef,
  ast: FormulaAstNode,
  positionContext: FormulaPositionContext,
): GridFormulaResult {
  const lookup = gridFormulaLookupSelector(apiRef);
  const rowsLookup = gridRowsLookupSelector(apiRef);
  const columnsLookup = gridColumnLookupSelector(apiRef);
  return evaluateFormula(ast, {
    currentCell: cell,
    getCellValue: (ref) => {
      const committed = lookup[String(ref.id)]?.[ref.field];
      if (committed !== undefined) {
        return committed.type === 'error'
          ? createFormulaError(committed.code, committed.message)
          : (committed.value as FormulaScalar);
      }
      const row = rowsLookup[ref.id];
      if (row === undefined) {
        return null;
      }
      const colDef = columnsLookup[ref.field];
      if (colDef === undefined) {
        return undefined;
      }
      if (colDef.computed) {
        return resolveComputedCellValue(apiRef, row, ref.field);
      }
      return getRowValueUtil(row, colDef, apiRef) as FormulaScalar;
    },
    hasRow: (id) => rowsLookup[id] !== undefined,
    hasField: (field) => columnsLookup[field] !== undefined,
    position: positionContext,
    functions: apiRef.current.caches.formula!.registry,
  });
}

/**
 * Evaluates a computed column DRAFT for one row, as the cell would once the draft is applied.
 * @param {RefObject<GridPrivateApiPremium>} apiRef The private grid api.
 * @param {GridRowId} rowId The row to evaluate.
 * @param {string} field The field of the draft, `''` when it has none yet.
 * @param {string} formula The draft formula, including the leading `=`.
 * @param {object} options The options.
 * @param {string} options.ignoreField The field of the stored definition the draft replaces.
 * @returns {GridFormulaResult | null} The would-be result, or `null` without the formula feature.
 */
export function previewComputedColumnResult(
  apiRef: RefObject<GridPrivateApiPremium>,
  rowId: GridRowId,
  field: string,
  formula: string,
  options: { ignoreField?: string } = {},
): GridFormulaResult | null {
  const cache = apiRef.current.caches.formula;
  if (cache === undefined) {
    return null;
  }
  const scope = createComputedColumnValidationScope(
    apiRef,
    cache,
    gridColumnLookupSelector(apiRef),
    false,
    { intern: false },
  );
  // The result of every row when the draft is invalid, as for a stored definition.
  const { staticResult } = getComputedColumnVerdict(
    { field, headerName: field, formula, type: 'string' },
    scope,
    { ignoreField: options.ignoreField },
  );
  if (staticResult !== null) {
    return staticResult;
  }
  const currentCell: FormulaCellRef = {
    id: rowId,
    field: field === '' ? DRAFT_COMPUTED_FIELD : field,
  };
  // Computed column formulas are read as written, without the A1 conversion.
  const parsed = parseDraftFormula(apiRef, currentCell, formula, false);
  if ('error' in parsed) {
    return parsed.error;
  }
  if (
    field !== '' &&
    !scope.columnFields.has(field) &&
    isDraftCellCyclic(
      apiRef,
      { field, fieldRefs: extractFormulaDependencies(parsed.ast).fieldRefs },
      currentCell,
    )
  ) {
    return CYCLE_RESULT;
  }
  return evaluateDraftFormula(apiRef, currentCell, parsed.ast, parsed.positionContext);
}
