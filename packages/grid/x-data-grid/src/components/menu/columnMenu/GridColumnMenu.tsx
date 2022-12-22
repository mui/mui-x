import * as React from 'react';
import PropTypes from 'prop-types';

import { useGridColumnMenuComponents } from '../../../hooks/features/columnMenu/useGridColumnMenuComponents';
import { GridColumnMenuContainer } from './GridColumnMenuContainer';
import { GridColumnMenuColumnsItem } from './menuItems/GridColumnMenuColumnsItem';
import { GridColumnMenuFilterItem } from './menuItems/GridColumnMenuFilterItem';
import { GridColumnMenuSortItem } from './menuItems/GridColumnMenuSortItem';
import { GridColumnMenuProps, GridGenericColumnMenuProps } from './GridColumnMenuProps';

export const GRID_COLUMN_MENU_COMPONENTS = {
  ColumnMenuSortItem: GridColumnMenuSortItem,
  ColumnMenuFilterItem: GridColumnMenuFilterItem,
  ColumnMenuColumnsItem: GridColumnMenuColumnsItem,
};

export const GRID_COLUMN_MENU_COMPONENTS_PROPS = {
  columnMenuSortItem: { displayOrder: 10 },
  columnMenuFilterItem: { displayOrder: 20 },
  columnMenuColumnsItem: { displayOrder: 30 },
};

const GridGenericColumnMenu = React.forwardRef<HTMLUListElement, GridGenericColumnMenuProps>(
  function GridGenericColumnMenu(props, ref) {
    const { defaultComponents, defaultComponentsProps, components, componentsProps, ...other } =
      props;

    const orderedComponents = useGridColumnMenuComponents({
      ...other,
      defaultComponents,
      defaultComponentsProps,
      components,
      componentsProps,
    });

    return (
      <GridColumnMenuContainer ref={ref} {...other}>
        {orderedComponents.map(([Component, componentProps], index) => (
          <Component key={index} {...componentProps} />
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
        defaultComponents={GRID_COLUMN_MENU_COMPONENTS}
        defaultComponentsProps={GRID_COLUMN_MENU_COMPONENTS_PROPS}
      />
    );
  },
);

GridColumnMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
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
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenu, GridGenericColumnMenu };
