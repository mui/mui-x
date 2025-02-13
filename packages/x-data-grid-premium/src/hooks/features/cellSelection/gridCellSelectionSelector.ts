import { createRootSelector } from '@mui/x-data-grid-pro/internals';
import { GridStatePremium } from '../../../models/gridStatePremium';

export const gridCellSelectionStateSelector = createRootSelector(
  (state: GridStatePremium) => state.cellSelection,
);
