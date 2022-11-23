import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuDefault, GridColumnMenuProps, gridColumnMenuSlots } from '@mui/x-data-grid';
import { GridColumnMenuPinningItem } from './GridColumnMenuPinningItem';

export const gridProColumnMenuSlots = {
  ...gridColumnMenuSlots,
  ColumnMenuPinningItem: { component: GridColumnMenuPinningItem, displayOrder: 5 },
};

const GridProColumnMenuDefault = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridProColumnMenuDefault(props: GridColumnMenuProps, ref) {
    return (
      <GridColumnMenuDefault ref={ref} slots={props.slots || gridProColumnMenuSlots} {...props} />
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
