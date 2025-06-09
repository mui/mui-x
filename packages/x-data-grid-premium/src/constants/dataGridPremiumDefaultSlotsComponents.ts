import { DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS } from '@mui/x-data-grid-pro/internals';
import type { GridPremiumSlotsComponent } from '../models';
import { GridPremiumColumnMenu } from '../components/GridPremiumColumnMenu';
import materialSlots from '../material';
import { GridBottomContainer } from '../components/GridBottomContainer';
import { GridEmptyPivotOverlay } from '../components/GridEmptyPivotOverlay';
import { GridPremiumToolbar } from '../components/GridPremiumToolbar';

export const DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS: GridPremiumSlotsComponent = {
  ...DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS,
  ...materialSlots,
  aiAssistantPanel: null,
  columnMenu: GridPremiumColumnMenu,
  bottomContainer: GridBottomContainer,
  emptyPivotOverlay: GridEmptyPivotOverlay,
  toolbar: GridPremiumToolbar,
};
