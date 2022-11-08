import * as React from 'react';
import PropTypes from 'prop-types';
import { GridColumnMenuKey } from '../../../hooks/features/columnMenu';
import { GridColumnMenuProps } from './GridColumnMenuProps';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';

const GridColumnMenu = (props: GridColumnMenuProps) => {
  const {
    hideMenu,
    currentColumn,
    defaultMenuItems,
    defaultVisibleItems,
    columnMenuItems: userMenuItems,
  } = props;

  const apiRef = useGridApiContext();

  const preProcessedValue = apiRef.current.unstable_applyPipeProcessors(
    'columnMenu',
    { items: defaultMenuItems, visibleItemKeys: defaultVisibleItems },
    currentColumn,
  );

  const extendedColumnMenuItems = React.useMemo(() => {
    if (!userMenuItems || !Object.keys(userMenuItems).length) {
      return preProcessedValue.items;
    }

    return { ...preProcessedValue.items, ...userMenuItems };
  }, [preProcessedValue.items, userMenuItems]);

  const filteredAndSortedItemKeys = React.useMemo(() => {
    const filterCallback =
      currentColumn.getVisibleColumnMenuItems ?? props.getVisibleColumnMenuItems;

    const itemKeys = Object.keys(extendedColumnMenuItems) as Array<GridColumnMenuKey>;

    const filteredItemKeys =
      !filterCallback || typeof filterCallback !== 'function'
        ? preProcessedValue.visibleItemKeys
        : filterCallback({ itemKeys, column: currentColumn, visibleItemKeys: defaultVisibleItems });

    const visibleItems = filteredItemKeys || defaultVisibleItems;

    return visibleItems;
  }, [
    currentColumn,
    props.getVisibleColumnMenuItems,
    extendedColumnMenuItems,
    preProcessedValue.visibleItemKeys,
    defaultVisibleItems,
  ]);

  return (
    <React.Fragment>
      {filteredAndSortedItemKeys.map((itemKey, index: number) => {
        const component = extendedColumnMenuItems[itemKey];
        if (!component) {
          return null;
        }
        const itemProps = {
          onClick: hideMenu,
          column: currentColumn,
          key: index,
        };

        return React.cloneElement(component, itemProps);
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
   * If the item is already registered, it will be overwritten otherwise a new item will be registered
   */
  columnMenuItems: PropTypes.shape({
    divider: PropTypes.element,
    filter: PropTypes.element,
    hideColumn: PropTypes.element,
    manageColumns: PropTypes.element,
    sorting: PropTypes.element,
  }),
  currentColumn: PropTypes.object.isRequired,
  defaultMenuItems: PropTypes.shape({
    divider: PropTypes.element,
    filter: PropTypes.element,
    hideColumn: PropTypes.element,
    manageColumns: PropTypes.element,
    sorting: PropTypes.element,
  }).isRequired,
  /**
   * Default column menu items in order that needs to be shown
   * Could be overriden by `getVisibleColumnMenuItems`
   */
  defaultVisibleItems: PropTypes.arrayOf(
    PropTypes.oneOf(['divider', 'filter', 'hideColumn', 'manageColumns', 'sorting']).isRequired,
  ).isRequired,
  getVisibleColumnMenuItems: PropTypes.func,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenu };
