import * as React from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import { useGridColumnMenuComponents } from '../../../../hooks/features/columnMenu/useGridColumnMenuComponents';
import { GridColumnMenuDefaultContainer } from './GridColumnMenuDefaultContainer';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { GridColumnMenuColumnsItem } from './GridColumnMenuColumnsItem';
import { GridColumnMenuFilterItem } from './GridColumnMenuFilterItem';
import { GridColumnMenuHideItem } from './GridColumnMenuHideItem';
import { GridColumnMenuSortItem } from './GridColumnMenuSortItem';
import { useGridPrivateApiContext } from '../../../../hooks/utils/useGridPrivateApiContext';

export const GRID_COLUMN_MENU_DEFAULT_COMPONENTS = {
  ColumnMenuSortItem: GridColumnMenuSortItem,
  ColumnMenuFilterItem: GridColumnMenuFilterItem,
  ColumnMenuHideItem: GridColumnMenuHideItem,
  ColumnMenuColumnsItem: GridColumnMenuColumnsItem,
};

export const GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PROPS = {
  columnMenuSortItem: { displayOrder: 0 },
  columnMenuFilterItem: { displayOrder: 10 },
  columnMenuHideItem: { displayOrder: 20 },
  columnMenuColumnsItem: { displayOrder: 30 },
};

const GridColumnMenuDefault = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridColumnMenuDefault(props, ref) {
    const {
      defaultComponents = GRID_COLUMN_MENU_DEFAULT_COMPONENTS,
      defaultComponentsProps = GRID_COLUMN_MENU_DEFAULT_COMPONENTS_PROPS,
      components,
      componentsProps,
      ...other
    } = props;
    const apiRef = useGridPrivateApiContext();

    const orderedComponents = useGridColumnMenuComponents(apiRef, {
      ...other,
      defaultComponents,
      defaultComponentsProps,
      components,
      componentsProps,
    });

    return (
      <GridColumnMenuDefaultContainer ref={ref} {...other}>
        {orderedComponents.map(([Component, extraProps], index: number) => (
          <div key={index}>
            <Component onClick={props.hideMenu} column={props.currentColumn} {...extraProps} />
            {index !== orderedComponents.length - 1 ? <Divider /> : null}
          </div>
        ))}
      </GridColumnMenuDefaultContainer>
    );
  },
);

GridColumnMenuDefault.propTypes = {
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
  /**
   * To initialize column menu with some custom components use `initialItems`
   * Use custom components added with `components` prop here
   */
  initialItems: PropTypes.arrayOf(PropTypes.string),
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuDefault };
