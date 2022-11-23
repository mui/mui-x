import * as React from 'react';
import PropTypes from 'prop-types';
import {
  GridColumnMenuDefault,
  GridColumnMenuProps,
  gridColumnMenuSlots,
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
  ...gridColumnMenuSlots,
  ColumnMenuAggregationItem: { component: GridColumnMenuAggregationItem, displayOrder: 17 },
  ColumnMenuGroupingItem: { component: GroupingItem, displayOrder: 13 },
};

const GridPremiumColumnMenuDefault = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridPremiumColumnMenuDefault(props, ref) {
    return (
      <GridColumnMenuDefault
        ref={ref}
        slots={props.slots || gridPremiumColumnMenuSlots}
        {...props}
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
