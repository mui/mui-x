import MenuList from '@material-ui/core/MenuList';
import * as React from 'react';
import { classnames } from '../../../utils/classnames';
import { isHideMenuKey, isTabKey } from '../../../utils/keyboardUtils';
import { GridColumnMenuProps } from './GridColumnMenu';

export const GridColumnMenuContainer = React.forwardRef<HTMLUListElement, GridColumnMenuProps>(
  function GridColumnMenuContainer(props: GridColumnMenuProps, ref) {
    const { hideMenu, currentColumn, open, id, labelledby, className, children, ...other } = props;

    const handleListKeyDown = React.useCallback(
      (event: React.KeyboardEvent) => {
        if (isTabKey(event.key)) {
          event.preventDefault();
        }
        if (isHideMenuKey(event.key)) {
          hideMenu();
        }
      },
      [hideMenu],
    );

    return (
      <MenuList
        id={id}
        ref={ref}
        className={classnames('MuiDataGrid-gridMenuList', className)}
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
