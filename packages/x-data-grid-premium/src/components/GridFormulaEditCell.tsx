'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import {
  GridEditInputCell,
  renderEditInputCell,
  renderEditDateCell,
  renderEditBooleanCell,
  renderEditSingleSelectCell,
  renderEditLongTextCell,
} from '@mui/x-data-grid-pro';
import type { GridColDef, GridRenderEditCellParams } from '@mui/x-data-grid-pro';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { isEscapedFormulaSource, isFormulaSource } from '../hooks/features/formula/engine';
import { gridCellFormulaResultSelector } from '../hooks/features/formula/gridFormulaSelectors';
import { convertCanonicalToA1Display } from '../hooks/features/formula/gridFormulaA1Transforms';
import { GridFormulaAutocomplete } from './GridFormulaAutocomplete';
import { GridFormulaReferenceBackdrop } from './GridFormulaReferenceBackdrop';

export interface GridFormulaEditCellProps extends GridRenderEditCellParams {
  /**
   * The edit component the column would render without formula support.
   */
  originalRenderEditCell?: GridColDef['renderEditCell'];
}

/**
 * The built-in edit-cell renderers a column type can default to (string/number,
 * date/dateTime, boolean, singleSelect, longText). The column-type merge replaces
 * `renderEditCell` rather than stacking it (`gridColumnsUtils.ts`), so the value
 * reaching the formula wrapper is exactly one of these defaults or a function the
 * user supplied — on the column directly or through a custom column `type`. A
 * supplied function reads as custom and must win, even for `=` values.
 */
const BUILT_IN_EDIT_RENDERERS = new Set<GridColDef['renderEditCell']>([
  renderEditInputCell,
  renderEditDateCell,
  renderEditBooleanCell,
  renderEditSingleSelectCell,
  renderEditLongTextCell,
]);

// Not a type predicate: its false case includes the built-in renderers, which
// are non-null, so a predicate would wrongly narrow the value to `undefined`.
function isUserCustomEditCellRenderer(renderEditCell: GridColDef['renderEditCell']): boolean {
  return renderEditCell != null && !BUILT_IN_EDIT_RENDERERS.has(renderEditCell);
}

function isFormulaEditValue(value: unknown): boolean {
  return isFormulaSource(value) || isEscapedFormulaSource(value);
}

function areSeededValuesEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
}

/**
 * Edit component for `allowFormulas` columns. When the cell holds a formula,
 * it seeds the edit state with the stored source (the view value is the
 * evaluated result — committing it back would destroy the formula) and renders
 * a text input even on non-string columns.
 */
