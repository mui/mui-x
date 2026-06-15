'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { GridEditInputCell } from '@mui/x-data-grid-pro';
import type { GridColDef, GridRenderEditCellParams } from '@mui/x-data-grid-pro';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { useGridRootProps } from '../hooks/utils/useGridRootProps';
import { isEscapedFormulaSource, isFormulaSource } from '../hooks/features/formula/engine';
import { gridCellFormulaResultSelector } from '../hooks/features/formula/gridFormulaSelectors';
import { convertCanonicalToA1Display } from '../hooks/features/formula/gridFormulaA1Transforms';
import { GridFormulaAutocomplete } from './GridFormulaAutocomplete';

export interface GridFormulaEditCellProps extends GridRenderEditCellParams {
  /**
   * The edit component the column would render without formula support.
   */
  originalRenderEditCell?: GridColDef['renderEditCell'];
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
    // Escaped literals (`'=…`) are never transformed.
    let seededValue = rawValue;
    if (a1NotationEnabled && isFormulaSource(rawValue)) {
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

  if (!showFormulaInput && originalRenderEditCell) {
    return originalRenderEditCell(params);
  }

  // The suggestion dropdown is on by default; the opt-out (and `dataSource`)
  // falls back to the plain text input.
  const autocompleteEnabled =
    !rootProps.disableFormulaAutocomplete && !rootProps.disableFormulas && !rootProps.dataSource;
  if (autocompleteEnabled) {
    return <GridFormulaAutocomplete {...params} />;
  }

  return <GridEditInputCell {...params} colDef={{ ...colDef, type: 'string' }} />;
}

export { GridFormulaEditCell };

export const renderFormulaEditCell = (params: GridFormulaEditCellProps) => (
  <GridFormulaEditCell {...params} />
);
