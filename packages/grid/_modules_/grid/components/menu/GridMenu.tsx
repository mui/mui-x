import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';

export interface MenuProps {
  open: boolean;
  target: React.ReactNode;
  onKeyDown: (event: React.KeyboardEvent<HTMLUListElement>) => void;
  onClickAway: (event: React.MouseEvent<Document, MouseEvent>) => void;
}

export const GridMenu: React.FC<MenuProps> = ({
  open,
  target,
  onKeyDown,
  onClickAway,
  children,
}) => {
  return (
    <Popper open={open} anchorEl={target as any} transition>
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
        >
          <Paper>
            <ClickAwayListener onClickAway={onClickAway}>
              <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={onKeyDown}>
                {children}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};
