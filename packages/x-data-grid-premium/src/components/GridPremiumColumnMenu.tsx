import * as React from 'react';
import {
  GridGenericColumnMenu,
  GridColumnMenuProps,
  GRID_COLUMN_MENU_SLOTS,
  GRID_COLUMN_MENU_SLOT_PROPS,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid-pro';
import { GridColumnMenuAggregationItem } from './GridColumnMenuAggregationItem';
import { isGroupingColumn } from '../hooks/features/rowGrouping';
import { GridColumnMenuRowGroupItem } from './GridColumnMenuRowGroupItem';
import { GridColumnMenuRowUngroupItem } from './GridColumnMenuRowUngroupItem';

export function GridColumnMenuGroupingItem(props: GridColumnMenuItemProps) {
  const { colDef } = props;

  if (isGroupingColumn(colDef.field)) {
    return <GridColumnMenuRowGroupItem {...props} />;
  }
  return <GridColumnMenuRowUngroupItem {...props} />;
}

export const GRID_COLUMN_MENU_SLOTS_PREMIUM = {
  ...GRID_COLUMN_MENU_SLOTS,
  columnMenuAggregationItem: GridColumnMenuAggregationItem,
  columnMenuGroupingItem: GridColumnMenuGroupingItem,
};

export const GRID_COLUMN_MENU_SLOT_PROPS_PREMIUM = {
  ...GRID_COLUMN_MENU_SLOT_PROPS,
  columnMenuAggregationItem: { displayOrder: 23 },
  columnMenuGroupingItem: { displayOrder: 27 },
};

export const GridPremiumColumnMenu = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridPremiumColumnMenuSimple(props, ref) {
    return (
      <GridGenericColumnMenu
        ref={ref}
        {...props}
        defaultSlots={GRID_COLUMN_MENU_SLOTS_PREMIUM}
        defaultSlotProps={GRID_COLUMN_MENU_SLOT_PROPS_PREMIUM}
      />
    );
  },
);
