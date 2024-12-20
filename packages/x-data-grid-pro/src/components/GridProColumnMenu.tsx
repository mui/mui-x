import * as React from 'react';
import {
  GridGenericColumnMenu,
  GridColumnMenuProps,
  GRID_COLUMN_MENU_SLOTS,
  GRID_COLUMN_MENU_SLOT_PROPS,
} from '@mui/x-data-grid';
import { forwardRefShim } from '@mui/x-internals/forwardRefShim';
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

export const GridProColumnMenu = forwardRefShim<HTMLUListElement, GridColumnMenuProps>(
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
);
