'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import HTMLElementType from '@mui/utils/HTMLElementType';
import { useChartsSlots } from '@mui/x-charts/internals';
import { type ChartsSlotsPro } from '../../internals/material';
import {
  type ChartBasePopperProps,
  type Placement,
} from '../../internals/slots/chartBaseSlotProps';

export interface ChartsMenuProps extends Pick<ChartBasePopperProps, 'className' | 'onExited'> {
  open: boolean;
  target: HTMLElement | null;
  onClose: (event?: Event) => void;
  position?: Placement;
  children: React.ReactNode;
}

function ChartsMenu(props: ChartsMenuProps) {
  const { open, target, onClose, children, position, className, onExited, ...other } = props;
  const { slots, slotProps } = useChartsSlots<ChartsSlotsPro>();
  const Popper = slots.basePopper;

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

  const handleClickAway = (event: MouseEvent | TouchEvent) => {
    if (event.target && (target === event.target || target?.contains(event.target as Node))) {
      return;
    }

    onClose(event);
  };

  return (
    <Popper
      open={open}
      target={target}
      transition
      placement={position}
      onClickAway={handleClickAway}
      onExited={onExited}
      clickAwayMouseEvent="onMouseDown"
      {...other}
      {...slotProps?.basePopper}
    >
      {children}
    </Popper>
  );
}

ChartsMenu.propTypes = {
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

export { ChartsMenu };
