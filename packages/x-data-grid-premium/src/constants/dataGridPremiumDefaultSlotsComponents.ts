import { DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS } from '@mui/x-data-grid-pro/internals';
import type { GridPremiumSlotsComponent } from '../models';
import { GridPremiumColumnMenu } from '../components/GridPremiumColumnMenu';
import type { GridPremiumIconSlotsComponent } from '../models';

const placeholder = ((name: string) => () => { throw new Error(`DataGridPremium: base slot "${name}" is undefined.`) }) as any;

const defaultPremiumSlots: GridPremiumIconSlotsComponent = {
  columnMenuUngroupIcon: placeholder('columnMenuUngroupIcon'),
  columnMenuGroupIcon: placeholder('columnMenuGroupIcon'),
  columnMenuAggregationIcon: placeholder('columnMenuAggregationIcon'),
};

export const DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS: GridPremiumSlotsComponent = {
  ...DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS,
  ...defaultPremiumSlots,
  columnMenu: GridPremiumColumnMenu,
};
