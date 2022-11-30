import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import {
  GridGenericColumnMenuSimple,
  GridColumnMenuProps,
  GRID_COLUMN_MENU_SIMPLE_COMPONENTS,
  GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PROPS,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid';
import { GridColumnMenuPinningItemSimple } from './GridColumnMenuPinningItemSimple';

function PinningWithDivider(props: GridColumnMenuItemProps) {
  return (
    <React.Fragment>
      <Divider />
      <GridColumnMenuPinningItemSimple {...props} />
    </React.Fragment>
  );
}

export const GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PRO = {
  ...GRID_COLUMN_MENU_SIMPLE_COMPONENTS,
  ColumnMenuPinningItem: PinningWithDivider,
};

export const GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PROPS_PRO = {
  ...GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PROPS,
  columnMenuPinningItem: {
    displayOrder: 35,
  },
};

const GridProColumnMenuSimple = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridProColumnMenuDefault(props, ref) {
    return (
      <GridGenericColumnMenuSimple
        ref={ref}
        {...props}
        defaultComponents={GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PRO}
        defaultComponentsProps={GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PROPS_PRO}
      />
    );
  },
);

GridProColumnMenuSimple.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
} as any;

export { GridProColumnMenuSimple };