function GridFormulaEditCell(props: GridFormulaEditCellProps) {
  const { originalRenderEditCell, ...params } = props;
  const { id, field, value, colDef } = params;
  const apiRef = useGridPrivateApiContext();
  const rootProps = useGridRootProps();
  const a1NotationEnabled =
    rootProps.formulaA1Notation && !rootProps.disableFormulas && !rootProps.dataSource;
  // A custom editor (column `renderEditCell` or a custom column `type`) owns
  // editing for the column, including `=` formula values — our formula text input
  // never replaces it.
  const isUserCustomEditor = isUserCustomEditCellRenderer(originalRenderEditCell);

  const rawValue = apiRef.current.getRow(id)?.[field];
  const rawIsFormula = isFormulaEditValue(rawValue);
  // Decided once so the input does not swap (and drop focus) mid-edit.
  // Typing `=` on a plain cell also gets the formula text input — the default
  // editor of a number column could not even hold the character.
  const [showFormulaInput] = React.useState(() => {
    if (rawIsFormula || isFormulaEditValue(value)) {
      return true;
    }
    const startInfo = apiRef.current.caches.formula.lastCellEditStart;
    return (
      startInfo !== null &&
      startInfo.id === id &&
      startInfo.field === field &&
      startInfo.startedWithEquals
    );
  });

  const seededRef = React.useRef(false);
  useEnhancedEffect(() => {
    if (seededRef.current) {
      return;
    }
    seededRef.current = true;

    const cache = apiRef.current.caches.formula;
    const startInfo = cache.lastCellEditStart;
    const isOwnStart = startInfo !== null && startInfo.id === id && startInfo.field === field;
    if (isOwnStart) {
      // Always consume the record so it cannot go stale and affect a later
      // programmatic edit of the same cell.
      cache.lastCellEditStart = null;
    }
    if (!rawIsFormula) {
      return;
    }
    if (isOwnStart) {
      if (startInfo.replaceValue) {
        // The edit started by typing/deleting/pasting — the value was
        // intentionally replaced.
        return;
      }
    } else {
      // Programmatic edit start (no `cellEditStart` event): only re-seed when
      // the edit state still holds the seeded evaluated result.
      const result = gridCellFormulaResultSelector(apiRef, { id, field });
      let evaluated: unknown;
      if (result !== null) {
        evaluated = result.type === 'error' ? result.code : result.value;
      }
      if (!areSeededValuesEqual(value, evaluated)) {
        return;
      }
    }
    // A1 mode: seed the editor with the A1 rendering of the canonical source and
    // record it so an unchanged commit restores the canonical (no re-freeze).
    // Escaped literals (`'=…`) are never transformed. A custom editor is seeded
    // the canonical source instead: A1 is our editor's display convention, and
    // the wrapped `valueSetter`'s A1→canonical step is a no-op on canonical text,
    // so a custom editor that commits the seeded value round-trips losslessly.
    let seededValue = rawValue;
    if (a1NotationEnabled && isFormulaSource(rawValue) && !isUserCustomEditor) {
      const display = convertCanonicalToA1Display(rawValue, apiRef);
      cache.lastA1Seed = { id, field, display, canonical: rawValue };
      seededValue = display;
    }
    apiRef.current.setEditCellValue({
      id,
      field,
      value: seededValue,
      unstable_skipValueParser: true,
    });
  });

  // Turn on reference highlighting whenever our formula input renders. Set here
  // (not on the editor's own mount) and cleared on `cellEditStop`, so the in-grid
  // overlay survives the editing cell being virtualized out. Custom editors and
  // plain-cell edits never reach this branch, so they get no highlighting.
  const highlightActive = showFormulaInput && !isUserCustomEditor;
  useEnhancedEffect(() => {
    if (highlightActive) {
      apiRef.current.setFormulaActiveEdit({ id, field });
    }
    // Intentionally no cleanup: only `cellEditStop` clears the signal.
  }, [apiRef, highlightActive, id, field]);

  // A custom editor wins for every value, formulas included (the effect above
  // seeded the canonical source into edit state, so it edits the formula, not
  // its evaluated result). This is also the highlighting gate: highlighting is
  // intrinsic to our formula input below, so a custom editor gets none.
  if (isUserCustomEditor) {
    return originalRenderEditCell!(params);
  }

  if (!showFormulaInput && originalRenderEditCell) {
    return originalRenderEditCell(params);
  }

  // The suggestion dropdown is on by default; the opt-out (and `dataSource`)
  // falls back to the plain text input. The fallback commits without a debounce
  // so the colored backdrop, which reads the edit state, never lags the typed text.
  const autocompleteEnabled =
    !rootProps.disableFormulaAutocomplete && !rootProps.disableFormulas && !rootProps.dataSource;
  const editor = autocompleteEnabled ? (
    <GridFormulaAutocomplete {...params} />
  ) : (
    <GridEditInputCell {...params} colDef={{ ...colDef, type: 'string' }} debounceMs={0} />
  );

  return (
    <GridFormulaReferenceBackdrop ownerCell={{ id, field }} a1Notation={Boolean(a1NotationEnabled)}>
      {editor}
    </GridFormulaReferenceBackdrop>
  );
}

export { GridFormulaEditCell };

export const renderFormulaEditCell = (params: GridFormulaEditCellProps) => (
  <GridFormulaEditCell {...params} />
);
