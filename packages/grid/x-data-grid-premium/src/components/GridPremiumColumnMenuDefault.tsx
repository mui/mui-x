import * as React from 'react';
import PropTypes from 'prop-types';
import {
  GridGenericColumnMenuDefault,
  GridColumnMenuProps,
  GRID_COLUMN_MENU_DEFAULT_COMPONENTS,
  GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PROPS,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid-pro';
import { GridColumnMenuAggregationItem } from './GridColumnMenuAggregationItem';
import { isGroupingColumn } from '../hooks/features/rowGrouping';
import { GridColumnMenuRowGroupItem } from './GridColumnMenuRowGroupItem';
import { GridColumnMenuRowUngroupItem } from './GridColumnMenuRowUngroupItem';

function GroupingItem(props: GridColumnMenuItemProps) {
  const { colDef } = props;
  if (isGroupingColumn(colDef.field)) {
    return <GridColumnMenuRowGroupItem {...props} />;
  }
  if (colDef.groupable) {
    return <GridColumnMenuRowUngroupItem {...props} />;
  }
  return null;
}

export const GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PREMIUM = {
  ...GRID_COLUMN_MENU_DEFAULT_COMPONENTS,
  ColumnMenuAggregationItem: GridColumnMenuAggregationItem,
  ColumnMenuGroupingItem: GroupingItem,
};

export const GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PROPS_PREMIUM = {
  ...GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PROPS,
  columnMenuAggregationItem: { displayOrder: 17 },
  columnMenuGroupingItem: { displayOrder: 13 },
};

const GridPremiumColumnMenuDefault = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridPremiumColumnMenuDefault(props, ref) {
    return (
      <GridGenericColumnMenuDefault
        ref={ref}
        {...props}
        defaultComponents={GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PREMIUM}
        defaultComponentsProps={GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PROPS_PREMIUM}
      />
    );
  },
);

GridPremiumColumnMenuDefault.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
} as any;

export { GridPremiumColumnMenuDefault };
