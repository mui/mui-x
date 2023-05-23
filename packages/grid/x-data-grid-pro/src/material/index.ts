import type { GridProIconSlotsComponent } from '../models';
import { GridPushPinRightIcon, GridPushPinLeftIcon, GridHighlightOffIcon } from './icons';

const iconSlots: GridProIconSlotsComponent = {
  ColumnMenuPinRightIcon: GridPushPinRightIcon,
  ColumnMenuPinLeftIcon: GridPushPinLeftIcon,
  HeaderFilterClearIcon: GridHighlightOffIcon,
};

const materialSlots = {
  ...iconSlots,
};

export default materialSlots;
