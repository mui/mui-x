import type { GridProIconSlotsComponent } from '../models';
import { GridPushPinRightIcon, GridPushPinLeftIcon } from './icons';
import { GridProColumnMenu } from '../components/GridProColumnMenu';

const iconSlots: GridProIconSlotsComponent = {
  ColumnMenuPinRightIcon: GridPushPinRightIcon,
  ColumnMenuPinLeftIcon: GridPushPinLeftIcon,
};

const materialSlots = {
  ...iconSlots,
  ColumnMenu: GridProColumnMenu,
};

export default materialSlots;
