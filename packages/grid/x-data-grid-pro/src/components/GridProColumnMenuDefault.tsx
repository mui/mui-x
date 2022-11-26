import * as React from 'react';
import PropTypes from 'prop-types';
import {
  GridColumnMenuDefault,
  GridColumnMenuProps,
  GRID_COLUMN_MENU_DEFAULT_COMPONENTS,
  GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PROPS,
} from '@mui/x-data-grid';
import { GridColumnMenuPinningItem } from './GridColumnMenuPinningItem';

export const GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PRO = {
  ...GRID_COLUMN_MENU_DEFAULT_COMPONENTS,
  ColumnMenuPinningItem: GridColumnMenuPinningItem,
};

export const GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PROPS_PRO = {
  ...GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PROPS,
  columnMenuPinningItem: { displayOrder: 5 },
};

const GridProColumnMenuDefault = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridProColumnMenuDefault(props: GridColumnMenuProps, ref) {
    return (
      <GridColumnMenuDefault
        ref={ref}
        defaultComponents={GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PRO}
        defaultComponentsProps={GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PROPS_PRO}
        {...props}
      />
    );
  },
);

GridProColumnMenuDefault.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
} as any;

export { GridProColumnMenuDefault };
