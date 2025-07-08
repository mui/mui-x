import { createRootSelector } from '@mui/x-data-grid-pro/internals';
import { GridStatePremium } from '../../../models/gridStatePremium';

export const gridSidebarStateSelector = createRootSelector(
  (state: GridStatePremium) => state.sidebar,
);
