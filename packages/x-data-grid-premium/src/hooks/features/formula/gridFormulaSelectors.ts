import { createSelector, createRootSelector } from '@mui/x-data-grid-pro/internals';
import type { GridRowId } from '@mui/x-data-grid-pro';
import type { GridStatePremium } from '../../../models/gridStatePremium';
import type { GridFormulaResult } from './gridFormulaInterfaces';

export const gridFormulaStateSelector = createRootSelector(
  (state: GridStatePremium) => state.formula,
);

/**
 * Get the evaluated formula results as a lookup, keyed by row id and field.
 * @category Formulas
 */
export const gridFormulaLookupSelector = createSelector(
  gridFormulaStateSelector,
  (formulaState) => formulaState.lookup,
);

/**
 * Get the cell whose formula references are currently highlighted, or `null`.
 */
export const gridFormulaActiveEditSelector = createSelector(
  gridFormulaStateSelector,
  (formulaState) => formulaState.activeEdit,
);

/**
 * Get the evaluated result of one formula cell, or `null` when the cell does
 * not hold a formula. Presence in the lookup is the masking criterion — a
 * formula evaluating to `null` still returns a result entry.
 * @category Formulas
 */
export const gridCellFormulaResultSelector = createSelector(
  gridFormulaLookupSelector,
  (formulaLookup, { id, field }: { id: GridRowId; field: string }): GridFormulaResult | null =>
    formulaLookup[id]?.[field] ?? null,
);
