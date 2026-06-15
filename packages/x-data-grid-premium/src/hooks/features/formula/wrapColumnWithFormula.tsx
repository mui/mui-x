import * as React from 'react';
import type { RefObject } from '@mui/x-internals/types';
import { gridRowIdSelector } from '@mui/x-data-grid-pro';
import type { GridColDef, GridRowId, GridValidRowModel } from '@mui/x-data-grid-pro';
import { getRowValue as getRowValueUtil } from '@mui/x-data-grid-pro/internals';
import type { GridBaseColDef } from '@mui/x-data-grid-pro/internals';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { GridFormulaEditCell } from '../../../components/GridFormulaEditCell';
import { isEscapedFormulaSource, isFormulaSource, unescapeLiteralSource } from './engine';
import { gridCellFormulaResultSelector } from './gridFormulaSelectors';
import { convertA1ToCanonicalCommit, convertA1ToCanonicalPaste } from './gridFormulaA1Transforms';

// Deliberately disjoint from the properties the aggregation wrapper touches
// (`renderCell`/`renderHeader`): two features stacking wrappers on the same
// property cannot unwrap cleanly (the identity check skips a wrapper that has
// another one on top, accumulating layers on every `hydrateColumns` pass).
type WrappableColumnProperty =
  | 'renderEditCell'
  | 'valueParser'
  | 'valueSetter'
  | 'preProcessEditCellProps'
  | 'pastedValueParser'
  | 'rowSpanValueGetter';

interface GridColDefWithFormulaWrappers extends GridBaseColDef {
  formulaWrappedProperties: {
    name: WrappableColumnProperty;
    originalValue: GridBaseColDef[WrappableColumnProperty];
    wrappedValue: GridBaseColDef[WrappableColumnProperty];
  }[];
}

function isFormulaEditValue(value: unknown): boolean {
  return isFormulaSource(value) || isEscapedFormulaSource(value);
}

function areCommittedValuesEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
}

/**
 * Wraps the editing-related properties of an `allowFormulas` column so that
 * formula sources survive the edit pipeline (D12): the editor seeds and
 * commits sources, parsers pass `=` strings through, and the value setter
 * protects formulas from being overwritten by their own evaluated value.
 */
