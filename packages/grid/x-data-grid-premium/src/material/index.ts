import { GridPremiumColumnMenu } from '../components/GridPremiumColumnMenu';
import type { GridPremiumIconSlotsComponent } from '../models';
import { GridWorkspacesIcon, GridGroupWorkIcon, GridFunctionsIcon } from './icons';

const iconsSlots: GridPremiumIconSlotsComponent = {
  ColumnMenuUngroupIcon: GridWorkspacesIcon,
  ColumnMenuGroupIcon: GridGroupWorkIcon,
  ColumnMenuAggregationIcon: GridFunctionsIcon,
};

const materialSlots = {
  ...iconsSlots,
  ColumnMenu: GridPremiumColumnMenu,
};

export default materialSlots;
