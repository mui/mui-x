import clsx from 'clsx';
import * as React from 'react';
import MenuList from '@material-ui/core/MenuList';
import { isHideMenuKey, isTabKey } from '../../../utils/keyboardUtils';
import { GridColumnMenuProps } from './GridColumnMenuProps';

export const GridColumnMenuContainer = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridColumnMenuContainer(props: GridColumnMenuProps, ref) {
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
        className={clsx('MuiDataGrid-gridMenuList', className)}
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
