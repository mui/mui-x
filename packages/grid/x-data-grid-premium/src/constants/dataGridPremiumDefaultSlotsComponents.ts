import { DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS } from '@mui/x-data-grid-pro';
import { GridPremiumSlotsComponent, GridPremiumIconSlotsComponent } from '../models';
import { GridWorkspacesIcon, GridGroupWorkIcon, GridFunctionsIcon } from '../components';
import { GridPremiumColumnMenu } from '../components/GridPremiumColumnMenu';

export const DEFAULT_GRID_PREMIUM_ICON_SLOTS_COMPONENTS: GridPremiumIconSlotsComponent = {
  ColumnMenuUngroupIcon: GridWorkspacesIcon,
  ColumnMenuGroupIcon: GridGroupWorkIcon,
  ColumnMenuAggregationIcon: GridFunctionsIcon,
};

export const DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS: GridPremiumSlotsComponent = {
  ...DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS,
  ...DEFAULT_GRID_PREMIUM_ICON_SLOTS_COMPONENTS,
  ColumnMenu: GridPremiumColumnMenu,
};
