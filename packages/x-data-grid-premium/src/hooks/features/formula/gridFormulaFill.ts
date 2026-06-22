import type { GridRowId } from '@mui/x-data-grid-pro';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import {
  getFormulaExpression,
  offsetFormulaReferences,
  parseFormula,
  serializeFormulaAst,
} from './engine';
import { gridFormulaA1PositionContextSelector } from './gridFormulaPositionContext';

interface GridFormulaFillCell {
  id: GridRowId;
  field: string;
}

/**
 * Computes the value to fill into `targetCell` when the fill handle drags
 * `sourceCell`. When the source is a live formula and the target column accepts
 * formulas, the formula's relative references are shifted by the source→target
 * positional delta (Excel fill semantics) and the adjusted canonical source is
 * returned. In every other case it returns `null`, and the caller copies the
 * source cell's evaluated value as before.
 *
 * Returns `null` when:
 * - the target column is not `allowFormulas` — a `=…` string there would be
 *   inert literal text, so the evaluated value is copied instead;
 * - the source cell is not a live, evaluated formula (`getCellFormulaResult`
 *   covers `allowFormulas`, `disableFormulas`/`dataSource`/pivot, and a real `=`
 *   value, and rejects a literal `=text` parked in a non-formula column).
 *
 * When the source is a formula but cannot be adjusted (parse error, or a cell
 * outside the position context such as a group/pinned row), the original
 * canonical source is returned unchanged so the formula is never dropped.
 */
export function getFilledFormulaSource(
  apiRef: RefObject<GridPrivateApiPremium>,
  sourceCell: GridFormulaFillCell,
  targetCell: GridFormulaFillCell,
): string | null {
  if (apiRef.current.getColumn(targetCell.field)?.allowFormulas !== true) {
    return null;
  }
  if (apiRef.current.getCellFormulaResult(sourceCell.id, sourceCell.field) === null) {
    return null;
  }
  const source = apiRef.current.getCellFormula(sourceCell.id, sourceCell.field);
  if (source === null) {
    return null;
  }

  const { ast } = parseFormula(getFormulaExpression(source));
  if (ast === null) {
    return source;
  }

  const positionContext = gridFormulaA1PositionContextSelector(apiRef);
  const sourceRowPosition = positionContext.getPositionOfRowId(sourceCell.id);
  const sourceColumnPosition = positionContext.getPositionOfField(sourceCell.field);
  const targetRowPosition = positionContext.getPositionOfRowId(targetCell.id);
  const targetColumnPosition = positionContext.getPositionOfField(targetCell.field);
  if (
    sourceRowPosition === undefined ||
    sourceColumnPosition === undefined ||
    targetRowPosition === undefined ||
    targetColumnPosition === undefined
  ) {
    return source;
  }

  const rowDelta = targetRowPosition - sourceRowPosition;
  const columnDelta = targetColumnPosition - sourceColumnPosition;
  if (rowDelta === 0 && columnDelta === 0) {
    return source;
  }

  return `=${serializeFormulaAst(offsetFormulaReferences(ast, rowDelta, columnDelta, positionContext))}`;
}
