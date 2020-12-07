import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper, { PopperProps } from '@material-ui/core/Popper';

export interface MenuProps extends Omit<PopperProps, 'onKeyDown'> {
  open: boolean;
  target: React.ReactNode;
  onKeyDown: (event: React.KeyboardEvent<HTMLUListElement>) => void;
  onClickAway: (event: React.MouseEvent<Document, MouseEvent>) => void;
}

const transformOrigin = {
  'bottom-start': 'top left',
  'bottom-end': 'top right',
};

export const GridMenu: React.FC<MenuProps> = ({
  open,
  target,
  onKeyDown,
  onClickAway,
  children,
  ...other
}) => {
  return (
    <Popper open={open} anchorEl={target as any} transition {...other}>
      {({ TransitionProps, placement }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: transformOrigin[placement] }}>
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
