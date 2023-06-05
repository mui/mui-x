import type { GridProIconSlotsComponent } from '../models';
import { GridPushPinRightIcon, GridPushPinLeftIcon, GridFilterListIcon } from './icons';

const iconSlots: GridProIconSlotsComponent = {
  ColumnMenuPinRightIcon: GridPushPinRightIcon,
  ColumnMenuPinLeftIcon: GridPushPinLeftIcon,
  HeaderFilterMenuIcon: GridFilterListIcon,
};

const materialSlots = {
  ...iconSlots,
};

export default materialSlots;
