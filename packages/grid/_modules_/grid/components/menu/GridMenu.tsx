import * as React from 'react';
import PropTypes from 'prop-types';
import ClickAwayListener, { ClickAwayListenerProps } from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper, { PopperProps } from '@mui/material/Popper';
import { styled } from '@mui/material/styles';
import { HTMLElementType } from '@mui/utils';
import { gridClasses } from '../../gridClasses';

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

const StyledPopper = styled(Popper, {
  name: 'MuiGridMenu',
  slot: 'Root',
})(({ theme }) => ({
  zIndex: theme.zIndex.modal,
  [`& .${gridClasses.menuList}`]: {
    outline: 0,
  },
}));

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
  const prevTarget = React.useRef(target);
  const prevOpen = React.useRef(open);

  React.useEffect(() => {
    if (prevOpen.current && prevTarget.current) {
      (prevTarget.current as HTMLElement).focus();
    }

    prevOpen.current = open;
    prevTarget.current = target;
  }, [open, target]);

  return (
    <StyledPopper open={open} anchorEl={target as any} transition placement={position} {...other}>
      {({ TransitionProps, placement }) => (
        <ClickAwayListener onClickAway={onClickAway}>
          <Grow {...TransitionProps} style={{ transformOrigin: transformOrigin[placement] }}>
            <Paper>{children}</Paper>
          </Grow>
        </ClickAwayListener>
      )}
    </StyledPopper>
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
