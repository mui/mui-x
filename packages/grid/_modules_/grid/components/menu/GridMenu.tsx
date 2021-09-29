import * as React from 'react';
import PropTypes from 'prop-types';
import ClickAwayListener, { ClickAwayListenerProps } from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper, { PopperProps } from '@mui/material/Popper';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { HTMLElementType } from '@mui/utils';
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
  onClickAway: ClickAwayListenerProps['onClickAway'];
  position?: MenuPosition;
}

const transformOrigin = {
  'bottom-start': 'top left',
  'bottom-end': 'top right',
};

const GridMenu = (props: GridMenuProps) => {
  const { open, target, onClickAway, children, position, ...other } = props;

  const [stateTarget, setStateTarget] = React.useState(target);
  const prevTarget = React.useRef(target);
  const prevOpen = React.useRef(open);
  const classes = useStyles();

  if (target && target !== stateTarget) {
    setStateTarget(target);
  }

  React.useEffect(() => {
    if (prevOpen.current && prevTarget.current) {
      (prevTarget.current as HTMLElement).focus();
    }

    prevOpen.current = open;

    if (stateTarget) {
      prevTarget.current = stateTarget;
    }
  }, [open, stateTarget]);

  const handleTransitionEnd = React.useCallback(() => {
    if (!target) {
      setStateTarget(null);
    }
  }, [target]);

  return (
    <Popper
      className={classes.root}
      open={open}
      anchorEl={stateTarget as any}
      transition
      onTransitionEnd={handleTransitionEnd}
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

GridMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  onClickAway: PropTypes.func.isRequired,
  /**
   * If `true`, the component is shown.
   */
  open: PropTypes.bool.isRequired,
  position: PropTypes.oneOf([
    'bottom-end',
    'bottom-start',
    'bottom',
    'left-end',
    'left-start',
    'left',
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
  ]),
  target: HTMLElementType,
} as any;

export { GridMenu };
