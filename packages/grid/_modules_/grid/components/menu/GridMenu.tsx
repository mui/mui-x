import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { createTheme } from '../../utils/utils';

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

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme: Theme) => ({
    root: {
      zIndex: theme.zIndex.modal,
      '& .MuiDataGrid-gridMenuList': {
        // TODO: Rename to MuiGridMenu-menuList
        outline: 0,
      },
    },
  }),
  { name: 'MuiGridMenu', defaultTheme },
);

export interface GridMenuProps extends Omit<PopperProps, 'onKeyDown'> {
  open: boolean;
  target: React.ReactNode;
  onClickAway: (event: MouseEvent | TouchEvent) => void;
  position?: MenuPosition;
}

const transformOrigin = {
  'bottom-start': 'top left',
  'bottom-end': 'top right',
};

export const GridMenu = (props: GridMenuProps) => {
  const { open, target, onClickAway, children, position, ...other } = props;
  const prevTarget = React.useRef(target);
  const prevOpen = React.useRef(open);
  const classes = useStyles();

  React.useEffect(() => {
    if (prevOpen.current && prevTarget.current) {
      (prevTarget.current as HTMLElement).focus();
    }

    prevOpen.current = open;
    prevTarget.current = target;
  }, [open, target]);

  return (
    <Popper
      className={classes.root}
      open={open}
      anchorEl={target as any}
      transition
      placement={position}
      {...other}
    >
      {({ TransitionProps, placement }) => (
        <ClickAwayListener onClickAway={onClickAway}>
          <Grow {...TransitionProps} style={{ transformOrigin: transformOrigin[placement] }}>
            <Paper>{children}</Paper>
          </Grow>
        </ClickAwayListener>
      )}
    </Popper>
  );
};
