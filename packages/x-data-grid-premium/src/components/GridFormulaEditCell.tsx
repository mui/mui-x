'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { GridEditInputCell } from '@mui/x-data-grid-pro';
import type { GridColDef, GridRenderEditCellParams } from '@mui/x-data-grid-pro';
import { useGridPrivateApiContext } from '../hooks/utils/useGridPrivateApiContext';
import { isEscapedFormulaSource, isFormulaSource } from '../hooks/features/formula/engine';
import { gridCellFormulaResultSelector } from '../hooks/features/formula/gridFormulaSelectors';

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
    apiRef.current.setEditCellValue({ id, field, value: rawValue, unstable_skipValueParser: true });
  });

  if (!showFormulaInput && originalRenderEditCell) {
    return originalRenderEditCell(params);
  }

  return <GridEditInputCell {...params} colDef={{ ...colDef, type: 'string' }} />;
}

export { GridFormulaEditCell };

export const renderFormulaEditCell = (params: GridFormulaEditCellProps) => (
  <GridFormulaEditCell {...params} />
);
