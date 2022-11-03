import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuLookup, GridColumnMenuValue } from '../../../hooks/features/columnMenu';
import { GridColumnMenuProps } from './GridColumnMenuProps';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';

const GridColumnMenu = (props: GridColumnMenuProps) => {
  const {
    hideMenu,
    currentColumn,
    defaultMenuItems,
    defaultVisibleSlots,
    columnMenuItems: userMenuItems,
  } = props;

  const apiRef = useGridApiContext();

  const preProcessedValue = apiRef.current.unstable_applyPipeProcessors(
    'columnMenu',
    { items: defaultMenuItems, visibleSlots: defaultVisibleSlots },
    currentColumn,
  );

  const extendedColumnMenuItems = React.useMemo(() => {
    if (!userMenuItems || !Object.keys(userMenuItems).length) {
      return preProcessedValue.items;
    }
    // Overrides for default items
    const userSlots = new Set<GridColumnMenuLookup['slot']>(
      Object.keys(userMenuItems) as Array<GridColumnMenuLookup['slot']>,
    );

    const overridenItems = preProcessedValue.items.reduce((acc, item) => {
      if (userSlots.has(item.slot)) {
        // override
        userSlots.delete(item.slot);
        return [...acc, { ...item, ...userMenuItems[item.slot] }];
      }
      return [...acc, item];
    }, [] as GridColumnMenuValue['items']);

    // New items to add
    // TODO: Handle typings for newly added slots
    if (userSlots.size > 0) {
      const newItems = Array.from(userSlots).map((slot: GridColumnMenuLookup['slot']) => ({
        slot,
        ...userMenuItems[slot],
      }));

      return [...overridenItems, ...newItems];
    }
    return overridenItems;
  }, [preProcessedValue.items, userMenuItems]);

  const filteredColumnMenuItems: GridColumnMenuValue['items'] = React.useMemo(() => {
    const filterCallback =
      currentColumn.getVisibleColumnMenuItems ?? props.getVisibleColumnMenuItems;

    const menuItemSlots = extendedColumnMenuItems.map((item) => item.slot);

    const filteredSlots: Array<GridColumnMenuLookup['slot']> =
      !filterCallback || typeof filterCallback !== 'function'
        ? preProcessedValue.visibleSlots
        : filterCallback(menuItemSlots);

    if (!filteredSlots?.length) {
      return extendedColumnMenuItems;
    }

    return filteredSlots.reduce((acc, slot) => {
      const item = extendedColumnMenuItems.find((menuItem) => menuItem.slot === slot);
      return item ? [...acc, item] : acc;
    }, [] as GridColumnMenuValue['items']);
  }, [
    currentColumn.getVisibleColumnMenuItems,
    props.getVisibleColumnMenuItems,
    extendedColumnMenuItems,
    preProcessedValue.visibleSlots,
  ]);

  return (
    <React.Fragment>
      {filteredColumnMenuItems.map((item: any, index: number) => {
        const itemProps = {
          ...item.component.props,
          onClick: hideMenu,
          column: currentColumn,
          key: index,
        };

        return React.cloneElement(item.component, itemProps);
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
    divider: PropTypes.shape({
      component: PropTypes.node,
      displayName: PropTypes.string,
    }).isRequired,
    filter: PropTypes.shape({
      component: PropTypes.node,
      displayName: PropTypes.string,
    }).isRequired,
    hideColumn: PropTypes.shape({
      component: PropTypes.node,
      displayName: PropTypes.string,
    }).isRequired,
    manageColumns: PropTypes.shape({
      component: PropTypes.node,
      displayName: PropTypes.string,
    }).isRequired,
    sorting: PropTypes.shape({
      component: PropTypes.node,
      displayName: PropTypes.string,
    }).isRequired,
  }),
  currentColumn: PropTypes.object.isRequired,
  defaultMenuItems: PropTypes.arrayOf(
    PropTypes.shape({
      component: PropTypes.node,
      displayName: PropTypes.string,
      slot: PropTypes.oneOf(['divider', 'filter', 'hideColumn', 'manageColumns', 'sorting'])
        .isRequired,
    }),
  ).isRequired,
  /**
   * Default column menu items in order that needs to be shown
   * Could be overriden by `getVisibleColumnMenuItems`
   */
  defaultVisibleSlots: PropTypes.arrayOf(
    PropTypes.oneOf(['divider', 'filter', 'hideColumn', 'manageColumns', 'sorting']).isRequired,
  ).isRequired,
  getVisibleColumnMenuItems: PropTypes.func,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenu };
