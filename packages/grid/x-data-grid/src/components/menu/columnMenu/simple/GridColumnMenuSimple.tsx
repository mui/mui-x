import * as React from 'react';
import PropTypes from 'prop-types';
import MenuList from '@mui/material/MenuList';
import { useGridColumnMenuComponents } from '../../../../hooks/features/columnMenu/useGridColumnMenuComponents';
import { GridColumnMenuContainer } from '../GridColumnMenuContainer';
import { GridColumnMenuColumnsItemSimple } from './GridColumnMenuColumnsItemSimple';
import { GridColumnMenuFilterItemSimple } from './GridColumnMenuFilterItemSimple';
import { GridColumnMenuHideItemSimple } from './GridColumnMenuHideItemSimple';
import { GridColumnMenuSortItemSimple } from './GridColumnMenuSortItemSimple';
import { GridColumnMenuProps } from '../GridColumnMenuProps';

export const GRID_COLUMN_MENU_SIMPLE_COMPONENTS = {
  ColumnMenuSortItem: GridColumnMenuSortItemSimple,
  ColumnMenuFilterItem: GridColumnMenuFilterItemSimple,
  ColumnMenuHideItem: GridColumnMenuHideItemSimple,
  ColumnMenuColumnsItem: GridColumnMenuColumnsItemSimple,
};

export const GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PROPS = {
  columnMenuSortItem: { displayOrder: 0 },
  columnMenuFilterItem: { displayOrder: 10 },
  columnMenuHideItem: { displayOrder: 20 },
  columnMenuColumnsItem: { displayOrder: 30 },
};

const GridColumnMenuSimple = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridColumnMenuSimpleRoot(props, ref) {
    const {
      defaultComponents = GRID_COLUMN_MENU_SIMPLE_COMPONENTS,
      defaultComponentsProps = GRID_COLUMN_MENU_SIMPLE_COMPONENTS_PROPS,
      components,
      componentsProps,
      ...other
    } = props;

    const orderedComponents = useGridColumnMenuComponents({
      ...other,
      defaultComponents,
      defaultComponentsProps,
      components,
      componentsProps,
    });

    return (
      <GridColumnMenuContainer MenuListComponent={MenuList} ref={ref} {...other}>
        {orderedComponents.map(([Component, extraProps], index) => (
          <Component
            key={index}
            onClick={props.hideMenu}
            column={props.currentColumn}
            {...extraProps}
          />
        ))}
      </GridColumnMenuContainer>
    );
  },
);

GridColumnMenuSimple.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * `components` could be used to add new and (or) override default column menu items
   * If you register a nee component you must pass it's `displayOrder` in `componentsProps`
   * or it will be placed in the end of the list
   */
  components: PropTypes.object,
  /**
   * Could be used to pass new props or override props specific to a column menu component
   * e.g. `displayOrder`
   */
  componentsProps: PropTypes.object,
  currentColumn: PropTypes.object.isRequired,
  /**
   * Initial `components` - it is internal, to be overrriden by Pro or Premium packages
   * @ignore - do not document.
   */
  defaultComponents: PropTypes.object,
  /**
   * Initial `componentsProps` - it is internal, to be overrriden by Pro or Premium packages
   * @ignore - do not document.
   */
  defaultComponentsProps: PropTypes.object,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuSimple };
