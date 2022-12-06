import * as React from 'react';
import PropTypes from 'prop-types';
import {
  GridGenericColumnMenuDefault,
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
  columnMenuPinningItem: { displayOrder: 15 },
};

const GridProColumnMenuDefault = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridProColumnMenuDefault(props, ref) {
    return (
      <GridGenericColumnMenuDefault
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
  colDef: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
} as any;

export { GridProColumnMenuDefault };
