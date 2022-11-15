import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import {
  GridColumnMenuSimpleRoot,
  GridColumnMenuDefaultProps,
  gridProColumnMenuSimpleSlots,
  gridProColumnMenuSimpleInitItems,
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

export const gridPremiumColumnMenuSimpleSlots = {
  ...gridProColumnMenuSimpleSlots,
  ColumnMenuAggregationItem: { component: AggregationItem, priority: 37 },
  ColumnMenuGroupingItem: { component: GroupingItem, priority: 33 },
};

export const gridPremiumColumnMenuSimpleInitItems = [...gridProColumnMenuSimpleInitItems];

const GridPremiumColumnMenuSimple = React.forwardRef<HTMLUListElement, GridColumnMenuDefaultProps>(
  function GridPremiumColumnMenuSimple(props, ref) {
    return (
      <GridColumnMenuSimpleRoot
        ref={ref}
        {...props}
        slots={gridPremiumColumnMenuSimpleSlots}
        initialItems={gridProColumnMenuSimpleInitItems}
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
