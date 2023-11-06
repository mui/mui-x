import type { GridProIconSlotsComponent } from '../models';
import { GridPushPinRightIcon, GridPushPinLeftIcon } from './icons';

const iconSlots: GridProIconSlotsComponent = {
  columnMenuPinRightIcon: GridPushPinRightIcon,
  columnMenuPinLeftIcon: GridPushPinLeftIcon,
};

const materialSlots = {
  ...iconSlots,
};

export default materialSlots;
