'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { GridGenericColumnMenu, GRID_COLUMN_MENU_SLOTS, GRID_COLUMN_MENU_SLOT_PROPS, } from '@mui/x-data-grid';
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
export const GridProColumnMenu = forwardRef(function GridProColumnMenu(props, ref) {
    return (_jsx(GridGenericColumnMenu, { ...props, defaultSlots: GRID_COLUMN_MENU_SLOTS_PRO, defaultSlotProps: GRID_COLUMN_MENU_SLOT_PROPS_PRO, ref: ref }));
});
GridProColumnMenu.defaultSlots = GRID_COLUMN_MENU_SLOTS_PRO;
GridProColumnMenu.defaultSlotProps = GRID_COLUMN_MENU_SLOT_PROPS_PRO;
