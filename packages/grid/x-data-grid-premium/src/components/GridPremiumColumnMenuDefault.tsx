import * as React from 'react';
import PropTypes from 'prop-types';
import {
  GridColumnMenuDefault,
  GridColumnMenuProps,
  COLUMN_MENU_DEFAULT_SLOTS,
  COLUMN_MENU_DEFAULT_SLOTS_PROPS,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid-pro';
import { GridColumnMenuAggregationItem } from './GridColumnMenuAggregationItem';
import { isGroupingColumn } from '../hooks/features/rowGrouping';
import { GridColumnMenuRowGroupItem } from './GridColumnMenuRowGroupItem';
import { GridColumnMenuRowUngroupItem } from './GridColumnMenuRowUngroupItem';

const GroupingItem = (props: GridColumnMenuItemProps) => {
  const { column } = props;
  if (isGroupingColumn(column.field)) {
    return <GridColumnMenuRowGroupItem {...props} />;
  }
  if (column.groupable) {
    return <GridColumnMenuRowUngroupItem {...props} />;
  }
  return null;
};

export const COLUMN_MENU_DEFAULT_SLOTS_PREMIUM = {
  ...COLUMN_MENU_DEFAULT_SLOTS,
  ColumnMenuAggregationItem: GridColumnMenuAggregationItem,
  ColumnMenuGroupingItem: GroupingItem,
};

export const COLUMN_MENU_DEFAULT_SLOTS_PROPS_PREMIUM = {
  ...COLUMN_MENU_DEFAULT_SLOTS_PROPS,
  ColumnMenuAggregationItem: { displayOrder: 17 },
  ColumnMenuGroupingItem: { displayOrder: 13 },
};

const GridPremiumColumnMenuDefault = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridPremiumColumnMenuDefault(props, ref) {
    return (
      <GridColumnMenuDefault
        ref={ref}
        {...props}
        defaultSlots={COLUMN_MENU_DEFAULT_SLOTS_PREMIUM}
        defaultSlotsProps={COLUMN_MENU_DEFAULT_SLOTS_PROPS_PREMIUM}
      />
    );
  },
);

GridPremiumColumnMenuDefault.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
} as any;

export { GridPremiumColumnMenuDefault };
