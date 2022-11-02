import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import {
  GridColumnMenuLookup,
  GridColumnMenuSlot,
  GridColumnMenuValue,
} from '../../../hooks/features/columnMenu';
import { GridColumnMenuProps } from './GridColumnMenuProps';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';

const GridColumnMenu = (props: GridColumnMenuProps) => {
  const { hideMenu, currentColumn, menuItems, columnMenuItems: userItems } = props;

  const apiRef = useGridApiContext();

  const preProcessedValue = apiRef.current.unstable_applyPipeProcessors(
    'columnMenu',
    menuItems,
    currentColumn,
  );

  const extendedColumnMenuItems = React.useMemo(() => {
    if (!userItems || !Object.keys(userItems).length) {
      return preProcessedValue;
    }
    // Overrides for default items
    const userSlots = new Set<GridColumnMenuSlot>(
      Object.keys(userItems) as Array<GridColumnMenuSlot>,
    );
    const overridenItems = preProcessedValue.reduce((acc, item) => {
      if (userSlots.has(item.slot)) {
        // override
        userSlots.delete(item.slot);
        return [...acc, { ...item, ...userItems[item.slot] }];
      }
      return [...acc, item];
    }, [] as GridColumnMenuValue);

    // New items to add
    // TODO: Handle typings for newly added slots
    if (userSlots.size > 0) {
      const newItems = Array.from(userSlots).map((slot: GridColumnMenuSlot) => ({
        slot,
        ...userItems[slot],
      }));
      return [...overridenItems, ...newItems];
    }
    return overridenItems;
  }, [preProcessedValue, userItems]);

  const filteredColumnMenuItems: GridColumnMenuValue = React.useMemo(() => {
    const filterCallback = currentColumn.filterColumnMenuItems ?? props.filterColumnMenuItems;
    if (!filterCallback || typeof filterCallback !== 'function') {
      return extendedColumnMenuItems;
    }

    const menuItemSlots = extendedColumnMenuItems.reduce(
      (slots, item) => (item.slot ? [...slots, item.slot] : slots),
      [] as Array<GridColumnMenuLookup['slot']>,
    );
    const filteredSlots = filterCallback(menuItemSlots);
    if (!filteredSlots?.length) {
      return extendedColumnMenuItems;
    }

    return filteredSlots.reduce((acc, slot) => {
      const item = extendedColumnMenuItems.find((menuItem) => menuItem.slot === slot);
      return item ? [...acc, item] : acc;
    }, [] as GridColumnMenuValue);
  }, [currentColumn.filterColumnMenuItems, props.filterColumnMenuItems, extendedColumnMenuItems]);

  return (
    <React.Fragment>
      {filteredColumnMenuItems.map((item: any, index: number) => {
        const itemProps = {
          ...item.component.props,
          onClick: hideMenu,
          column: currentColumn,
        };
        return item.component.type(itemProps) ? (
          <React.Fragment key={index}>
            <item.component.type {...itemProps} />
            {item.addDivider ? <Divider /> : null}
          </React.Fragment>
        ) : null;
      })}
    </React.Fragment>
  );
};

GridColumnMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  currentColumn: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenu };
