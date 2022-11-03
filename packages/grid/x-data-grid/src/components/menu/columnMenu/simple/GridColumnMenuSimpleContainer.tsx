import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as React from 'react';
import MenuList from '@mui/material/MenuList';
import { isHideMenuKey, isTabKey } from '../../../../utils/keyboardUtils';
import { GridColumnMenuProps } from '../GridColumnMenuProps';
import { gridClasses } from '../../../../constants/gridClasses';

interface GridColumnMenuSimpleProps
  extends Pick<
    GridColumnMenuProps,
    | 'hideMenu'
    | 'currentColumn'
    | 'open'
    | 'getVisibleColumnMenuItems'
    | 'id'
    | 'labelledby'
    | 'className'
    | 'children'
  > {}

const GridColumnMenuSimpleContainer = React.forwardRef<HTMLUListElement, GridColumnMenuSimpleProps>(
  function GridColumnMenuSimpleContainer(props: GridColumnMenuSimpleProps, ref) {
    const { hideMenu, currentColumn, open, id, labelledby, className, children, ...other } = props;

    const handleListKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (isTabKey(event.key)) {
          event.preventDefault();
        }
        if (isHideMenuKey(event.key)) {
          hideMenu(event);
        }
      },
      [hideMenu],
    );

    return (
      <MenuList
        id={id}
        ref={ref}
        className={clsx(gridClasses.menuList, className)}
        aria-labelledby={labelledby}
        onKeyDown={handleListKeyDown}
        autoFocus={open}
        {...other}
      >
        {children}
      </MenuList>
    );
  },
);

GridColumnMenuSimpleContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  currentColumn: PropTypes.object.isRequired,
  getVisibleColumnMenuItems: PropTypes.func,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuSimpleContainer };
