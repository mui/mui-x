import type { GridProIconSlotsComponent } from '../models';
import { GridPushPinRightIcon, GridPushPinLeftIcon } from './icons';

const iconSlots: GridProIconSlotsComponent = {
  columnMenuPinRightIcon: GridPushPinRightIcon,
  columnMenuPinLeftIcon: GridPushPinLeftIcon,
  columnMenuPinIcon: GridPushPinLeftIcon, // Default to pin left icon, toggles based on state
};

const materialSlots = {
  ...iconSlots,
};

export default materialSlots;
