'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { GridGenericColumnMenu, GRID_COLUMN_MENU_SLOTS, GRID_COLUMN_MENU_SLOT_PROPS, } from '@mui/x-data-grid-pro';
import { forwardRef } from '@mui/x-internals/forwardRef';
import { GridColumnMenuAggregationItem } from './columnMenu/menuItems/GridColumnMenuAggregationItem';
import { isGroupingColumn } from '../hooks/features/rowGrouping';
import { GridColumnMenuRowGroupItem } from './columnMenu/menuItems/GridColumnMenuRowGroupItem';
import { GridColumnMenuRowUngroupItem } from './columnMenu/menuItems/GridColumnMenuRowUngroupItem';
import { GridColumnMenuManagePanelItem } from './columnMenu/menuItems/GridColumnMenuManagePanelItem';
export function GridColumnMenuGroupingItem(props) {
    const { colDef } = props;
    if (isGroupingColumn(colDef.field)) {
        return _jsx(GridColumnMenuRowGroupItem, { ...props });
    }
    return _jsx(GridColumnMenuRowUngroupItem, { ...props });
}
export const GRID_COLUMN_MENU_SLOTS_PREMIUM = {
    ...GRID_COLUMN_MENU_SLOTS,
    columnMenuAggregationItem: GridColumnMenuAggregationItem,
    columnMenuGroupingItem: GridColumnMenuGroupingItem,
    columnMenuManagePanelItem: GridColumnMenuManagePanelItem,
};
export const GRID_COLUMN_MENU_SLOT_PROPS_PREMIUM = {
    ...GRID_COLUMN_MENU_SLOT_PROPS,
    columnMenuAggregationItem: { displayOrder: 23 },
    columnMenuGroupingItem: { displayOrder: 27 },
    columnMenuManagePanelItem: { displayOrder: 28 },
};
export const GridPremiumColumnMenu = forwardRef(function GridPremiumColumnMenuSimple(props, ref) {
    return (_jsx(GridGenericColumnMenu, { ...props, defaultSlots: GRID_COLUMN_MENU_SLOTS_PREMIUM, defaultSlotProps: GRID_COLUMN_MENU_SLOT_PROPS_PREMIUM, ref: ref }));
});
GridPremiumColumnMenu.defaultSlots = GRID_COLUMN_MENU_SLOTS_PREMIUM;
GridPremiumColumnMenu.defaultSlotProps = GRID_COLUMN_MENU_SLOT_PROPS_PREMIUM;
