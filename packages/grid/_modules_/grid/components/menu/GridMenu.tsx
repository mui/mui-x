import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper, { PopperProps } from '@material-ui/core/Popper';

type MenuPosition =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'left-end'
  | 'left-start'
  | 'left'
  | 'right-end'
  | 'right-start'
  | 'right'
  | 'top-end'
  | 'top-start'
  | 'top'
  | undefined;

export interface MenuProps extends Omit<PopperProps, 'onKeyDown'> {
  open: boolean;
  target: React.ReactNode;
  onClickAway: (event: React.MouseEvent<Document, MouseEvent>) => void;
  position?: MenuPosition;
}

const transformOrigin = {
  'bottom-start': 'top left',
  'bottom-end': 'top right',
};

export const GridMenu: React.FC<MenuProps> = ({
  open,
  target,
  onClickAway,
  children,
  position,
  ...other
}) => {
  return (
    <Popper open={open} anchorEl={target as any} transition placement={position} {...other}>
      {({ TransitionProps, placement }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: transformOrigin[placement] }}>
          <Paper>
            <ClickAwayListener onClickAway={onClickAway}>
              <div>{children}</div>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};
