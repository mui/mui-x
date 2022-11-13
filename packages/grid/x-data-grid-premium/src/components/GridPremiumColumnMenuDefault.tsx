import * as React from 'react';
import PropTypes from 'prop-types';
import {
  GridColumnMenuDefaultRoot,
  GridColumnMenuDefaultProps,
  gridProColumnMenuSlots,
  gridProColumnMenuInitItems,
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

export const gridPremiumColumnMenuSlots = {
  ...gridProColumnMenuSlots,
  ColumnMenuAggregationItem: { component: GridColumnMenuAggregationItem, priority: 17 },
  ColumnMenuGroupingItem: { component: GroupingItem, priority: 13 },
};

export const gridPremiumColumnMenuInitItems = [...gridProColumnMenuInitItems];

const GridPremiumColumnMenuDefault = React.forwardRef<HTMLDivElement, GridColumnMenuDefaultProps>(
  function GridPremiumColumnMenuDefault(props, ref) {
    return (
      <GridColumnMenuDefaultRoot
        ref={ref}
        {...props}
        slots={gridPremiumColumnMenuSlots}
        initialItems={gridPremiumColumnMenuInitItems}
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
