import * as React from 'react';
import PropTypes from 'prop-types';

import { useGridColumnMenuSlots } from '../../../hooks/features/columnMenu/useGridColumnMenuSlots';
import { GridColumnMenuContainer } from './GridColumnMenuContainer';
import { GridColumnMenuColumnsItem } from './menuItems/GridColumnMenuColumnsItem';
import { GridColumnMenuFilterItem } from './menuItems/GridColumnMenuFilterItem';
import { GridColumnMenuSortItem } from './menuItems/GridColumnMenuSortItem';
import { GridColumnMenuProps, GridGenericColumnMenuProps } from './GridColumnMenuProps';

export const GRID_COLUMN_MENU_SLOTS = {
  columnMenuSortItem: GridColumnMenuSortItem,
  columnMenuFilterItem: GridColumnMenuFilterItem,
  columnMenuColumnsItem: GridColumnMenuColumnsItem,
};

export const GRID_COLUMN_MENU_SLOT_PROPS = {
  columnMenuSortItem: { displayOrder: 10 },
  columnMenuFilterItem: { displayOrder: 20 },
  columnMenuColumnsItem: { displayOrder: 30 },
};

const GridGenericColumnMenu = React.forwardRef<HTMLUListElement, GridGenericColumnMenuProps>(
  function GridGenericColumnMenu(props, ref) {
    const { defaultSlots, defaultSlotProps, slots, slotProps, ...other } = props;

    const orderedSlots = useGridColumnMenuSlots({
      ...other,
      defaultSlots,
      defaultSlotProps,
      slots,
      slotProps,
    });

    return (
      <GridColumnMenuContainer ref={ref} {...other}>
        {orderedSlots.map(([Component, otherProps], index) => (
          <Component key={index} {...otherProps} />
        ))}
      </GridColumnMenuContainer>
    );
  },
);

const GridColumnMenu = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridColumnMenu(props, ref) {
    return (
      <GridGenericColumnMenu
        {...props}
        ref={ref}
        defaultSlots={GRID_COLUMN_MENU_SLOTS}
        defaultSlotProps={GRID_COLUMN_MENU_SLOT_PROPS}
      />
    );
  },
);

GridColumnMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
  /**
   * Could be used to pass new props or override props specific to a column menu component
   * e.g. `displayOrder`
   */
  slotProps: PropTypes.object,
  /**
   * `slots` could be used to add new and (or) override default column menu items
   * If you register a nee component you must pass it's `displayOrder` in `slotProps`
   * or it will be placed in the end of the list
   */
  slots: PropTypes.object,
} as any;

export { GridColumnMenu, GridGenericColumnMenu };
