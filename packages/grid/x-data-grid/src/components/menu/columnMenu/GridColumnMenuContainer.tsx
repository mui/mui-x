import clsx from 'clsx';
import PropTypes from 'prop-types';
import * as React from 'react';
import MenuList from '@mui/material/MenuList';
import { styled } from '@mui/material/styles';

import { isHideMenuKey, isTabKey } from '../../../utils/keyboardUtils';
import { GridColumnMenuContainerProps } from './GridColumnMenuProps';
import { gridClasses } from '../../../constants/gridClasses';

const StyledMenuList = styled(MenuList)(() => ({
  minWidth: 248,
}));

const GridColumnMenuContainer = React.forwardRef<HTMLUListElement, GridColumnMenuContainerProps>(
  function GridColumnMenuContainer(props, ref) {
    const { hideMenu, colDef, id, labelledby, className, children, open, MenuListProps, ...other } =
      props;

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
      <StyledMenuList
        id={id}
        ref={ref}
        className={clsx(gridClasses.menuList, className)}
        aria-labelledby={labelledby}
        onKeyDown={handleListKeyDown}
        autoFocus={open}
        {...other}
        {...MenuListProps}
      >
        {children}
      </StyledMenuList>
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
  /**
   * Props of type `Partial<MenuListProps>` to override MenuList default props
   */
  MenuListProps: PropTypes.object,
  open: PropTypes.bool.isRequired,
} as any;

export { GridColumnMenuContainer };
