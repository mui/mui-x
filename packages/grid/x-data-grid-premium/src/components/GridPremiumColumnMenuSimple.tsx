import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import {
  GridGenericColumnMenuSimple,
  GridColumnMenuProps,
  GRID_COLUMN_MENU_SIMPLE_COMPONENTS,
  GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PROPS,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid-pro';
import { GridColumnMenuAggregationItemSimple } from './GridColumnMenuAggregationItem';
import { isGroupingColumn } from '../hooks/features/rowGrouping';
import { GridColumnMenuRowGroupItemSimple } from './GridColumnMenuRowGroupItemSimple';
import { GridColumnMenuRowUngroupItemSimple } from './GridColumnMenuRowUngroupItemSimple';

function GroupingItem(props: GridColumnMenuItemProps) {
  const { colDef } = props;
  if (isGroupingColumn(colDef.field)) {
    return (
      <React.Fragment>
        <Divider />
        <GridColumnMenuRowGroupItemSimple {...props} />
      </React.Fragment>
    );
  }
  if (colDef.groupable) {
    return (
      <React.Fragment>
        <Divider />
        <GridColumnMenuRowUngroupItemSimple {...props} />
      </React.Fragment>
    );
  }
  return null;
}

function AggregationItem(props: GridColumnMenuItemProps) {
  return (
    <React.Fragment>
      <Divider />
      <GridColumnMenuAggregationItemSimple {...props} />
    </React.Fragment>
  );
}

export const GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PREMIUM = {
  ...GRID_COLUMN_MENU_SIMPLE_COMPONENTS,
  ColumnMenuAggregationItem: AggregationItem,
  ColumnMenuGroupingItem: GroupingItem,
};

export const GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PROPS_PREMIUM = {
  ...GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PROPS,
  columnMenuAggregationItem: { displayOrder: 37 },
  columnMenuGroupingItem: { displayOrder: 33 },
};

const GridPremiumColumnMenuSimple = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridPremiumColumnMenuSimple(props, ref) {
    return (
      <GridGenericColumnMenuSimple
        ref={ref}
        {...props}
        defaultComponents={GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PREMIUM}
        defaultComponentsProps={GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PROPS_PREMIUM}
      />
    );
  },
);

GridPremiumColumnMenuSimple.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
} as any;

export { GridPremiumColumnMenuSimple };
