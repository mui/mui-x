'use client';
import {
  GridGenericColumnMenu,
  type GridColumnMenuProps,
  GRID_COLUMN_MENU_SLOTS,
  GRID_COLUMN_MENU_SLOT_PROPS,
} from '@mui/x-data-grid';
import type { GridColumnMenuComponent } from '@mui/x-data-grid/internals';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridColumnMenuPinningItem } from './GridColumnMenuPinningItem';

export const GRID_COLUMN_MENU_SLOTS_PRO = {
  ...GRID_COLUMN_MENU_SLOTS,
  columnMenuPinningItem: GridColumnMenuPinningItem,
};

export const GRID_COLUMN_MENU_SLOT_PROPS_PRO = {
  ...GRID_COLUMN_MENU_SLOT_PROPS,
  columnMenuPinningItem: {
    displayOrder: 15,
  },
};

export const GridProColumnMenu = forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridProColumnMenu(props, ref) {
    return (
      <GridGenericColumnMenu
        {...props}
        defaultSlots={GRID_COLUMN_MENU_SLOTS_PRO}
        defaultSlotProps={GRID_COLUMN_MENU_SLOT_PROPS_PRO}
        ref={ref}
      />
    );
  },
) as GridColumnMenuComponent;

GridProColumnMenu.defaultSlots = GRID_COLUMN_MENU_SLOTS_PRO;
GridProColumnMenu.defaultSlotProps = GRID_COLUMN_MENU_SLOT_PROPS_PRO;
