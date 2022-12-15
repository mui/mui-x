import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as React from 'react';
import MenuList from '@mui/material/MenuList';
import { isHideMenuKey, isTabKey } from '../../../utils/keyboardUtils';
import { GridColumnMenuContainerProps } from './GridColumnMenuProps';
import { gridClasses } from '../../../constants/gridClasses';

const GridColumnMenuContainer = React.forwardRef<HTMLUListElement, GridColumnMenuContainerProps>(
  function GridColumnMenuContainer(props, ref) {
    const { hideMenu, colDef, id, labelledby, className, children, open, ...other } = props;

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

GridColumnMenuContainer.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  colDef: PropTypes.object.isRequired,
  hideMenu: PropTypes.func.isRequired,
  id: PropTypes.string,
  labelledby: PropTypes.string,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuContainer };
