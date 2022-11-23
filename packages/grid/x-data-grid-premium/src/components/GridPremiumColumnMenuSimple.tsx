import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import {
  GridColumnMenuSimple,
  GridColumnMenuProps,
  COLUMN_MENU_SIMPLE_SLOTS,
  COLUMN_MENU_SIMPLE_SLOTS_PROPS,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid-pro';
import { GridColumnMenuAggregationItemSimple } from './GridColumnMenuAggregationItem';
import { isGroupingColumn } from '../hooks/features/rowGrouping';
import { GridColumnMenuRowGroupItemSimple } from './GridColumnMenuRowGroupItemSimple';
import { GridColumnMenuRowUngroupItemSimple } from './GridColumnMenuRowUngroupItemSimple';

const GroupingItem = (props: GridColumnMenuItemProps) => {
  const { column } = props;
  if (isGroupingColumn(column.field)) {
    return (
      <React.Fragment>
        <Divider />
        <GridColumnMenuRowGroupItemSimple {...props} />
      </React.Fragment>
    );
  }
  if (column.groupable) {
    return (
      <React.Fragment>
        <Divider />
        <GridColumnMenuRowUngroupItemSimple {...props} />
      </React.Fragment>
    );
  }
  return null;
};

const AggregationItem = (props: GridColumnMenuItemProps) => {
  return (
    <React.Fragment>
      <Divider />
      <GridColumnMenuAggregationItemSimple {...props} />
    </React.Fragment>
  );
};

export const COLUMN_MENU_SIMPLE_SLOTS_PREMIUM = {
  ...COLUMN_MENU_SIMPLE_SLOTS,
  ColumnMenuAggregationItem: AggregationItem,
  ColumnMenuGroupingItem: GroupingItem,
};

export const COLUMN_MENU_SIMPLE_SLOTS_PROPS_PREMIUM = {
  ...COLUMN_MENU_SIMPLE_SLOTS_PROPS,
  ColumnMenuAggregationItem: { displayOrder: 37 },
  ColumnMenuGroupingItem: { displayOrder: 33 },
};

const GridPremiumColumnMenuSimple = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridPremiumColumnMenuSimple(props, ref) {
    return (
      <GridColumnMenuSimple
        ref={ref}
        {...props}
        defaultSlots={COLUMN_MENU_SIMPLE_SLOTS_PREMIUM}
        defaultSlotsProps={COLUMN_MENU_SIMPLE_SLOTS_PROPS_PREMIUM}
      />
    );
  },
);

GridPremiumColumnMenuSimple.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
} as any;

export { GridPremiumColumnMenuSimple };
