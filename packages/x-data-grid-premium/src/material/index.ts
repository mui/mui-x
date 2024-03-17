import type { GridPremiumIconSlotsComponent } from '../models';
import { GridWorkspacesIcon, GridGroupWorkIcon, GridFunctionsIcon } from './icons';

const iconsSlots: GridPremiumIconSlotsComponent = {
  columnMenuUngroupIcon: GridWorkspacesIcon,
  columnMenuGroupIcon: GridGroupWorkIcon,
  columnMenuAggregationIcon: GridFunctionsIcon,
};

const materialSlots = {
  ...iconsSlots,
};

export default materialSlots;
