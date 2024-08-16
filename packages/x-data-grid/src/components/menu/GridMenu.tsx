import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import ClickAwayListener, { ClickAwayListenerProps } from '@mui/material/ClickAwayListener';
import {
  unstable_composeClasses as composeClasses,
  unstable_useEnhancedEffect as useEnhancedEffect,
  HTMLElementType,
} from '@mui/utils';
import Grow, { GrowProps } from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper, { PopperProps } from '@mui/material/Popper';
import { styled } from '../../utils/styled';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';

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

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['menu'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridMenuRoot = styled(Popper, {
  name: 'MuiDataGrid',
  slot: 'Menu',
  overridesResolver: (_, styles) => styles.menu,
})<{ ownerState: OwnerState }>(({ theme }) => ({
  // @ts-ignore `@mui/material` theme.zIndex does not exist
  zIndex: theme.zIndex.modal,
  [`& .${gridClasses.menuList}`]: {
    outline: 0,
  },
}));

export interface GridMenuProps extends Omit<PopperProps, 'onKeyDown' | 'children'> {
  open: boolean;
  target: HTMLElement | null;
  onClose: (event?: Event) => void;
  position?: MenuPosition;
  onExited?: GrowProps['onExited'];
  children: React.ReactNode;
}

const transformOrigin = {
  'bottom-start': 'top left',
  'bottom-end': 'top right',
};

function GridMenu(props: GridMenuProps) {
  const { open, target, onClose, children, position, className, onExited, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  const savedFocusRef = React.useRef<HTMLElement | null>(null);
  useEnhancedEffect(() => {
    if (open) {
      savedFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    } else {
      savedFocusRef.current?.focus?.();
      savedFocusRef.current = null;
    }
  }, [open]);

  React.useEffect(() => {
    // Emit menuOpen or menuClose events
    const eventName = open ? 'menuOpen' : 'menuClose';
    apiRef.current.publishEvent(eventName, { target });
  }, [apiRef, open, target]);

  const handleExited = (popperOnExited: (() => void) | undefined) => (node: HTMLElement) => {
    if (popperOnExited) {
      popperOnExited();
    }

    if (onExited) {
      onExited(node);
    }
  };

  const handleClickAway: ClickAwayListenerProps['onClickAway'] = (event) => {
    if (event.target && (target === event.target || target?.contains(event.target as Node))) {
      return;
    }
    onClose(event);
  };

  return (
    <GridMenuRoot
      as={rootProps.slots.basePopper}
      className={clsx(className, classes.root)}
      ownerState={rootProps}
      open={open}
      anchorEl={target as any}
      transition
      placement={position}
      {...other}
      {...rootProps.slotProps?.basePopper}
    >
      {({ TransitionProps, placement }) => (
        <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseDown">
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: transformOrigin[placement as keyof typeof transformOrigin] }}
            onExited={handleExited(TransitionProps?.onExited)}
          >
            <Paper>{children}</Paper>
          </Grow>
        </ClickAwayListener>
      )}
    </GridMenuRoot>
  );
}

GridMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  onExited: PropTypes.func,
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
