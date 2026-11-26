import type { RefObject } from '@mui/x-internals/types';
import { gridRowIdSelector } from '@mui/x-data-grid-pro';
import type { GridValidRowModel } from '@mui/x-data-grid-pro';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  evaluateFormula,
  getFormulaExpression,
  serializeFormulaAstToExcel,
  toFormulaBoolean,
} from './engine';
import type { FormulaAstNode } from './engine';
import { getStaticDependencies } from './createFormulaEvaluation';
import { createSameRowEvaluationContext } from './gridComputedColumnsRuntime';
import type { GridFormulaInternalCache } from './gridFormulaInterfaces';

/**
 * The AST of a condition formula, or `null` when it does not parse or
 * references anything but columns of the same row.
 */
function getSameRowAst(cache: GridFormulaInternalCache, formula: string): FormulaAstNode | null {
  const { ast } = cache.parser.parse(getFormulaExpression(formula));
  if (ast === null) {
    return null;
  }
  const dependencies = getStaticDependencies(ast);
  if (
    dependencies.usesPositionContext ||
    dependencies.cellRefs.length > 0 ||
    dependencies.ranges.length > 0 ||
    dependencies.columnValues.size > 0
  ) {
    return null;
  }
  return ast;
}

export function evaluateCellFormulaCondition(
  apiRef: RefObject<GridPrivateApiPremium>,
  formula: string,
  row: GridValidRowModel,
): boolean {
  const cache = apiRef.current.caches.formula;
  if (cache === undefined || typeof formula !== 'string') {
    return false;
  }
  const ast = getSameRowAst(cache, formula);
  if (ast === null) {
    return false;
  }
  // The condition belongs to the row, not to a cell: no field of its own.
  const id = gridRowIdSelector(apiRef, row);
  const result = evaluateFormula(ast, createSameRowEvaluationContext(apiRef, cache, row, id, ''));
  return result.type === 'value' && toFormulaBoolean(result.value) === true;
}

/**
 * Returns `null` when the formula calls a function missing from the registry:
 * the model can come from untrusted data, and Excel would evaluate the call.
 */
export function getCellFormulaConditionExcelFormula(
  apiRef: RefObject<GridPrivateApiPremium>,
  formula: string,
  fieldToColumnLetter: Map<string, string>,
  rowNumber: number,
): string | null {
  const cache = apiRef.current.caches.formula;
  if (cache === undefined || typeof formula !== 'string') {
    return null;
  }
  const ast = getSameRowAst(cache, formula);
  if (ast === null) {
    return null;
  }
  for (const name of getStaticDependencies(ast).calls) {
    if (cache.registry.get(name) === undefined) {
      return null;
    }
  }
  const serialized = serializeFormulaAstToExcel(ast, {
    resolveColumn: (selector) => {
      const letter =
        selector.kind === 'field' ? fieldToColumnLetter.get(selector.field) : undefined;
      return letter === undefined ? null : { letter, absolute: false };
    },
    resolveRow: () => null,
    resolveRangeWindow: () => null,
    ownerRowNumber: rowNumber,
    firstDataRowNumber: rowNumber,
    lastDataRowNumber: rowNumber,
  });
  return serialized.hasRefError ? null : serialized.formula;
}
