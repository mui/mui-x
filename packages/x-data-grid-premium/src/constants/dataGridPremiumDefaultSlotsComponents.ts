import {
  DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS,
  generateDefaultSlots,
} from '@mui/x-data-grid-pro/internals';
import type { GridPremiumSlotsComponent } from '../models';
import { GridPremiumColumnMenu } from '../components/GridPremiumColumnMenu';

const iconsSlots: Array<keyof GridPremiumSlotsComponent> = [
  'columnMenuUngroupIcon',
  'columnMenuGroupIcon',
  'columnMenuAggregationIcon',
  'toolbarPromptSendIcon',
  'toolbarPromptRecordIcon',
];

export const DATA_GRID_PREMIUM_DEFAULT_SLOTS_COMPONENTS: GridPremiumSlotsComponent = {
  ...DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS,
  ...generateDefaultSlots<keyof GridPremiumSlotsComponent>(iconsSlots),
  columnMenu: GridPremiumColumnMenu,
};