export const wrapColumnWithFormula = (
  column: GridBaseColDef,
  apiRef: RefObject<GridPrivateApiPremium>,
  a1NotationEnabled: boolean,
): GridBaseColDef => {
  const getFormulaResult = (id: GridRowId) =>
    gridCellFormulaResultSelector(apiRef, { id, field: column.field });

  const wrappedColumn: GridColDefWithFormulaWrappers = {
    ...column,
    formulaWrappedProperties: [],
  };
  const trackWrappedProperty = <P extends WrappableColumnProperty>(
    name: P,
    originalValue: GridBaseColDef[P],
    wrappedValue: GridBaseColDef[P],
  ) => {
    wrappedColumn[name] = wrappedValue as any;
    wrappedColumn.formulaWrappedProperties.push({ name, originalValue, wrappedValue });
  };

  const originalRenderEditCell = column.renderEditCell;
  const wrappedRenderEditCell: GridBaseColDef['renderEditCell'] = (params) => (
    <GridFormulaEditCell {...params} originalRenderEditCell={originalRenderEditCell} />
  );
  trackWrappedProperty('renderEditCell', originalRenderEditCell, wrappedRenderEditCell);

  const originalValueParser = column.valueParser;
  const wrappedValueParser: GridBaseColDef['valueParser'] = (value, row, colDef, parserApiRef) => {
    if (isFormulaEditValue(value)) {
      // Pass formula sources through untouched — including A1 text. A1→canonical
      // freezing happens at commit in `valueSetter`, NOT here: `GridEditInputCell`
      // runs `valueParser` on every keystroke and shows its result to the user, so
      // converting here would surface canonical `REF(...)` text mid-edit.
      return value;
    }
    return originalValueParser ? originalValueParser(value, row, colDef, parserApiRef) : value;
  };
  trackWrappedProperty('valueParser', originalValueParser, wrappedValueParser);

  const originalValueSetter = column.valueSetter;
  const wrappedValueSetter: GridBaseColDef['valueSetter'] = (value, row, colDef, setterApiRef) => {
    const stored = (row as GridValidRowModel)[colDef.field];
    // An escaped literal displays its unescaped form — committing that display
    // value back (e.g. row edit mode) must keep the stored escape.
    if (isEscapedFormulaSource(stored) && value === unescapeLiteralSource(stored)) {
      return row;
    }
    if (isFormulaEditValue(value)) {
      // A1 mode: the editor holds and commits A1 text (`valueParser` passes it
      // through so the user keeps seeing A1, not canonical, while typing). Freeze
      // to canonical here — `valueSetter` is the real commit hook
      // (`getRowWithUpdatedValuesFromCellEditing` calls only the setter, never the
      // parser). `convertA1ToCanonicalCommit` restores the stored canonical on an
      // unchanged commit (the seed still matches) and re-freezes an edited formula
      // otherwise. Escaped literals (`'=…`) are never transformed.
      if (a1NotationEnabled && isFormulaSource(value)) {
        return { ...row, [colDef.field]: convertA1ToCanonicalCommit(value, row, colDef, apiRef) };
      }
      return { ...row, [colDef.field]: value };
    }
    if (isFormulaSource(stored)) {
      const result = getFormulaResult(gridRowIdSelector(apiRef, row));
      if (result !== null) {
        const evaluated = result.type === 'error' ? result.code : result.value;
        if (areCommittedValuesEqual(value, evaluated)) {
          // Data-loss protection: committing the evaluated value over its own
          // formula (edit paths that bypass the formula editor, e.g. row edit
          // mode) keeps the formula source.
          return row;
        }
      }
    }
    return originalValueSetter
      ? originalValueSetter(value, row, colDef, setterApiRef)
      : { ...row, [colDef.field]: value };
  };
  trackWrappedProperty('valueSetter', originalValueSetter, wrappedValueSetter);

  // Only wrapped when the column defines its own processor: adding one
  // unconditionally would put an async `isProcessingProps` gate on every
  // commit, blocking Enter right after a keystroke.
  const originalPreProcessEditCellProps = column.preProcessEditCellProps;
  if (originalPreProcessEditCellProps) {
    const wrappedPreProcessEditCellProps: GridBaseColDef['preProcessEditCellProps'] = (params) => {
      if (isFormulaEditValue(params.props.value)) {
        // Permissive commit: formula syntax issues never block the edit.
        return { ...params.props, error: false };
      }
      return originalPreProcessEditCellProps(params);
    };
    trackWrappedProperty(
      'preProcessEditCellProps',
      originalPreProcessEditCellProps,
      wrappedPreProcessEditCellProps,
    );
  }

  // Row spanning compares `rowSpanValueGetter` outputs — formula cells must
  // compare by evaluated value, not by raw source.
  const originalRowSpanValueGetter = column.rowSpanValueGetter;
  const wrappedRowSpanValueGetter: GridBaseColDef['rowSpanValueGetter'] = (
    value,
    row,
    colDef,
    getterApiRef,
  ) => {
    const result = getFormulaResult(gridRowIdSelector(apiRef, row));
    if (result !== null) {
      return result.type === 'error' ? result.code : (result.value as any);
    }
    if (originalRowSpanValueGetter) {
      return originalRowSpanValueGetter(value, row, colDef, getterApiRef);
    }
    // Replicate the row spanning fallback chain — defining a
    // `rowSpanValueGetter` would otherwise bypass `valueGetter`.
    return getRowValueUtil(row, colDef, apiRef) as any;
  };
  trackWrappedProperty('rowSpanValueGetter', originalRowSpanValueGetter, wrappedRowSpanValueGetter);

  const originalPastedValueParser = column.pastedValueParser;
  const wrappedPastedValueParser: GridBaseColDef['pastedValueParser'] = (
    value,
    row,
    colDef,
    parserApiRef,
  ) => {
    if (isFormulaEditValue(value)) {
      // A1 mode: a pasted formula is frozen to canonical with the Excel fill
      // offset. Canonical text pasted from an in-grid copy passes through.
      if (a1NotationEnabled && isFormulaSource(value) && row !== undefined) {
        return convertA1ToCanonicalPaste(value, row, colDef, apiRef);
      }
      return value;
    }
    if (originalPastedValueParser) {
      return originalPastedValueParser(value, row, colDef, parserApiRef);
    }
    // Replicate the clipboard fallback chain — defining `pastedValueParser`
    // would otherwise bypass `valueParser`.
    return colDef.valueParser ? colDef.valueParser(value, row, colDef, parserApiRef) : value;
  };
  trackWrappedProperty('pastedValueParser', originalPastedValueParser, wrappedPastedValueParser);

  return wrappedColumn;
};

const isColumnWrappedWithFormula = (column: GridColDef): column is GridColDefWithFormulaWrappers =>
  typeof (column as GridColDefWithFormulaWrappers).formulaWrappedProperties !== 'undefined';

/**
 * Remove the formula wrappers around the wrappable properties of the column.
 */
export const unwrapColumnFromFormula = (column: GridColDef) => {
  if (!isColumnWrappedWithFormula(column)) {
    return column;
  }
  const { formulaWrappedProperties, ...unwrappedColumn } = column as GridColDefWithFormulaWrappers;

  formulaWrappedProperties.forEach(({ name, originalValue, wrappedValue }) => {
    // The value changed since we wrapped it
    if (wrappedValue !== unwrappedColumn[name]) {
      return;
    }
    unwrappedColumn[name] = originalValue as any;
  });

  return unwrappedColumn;
};
