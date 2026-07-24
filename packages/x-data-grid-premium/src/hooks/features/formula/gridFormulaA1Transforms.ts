import { gridFocusCellSelector, gridRowIdSelector } from '@mui/x-data-grid-pro';
import type { GridColDef, GridRowModel } from '@mui/x-data-grid-pro';
import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { getFormulaExpression, toCanonicalFormula, toDisplayFormula } from './engine';
import { gridFormulaA1PositionContextSelector } from './gridFormulaPositionContext';

/**
 * Adapter-layer glue between the editor pipeline and the pure A1 engine
 * transforms. A1 is editing-UI only: `toCanonicalFormula` runs at commit/paste,
 * `toDisplayFormula` at edit-begin, and the stored row value, copy, export and
 * `getCellFormula` always stay canonical.
 */

/**
 * Renders a stored canonical formula source as A1 for the editor seed.
 */
export function convertCanonicalToA1Display(
  source: string,
  apiRef: RefObject<GridPrivateApiPremium>,
): string {
  const positionContext = gridFormulaA1PositionContextSelector(apiRef);
  return `=${toDisplayFormula(getFormulaExpression(source), { positionContext })}`;
}

/**
 * Converts an A1 formula committed through the editor to canonical form. When
 * the committed text is identical to what was seeded (Enter without an edit),
 * the stored canonical source is returned unchanged — re-freezing relative
 * references against a possibly re-sorted view would silently change them.
 */
export function convertA1ToCanonicalCommit(
  source: string,
  row: GridRowModel,
  colDef: GridColDef,
  apiRef: RefObject<GridPrivateApiPremium>,
): string {
  const cache = apiRef.current.caches.formula;
  const seed = cache.lastA1Seed;
  const id = gridRowIdSelector(apiRef, row);
  if (seed !== null && seed.id === id && seed.field === colDef.field && seed.display === source) {
    return seed.canonical;
  }
  const positionContext = gridFormulaA1PositionContextSelector(apiRef);
  return `=${toCanonicalFormula(getFormulaExpression(source), { positionContext }).source}`;
}

/**
 * Converts an A1 formula pasted into a cell to canonical form, applying the
 * Excel fill offset: relative references shift by the target cell's distance
 * from the paste origin (the top-left target cell). Canonical formulas
 * pasted from an in-grid copy carry no A1 tokens and pass through unchanged.
 */
export function convertA1ToCanonicalPaste(
  source: string,
  row: GridRowModel,
  colDef: GridColDef,
  apiRef: RefObject<GridPrivateApiPremium>,
): string {
  const cache = apiRef.current.caches.formula;
  const positionContext = gridFormulaA1PositionContextSelector(apiRef);
  const id = gridRowIdSelector(apiRef, row);
  const rowPosition = positionContext.getPositionOfRowId(id);
  const columnPosition = positionContext.getPositionOfField(colDef.field);

  if (cache.pasteOrigin === null) {
    // Anchor the Excel fill offset to the paste's top-left target cell, not the
    // first editable formula cell to reach this transform: leading cells skipped
    // for being non-editable or carrying a non-formula value never call this
    // function, so anchoring lazily here would displace the origin and shift
    // every subsequent relative reference. The focused cell is that top-left
    // anchor on the common (focused-cell) paste path; fall back to this cell when
    // there is no focus (e.g. a multi-cell selection paste).
    const focusedCell = gridFocusCellSelector(apiRef);
    cache.pasteOrigin =
      focusedCell !== null
        ? {
            rowPosition: positionContext.getPositionOfRowId(focusedCell.id),
            columnPosition: positionContext.getPositionOfField(focusedCell.field),
          }
        : { rowPosition, columnPosition };
  }
  const origin = cache.pasteOrigin;

  // Offsets are non-negative because the paste resolver iterates from the
  // top-left target cell; the `> 0` guard keeps an unexpected non-top-left
  // origin from producing an unrepresentable position.
  let rowOffset = 0;
  if (origin.rowPosition !== undefined && rowPosition !== undefined) {
    rowOffset = Math.max(0, rowPosition - origin.rowPosition);
  }
  let columnOffset = 0;
  if (origin.columnPosition !== undefined && columnPosition !== undefined) {
    columnOffset = Math.max(0, columnPosition - origin.columnPosition);
  }

  return `=${
    toCanonicalFormula(
      getFormulaExpression(source),
      { positionContext },
      { rowOffset, columnOffset },
    ).source
  }`;
}
