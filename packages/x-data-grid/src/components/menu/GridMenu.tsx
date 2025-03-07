import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  unstable_composeClasses as composeClasses,
  unstable_useEnhancedEffect as useEnhancedEffect,
  HTMLElementType,
} from '@mui/utils';
import { styled } from '@mui/material/styles';
import { PopperProps } from '../../models/gridBaseSlots';
import { GridSlotProps } from '../../models/gridSlotsComponent';
import { vars } from '../../constants/cssVariables';
import { useCSSVariablesClass } from '../../utils/css/context';
import { getDataGridUtilityClass, gridClasses } from '../../constants/gridClasses';
import type { DataGridProcessedProps } from '../../models/props/DataGridProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { NotRendered } from '../../utils/assert';

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

const GridMenuRoot = styled(NotRendered<GridSlotProps['basePopper']>, {
  name: 'MuiDataGrid',
  slot: 'Menu',
})<{ ownerState: OwnerState }>({
  zIndex: vars.zIndex.menu,
  [`& .${gridClasses.menuList}`]: {
    outline: 0,
  },
});

export interface GridMenuProps extends Pick<PopperProps, 'className' | 'onExited'> {
  open: boolean;
  target: HTMLElement | null;
  onClose: (event?: Event) => void;
  position?: MenuPosition;
  children: React.ReactNode;
}

function GridMenu(props: GridMenuProps) {
  const { open, target, onClose, children, position, className, onExited, ...other } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const variablesClass = useCSSVariablesClass();

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

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (event.target && (target === event.target || target?.contains(event.target as Node))) {
      return;
    }
    onClose(event);
  };

  return (
    <GridMenuRoot
      as={rootProps.slots.basePopper}
      className={clsx(classes.root, className, variablesClass)}
      ownerState={rootProps}
      open={open}
      target={target}
      transition
      placement={position}
      onClickAway={handleClickAway}
      onExited={onExited}
      clickAwayMouseEvent="onMouseDown"
      {...other}
      {...rootProps.slotProps?.basePopper}
    >
      {children}
    </GridMenuRoot>
  );
}

GridMenu.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  className: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onExited: PropTypes.func,
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
