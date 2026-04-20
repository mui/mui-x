import { createRootSelector } from '@mui/x-data-grid-pro/internals';
import type { GridStatePremium } from '../../../models/gridStatePremium';

export const gridCellSelectionStateSelector = createRootSelector(
  (state: GridStatePremium) => state.cellSelection,
);
