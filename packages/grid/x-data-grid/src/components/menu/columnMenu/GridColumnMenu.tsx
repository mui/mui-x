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
    const filterCallback =
      currentColumn.getVisibleColumnMenuItems ?? props.getVisibleColumnMenuItems;
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
  }, [
    currentColumn.getVisibleColumnMenuItems,
    props.getVisibleColumnMenuItems,
    extendedColumnMenuItems,
  ]);

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
  /**
   * To override existing and add new items in column menu
   * If the slot is already registered, it will be overwritten otherwise a new slot will be registered
   */
  columnMenuItems: PropTypes.shape({
    filter: PropTypes.shape({
      addDivider: PropTypes.bool,
      component: PropTypes.node,
      displayName: PropTypes.string,
    }).isRequired,
    hideColumn: PropTypes.shape({
      addDivider: PropTypes.bool,
      component: PropTypes.node,
      displayName: PropTypes.string,
    }).isRequired,
    manageColumns: PropTypes.shape({
      addDivider: PropTypes.bool,
      component: PropTypes.node,
      displayName: PropTypes.string,
    }).isRequired,
    sorting: PropTypes.shape({
      addDivider: PropTypes.bool,
      component: PropTypes.node,
      displayName: PropTypes.string,
    }).isRequired,
  }),
  currentColumn: PropTypes.object.isRequired,
  getVisibleColumnMenuItems: PropTypes.func,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  menuItems: PropTypes.shape({
    '__@iterator@451': PropTypes.func.isRequired,
    '__@unscopables@453': PropTypes.func.isRequired,
    at: PropTypes.func.isRequired,
    concat: PropTypes.func.isRequired,
    copyWithin: PropTypes.func.isRequired,
    entries: PropTypes.func.isRequired,
    every: PropTypes.func.isRequired,
    fill: PropTypes.func.isRequired,
    filter: PropTypes.func.isRequired,
    find: PropTypes.func.isRequired,
    findIndex: PropTypes.func.isRequired,
    flat: PropTypes.func.isRequired,
    flatMap: PropTypes.func.isRequired,
    forEach: PropTypes.func.isRequired,
    includes: PropTypes.func.isRequired,
    indexOf: PropTypes.func.isRequired,
    join: PropTypes.func.isRequired,
    keys: PropTypes.func.isRequired,
    lastIndexOf: PropTypes.func.isRequired,
    length: PropTypes.number.isRequired,
    map: PropTypes.func.isRequired,
    pop: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    reduce: PropTypes.func.isRequired,
    reduceRight: PropTypes.func.isRequired,
    reverse: PropTypes.func.isRequired,
    shift: PropTypes.func.isRequired,
    slice: PropTypes.func.isRequired,
    some: PropTypes.func.isRequired,
    sort: PropTypes.func.isRequired,
    splice: PropTypes.func.isRequired,
    toLocaleString: PropTypes.func.isRequired,
    toString: PropTypes.func.isRequired,
    unshift: PropTypes.func.isRequired,
    values: PropTypes.func.isRequired,
  }).isRequired,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenu };
