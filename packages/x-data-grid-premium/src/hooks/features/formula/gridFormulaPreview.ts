import { gridColumnLookupSelector, gridRowsLookupSelector } from '@mui/x-data-grid-pro';
import type { GridRowId } from '@mui/x-data-grid-pro';
import { getRowValue as getRowValueUtil } from '@mui/x-data-grid-pro/internals';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  bindFormulaDependencies,
  createFormulaCellKey,
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
import type { FormulaCellRef, FormulaScalar } from './engine';
import type { GridFormulaResult } from './gridFormulaInterfaces';
import { gridFormulaLookupSelector } from './gridFormulaSelectors';
import { gridFormulaA1PositionContextSelector } from './gridFormulaPositionContext';

/**
 * Evaluates a DRAFT formula source against the current grid data without
 * committing anything — the formula bar's on-the-fly result preview. Reads are
 * strictly side-effect free: formula-cell dependencies resolve from the
 * committed lookup (state), raw dependencies through `valueGetter` from row
 * data, positions from the live view position context. Nothing is written to
 * the evaluation cache or its invalidation bookkeeping.
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
  const positionContext = gridFormulaA1PositionContextSelector(apiRef);
  let expression = getFormulaExpression(source);
  if (options.a1Notation) {
    // The commit-time conversion, without a fill offset. Canonical text carries
    // no bare A1 tokens and passes through unchanged (the same idempotency the
    // paste path relies on).
    expression = toCanonicalFormula(expression, { positionContext }).source;
  }
  // Deliberately NOT the interning parser: drafts are transient one-off strings
  // and would grow the intern map by one entry per keystroke.
  const parse = parseFormula(expression);
  if (parse.ast === null) {
    return {
      type: 'error',
      code: '#ERROR!',
      message: parse.error?.message ?? 'The formula could not be parsed.',
    };
  }

  // Committing this draft would make the cell a formula cell, so a dependency
  // on itself — directly, or through a range/whole-column that covers it — is
  // the cycle the graph layer would report after the commit. The evaluator
  // alone would miss it: it materializes ranges cell by cell and would read the
  // cell's COMMITTED value, previewing a plausible-but-wrong number. Ranges
  // only cover rows with a position, so a filtered-out own row is no cycle.
  const staticDependencies = extractFormulaDependencies(parse.ast);
  const currentCell: FormulaCellRef = { id: cell.id, field: cell.field };
  const bound = bindFormulaDependencies(currentCell, staticDependencies, positionContext);
  const ownKey = createFormulaCellKey(cell.id, cell.field);
  const ownPosition = positionContext.getPositionOfRowId(cell.id);
  const selfReferences =
    bound.cells.has(ownKey) ||
    (ownPosition !== undefined &&
      (bound.wholeColumns.some((column) => column.field === cell.field) ||
        bound.columnIntervals.some(
          (interval) =>
            interval.field === cell.field &&
            ownPosition >= interval.fromIndex &&
            ownPosition <= interval.toIndex,
        )));
  if (selfReferences) {
    return {
      type: 'error',
      code: '#CYCLE!',
      message: 'The formula is part of a circular reference.',
    };
  }

  const lookup = gridFormulaLookupSelector(apiRef);
  const rowsLookup = gridRowsLookupSelector(apiRef);
  const columnsLookup = gridColumnLookupSelector(apiRef);
  return evaluateFormula(parse.ast, {
    currentCell,
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
      return getRowValueUtil(row, colDef, apiRef) as FormulaScalar;
    },
    hasRow: (id) => rowsLookup[id] !== undefined,
    hasField: (field) => columnsLookup[field] !== undefined,
    position: positionContext,
    functions: apiRef.current.caches.formula.registry,
  });
}
