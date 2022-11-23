import * as React from 'react';
import PropTypes from 'prop-types';
import {
  GridColumnMenuDefault,
  GridColumnMenuProps,
  COLUMN_MENU_DEFAULT_SLOTS,
  COLUMN_MENU_DEFAULT_SLOTS_PROPS,
} from '@mui/x-data-grid';
import { GridColumnMenuPinningItem } from './GridColumnMenuPinningItem';

export const COLUMN_MENU_DEFAULT_SLOTS_PRO = {
  ...COLUMN_MENU_DEFAULT_SLOTS,
  ColumnMenuPinningItem: GridColumnMenuPinningItem,
};

export const COLUMN_MENU_DEFAULT_SLOTS_PROPS_PRO = {
  ...COLUMN_MENU_DEFAULT_SLOTS_PROPS,
  ColumnMenuPinningItem: { displayOrder: 5 },
};

const GridProColumnMenuDefault = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridProColumnMenuDefault(props: GridColumnMenuProps, ref) {
    return (
      <GridColumnMenuDefault
        ref={ref}
        defaultSlots={COLUMN_MENU_DEFAULT_SLOTS_PRO}
        defaultSlotsProps={COLUMN_MENU_DEFAULT_SLOTS_PROPS_PRO}
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
