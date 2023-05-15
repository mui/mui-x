import * as React from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import type { GridMenuProps } from '../../components/menu/GridMenu';

const transformOrigin = {
  'bottom-start': 'top left',
  'bottom-end': 'top right',
};

export default function GridMenu(props: GridMenuProps) {
  const { open, target, position, children, onClickAway, onExited, ...other } = props;

  const handleExited = (popperOnExited: (() => void) | undefined) => () => {
    if (popperOnExited) {
      popperOnExited();
    }

    if (onExited) {
      onExited();
    }
  };

  return (
    <Popper open={open} anchorEl={target} transition placement={position} {...other}>
      {({ TransitionProps, placement }) => (
        <ClickAwayListener onClickAway={onClickAway} mouseEvent="onMouseDown">
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: transformOrigin[placement as keyof typeof transformOrigin] }}
            onExited={handleExited(TransitionProps?.onExited)}
          >
            <Paper>{children}</Paper>
          </Grow>
        </ClickAwayListener>
      )}
    </Popper>
  );
}
