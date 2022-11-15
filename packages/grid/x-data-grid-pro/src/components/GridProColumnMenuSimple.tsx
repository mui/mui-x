import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import {
  GridColumnMenuSimpleRoot,
  GridColumnMenuDefaultProps,
  gridColumnMenuSimpleSlots,
  gridColumnMenuSimpleInitItems,
  GridColumnMenuItemProps,
} from '@mui/x-data-grid';
import { GridColumnMenuPinningItemSimple } from './GridColumnMenuPinningItemSimple';

const PinningWithDivider = (props: GridColumnMenuItemProps) => (
  <React.Fragment>
    <Divider />
    <GridColumnMenuPinningItemSimple {...props} />
  </React.Fragment>
);

export const gridProColumnMenuSimpleSlots = {
  ...gridColumnMenuSimpleSlots,
  ColumnMenuPinningItem: { component: PinningWithDivider, priority: 45 },
};

export const gridProColumnMenuSimpleInitItems = [...gridColumnMenuSimpleInitItems];

const GridProColumnMenuSimple = React.forwardRef<HTMLUListElement, GridColumnMenuDefaultProps>(
  function GridProColumnMenuDefault(props, ref) {
    return (
      <GridColumnMenuSimpleRoot
        ref={ref}
        {...props}
        slots={gridProColumnMenuSimpleSlots}
        initialItems={gridProColumnMenuSimpleInitItems}
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
