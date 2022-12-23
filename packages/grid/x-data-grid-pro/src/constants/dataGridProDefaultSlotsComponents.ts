import { DATA_GRID_DEFAULT_SLOTS_COMPONENTS } from '@mui/x-data-grid/internals';
import { GridProSlotsComponent, GridProIconSlotsComponent } from '../models';
import { GridPushPinRightIcon, GridPushPinLeftIcon } from '../components';
import { GridProColumnMenu } from '../components/GridProColumnMenu';

export const DEFAULT_GRID_PRO_ICON_SLOTS_COMPONENTS: GridProIconSlotsComponent = {
  ColumnMenuPinRightIcon: GridPushPinRightIcon,
  ColumnMenuPinLeftIcon: GridPushPinLeftIcon,
};

export const DATA_GRID_PRO_DEFAULT_SLOTS_COMPONENTS: GridProSlotsComponent = {
  ...DATA_GRID_DEFAULT_SLOTS_COMPONENTS,
  ...DEFAULT_GRID_PRO_ICON_SLOTS_COMPONENTS,
  ColumnMenu: GridProColumnMenu,
};
