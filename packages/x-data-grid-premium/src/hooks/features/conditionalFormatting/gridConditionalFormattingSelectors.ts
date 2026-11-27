import { createRootSelector, createSelector } from '@mui/x-data-grid-pro/internals';
import type { GridStatePremium } from '../../../models/gridStatePremium';

/**
 * Get the conditional formatting state.
 * @category Conditional formatting
 */
export const gridConditionalFormattingStateSelector = createRootSelector(
  (state: GridStatePremium) => state.conditionalFormatting,
);

/**
 * Get the conditional formatting rules.
 * @category Conditional formatting
 */
export const gridConditionalFormattingSelector = createSelector(
  gridConditionalFormattingStateSelector,
  (conditionalFormattingState) => conditionalFormattingState.model,
);
