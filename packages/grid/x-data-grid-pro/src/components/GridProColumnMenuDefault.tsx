import * as React from 'react';
import PropTypes from 'prop-types';
import {
  GridColumnMenuDefaultRoot,
  GridColumnMenuDefaultProps,
  gridColumnMenuSlots,
  gridColumnMenuInitItems,
} from '@mui/x-data-grid';
import { GridColumnMenuPinningItem } from './GridColumnMenuPinningItem';

export const gridProColumnMenuSlots = {
  ...gridColumnMenuSlots,
  ColumnMenuPinningItem: { component: GridColumnMenuPinningItem, priority: 5 },
};

export const gridProColumnMenuInitItems = [...gridColumnMenuInitItems];

const GridProColumnMenuDefault = React.forwardRef<HTMLDivElement, GridColumnMenuDefaultProps>(
  function GridProColumnMenuDefault(props: GridColumnMenuDefaultProps, ref) {
    return (
      <GridColumnMenuDefaultRoot
        ref={ref}
        {...props}
        slots={gridProColumnMenuSlots}
        initialItems={gridProColumnMenuInitItems}
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
